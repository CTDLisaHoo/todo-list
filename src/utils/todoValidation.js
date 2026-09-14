//utils/todoValidation.js

export const MAX_TODO_TITLE_LENGTH = 100;

export function validateTodoTitle(title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return 'Todo title is required.';
  }

  if (trimmedTitle.length > MAX_TODO_TITLE_LENGTH) {
    return `Todo title must be ${MAX_TODO_TITLE_LENGTH} characters or fewer.`;
  }

  return '';
}

export function isValidTodoTitle(title) {
  return validateTodoTitle(title) === '';
}