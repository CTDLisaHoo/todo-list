//features/Todos/TodosPage.jsx

import { useEffect, useState, useCallback } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';
import SortBy from '../../shared/SortBy';
import useDebounce from '../../utils/useDebounce';
import FilterInput from '../../shared/FilterInput';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const [filterTerm, setFilterTerm] = useState('');
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

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

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        setTodoList(data.tasks ?? []);
        setFilterError('');
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'desc'
        ) {
          setFilterError(
            `Error filtering/sorting todos: ${error.message}`
          );
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const addTodo = async (todoTitle) => {
    setError('');

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList((previous) => [...previous, newTodo]);

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

      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === newTodo.id ? data : todo
        )
      );

      invalidateCache();
    } catch (error) {
      setTodoList((previous) =>
        previous.filter((todo) => todo.id !== newTodo.id)
      );

      setError(error.message);
    }
  };

  const completeTodo = async (id) => {
    setError('');

    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      setError('Unable to find this todo. Please try again.');
      return;
    }

    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );

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

      invalidateCache();
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === id ? originalTodo : todo
        )
      );

      setError(error.message);
    }
  };

  const updateTodo = async (editedTodo) => {
    setError('');

    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    if (!originalTodo) {
      setError('Unable to find this todo. Please try again.');
      return;
    }

    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === editedTodo.id ? editedTodo : todo
      )
    );

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

      invalidateCache();
    } catch (error) {
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );

      setError(error.message);
    }
  };

  const resetFilters = () => {
    setFilterTerm('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setFilterError('');
  };

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button type="button" onClick={() => setError('')}>
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button type="button" onClick={() => setFilterError('')}>
            Clear Filter Error
          </button>

          <button type="button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

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
      />
    </div>
  );
}

export default TodosPage;
