//features/Todos/TodosPage.jsx

import { useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList';
import TodoForm from './TodoForm';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          limit: 100,
        });

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
      } catch (error) {
        setError(error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }
    
    fetchTodos();
  }, [token]);

  const addTodo = async (todoTitle) => {
    setError('');

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    // Optimistically add the todo immediately
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

      // Replace temporary todo with the real server todo
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === newTodo.id ? data : todo
        )
      );
    } catch (error) {
      // Remove failed todo
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
    // Optimistically mark as completed
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
    } catch (error) {
      // Roll back to original todo
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

    // Optimistically update the todo
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
    } catch (error) {
      // Roll back to original todo
      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );

      setError(error.message);
    }
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

      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;