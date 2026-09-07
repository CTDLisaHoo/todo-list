//pages/TodosPage.jsx

import { useEffect, useReducer } from 'react';
import TodoList from '../features/Todos/TodoList/TodoList';
import TodoForm from '../features/Todos/TodoForm';
import SortBy from '../shared/SortBy';
import useDebounce from '../utils/useDebounce';
import FilterInput from '../shared/FilterInput';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;
  
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  // Get status filter from URL, default to 'all'
  const statusFilter = searchParams.get('status') || 'all';

  // --------------------------------
  // FILTER
  // --------------------------------
  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm: newTerm,
      },
    });
  };

  // --------------------------------
  // FETCH TODOS
  // --------------------------------
  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START, });  

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (response.status === 404 && debouncedFilterTerm) {
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: {
              todos: [],
            },
          });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: {
            todos: data.tasks ?? [],
          },
        });
        
      } catch (error) {
        const isFilterError =
          Boolean(debouncedFilterTerm) ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'asc';

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `Error filtering/sorting todos: ${error.message}`
              : `Error fetching todos: ${error.message}`,
            isFilterError,
          },
        });
      }
    }
    fetchTodos();
  }, [ token, sortBy, sortDirection, debouncedFilterTerm]);

  // --------------------------------
  // ADD TODO
  // --------------------------------
  const addTodo = async (todoTitle) => {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        todo: newTodo,
      },
    });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          todo: data,
        },
      });
      } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          error: error.message,
        },
      });
    }
  };
  // --------------------------------
  // COMPLETE TODO
  // --------------------------------
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      dispatch({
        type: TODO_ACTIONS.SET_ERROR,
        payload: {
          message: 'Unable to find this todo. Please try again.',
        },
      });

      return;
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id, },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: { id, },
      });

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          error: error.message,
        },
       }); 
    }
  };

  // --------------------------------
  // UPDATE TODO
  // --------------------------------
  const updateTodo = async (editedTodo) => {
    
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    if (!originalTodo) {
      dispatch({
        type: TODO_ACTIONS.SET_ERROR,
        payload: {
          message: 'Unable to find this todo. Please try again.',
        },
      });

      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo, },
    });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: {
          id: editedTodo.id,
        },
      });

    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          error: error.message,
        },
      });
    }
  };

  // --------------------------------
  // RESET FILTERS
  // --------------------------------
  const resetFilters = () => {
    dispatch({
      type: TODO_ACTIONS.RESET_FILTERS,
    });
  };

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button 
              type="button" 
              onClick={() => 
                dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
             }
            >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button 
              type="button" 
              onClick={() => 
               dispatch({
                type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
              })
             }
            >
             Clear Filter Error
          </button>

          <button 
            type="button" 
            onClick={resetFilters}
            >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
              sortDirection,
            },
          })
        }
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: newSortDirection,
            },
          })
        }
      />
      <StatusFilter/> 
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
