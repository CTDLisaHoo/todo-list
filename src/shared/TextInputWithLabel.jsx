//shared/TextInputWithLabel.jsx

import styles from './TextInputWithLabel.module.css';

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
}) {
  return (
    <>
      <label className={styles.label} htmlFor={elementId}>{labelText}</label>
      <input 
        className={styles.input}
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;