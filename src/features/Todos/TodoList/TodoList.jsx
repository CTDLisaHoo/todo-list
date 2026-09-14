// features/Todos/TodoList/TodoList.jsx

import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
import styles from './TodoList.module.css';

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
  statusFilter = 'active',
}) {
  const filteredTodoList = useMemo(() => {
    switch (statusFilter) {
      case 'completed':
        return todoList.filter((todo) => todo.isCompleted);

      case 'active':
        return todoList.filter((todo) => !todo.isCompleted);

      case 'all':
      default:
        return todoList;
    }
  }, [todoList, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return {
          title: 'No completed todos',
          message:
            'Complete some tasks to see them here.',
        };

      case 'active':
        return {
          title: 'No active todos',
          message:
            'Add a todo above to get started.',
        };

      case 'all':
      default:
        return {
          title: 'No todos yet',
          message:
            'Add a todo above to get started.',
        };
    }
  };

  if (filteredTodoList.length === 0) {
    const emptyMessage = getEmptyMessage();

    return (
      <section className={styles.emptyState} aria-live="polite">
        <h2>{emptyMessage.title}</h2>
        <p>{emptyMessage.message}</p>
      </section>
    );
  }

  return (
    <ul className={styles.todoList}>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
