//shared/TextInputWithLabel.jsx

import styles from './TextInputWithLabel.module.css';

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  maxLength,
  className = '',
}) {
  return (
    <>
      <label className={styles.label} htmlFor={elementId}>
        {labelText}
      </label>

      <input
        className={`${styles.input} ${className}`.trim()}
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
