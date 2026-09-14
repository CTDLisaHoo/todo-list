//features/Todos/TodoList/TodoListItem.jsx

import { useRef, useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import {
  isValidTodoTitle,
  validateTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../../utils/todoValidation.js';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const inputRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const [error, setError] = useState('');

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setError('');
    setIsEditing(false);
  };

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
    setError('');
  };

  const handleUpdate = (event) => {
    if (!isEditing) return;

    event.preventDefault();

    const errorMessage = validateTodoTitle(workingTitle);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    onUpdateTodo({
      ...todo,
      title: workingTitle.trim(),
    });

    setError('');
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${todo.title}"?`
    );

    if (confirmed) {
      onDeleteTodo(todo.id);
    }
  };

  return (
    <li className={styles.todoItem}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todoTitle${todo.id}`}
              labelText="Todo"
              ref={inputRef}
              value={workingTitle}
              maxLength={MAX_TODO_TITLE_LENGTH}
              onChange={handleEdit}
              className={styles.editInput}
            />

            {error && (
              <p className={styles.editError} role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.updateButton}
              disabled={!isValidTodoTitle(workingTitle)}
            >
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                className={styles.checkbox}
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>

            <span
              className={styles.todoTitle}
              onClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
