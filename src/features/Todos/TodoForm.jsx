//features/Todos/TodoForm.jsx

import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  validateTodoTitle,
  MAX_TODO_TITLE_LENGTH,
} from '../../utils/todoValidation.js';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();

  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [error, setError] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    const errorMessage = validateTodoTitle(workingTodoTitle);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    onAddTodo(workingTodoTitle.trim());
    setWorkingTodoTitle('');
    setError('');
    inputRef.current.focus();
  };

  const handleTitleChange = (event) => {
    setWorkingTodoTitle(event.target.value);
    setError('');
  };

  return (
    <form className={styles.todoForm} onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo:"
        ref={inputRef}
        value={workingTodoTitle}
        maxLength={MAX_TODO_TITLE_LENGTH}
        onChange={handleTitleChange}
      />

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={styles.addButton}
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
