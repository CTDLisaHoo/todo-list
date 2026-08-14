//features/TodoForm.jsx

import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../utils/todoValidation.js';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();
  
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  const handleAddTodo = (event) => {
    event.preventDefault();

    const todoTitle = workingTodoTitle.trim();

    if (!isValidTodoTitle(todoTitle)) {
        return;
    }

      onAddTodo(todoTitle);
      setWorkingTodoTitle("");
      inputRef.current.focus();
  
  };

   return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      <button disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;

