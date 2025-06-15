import { useState } from "react";
import styles from '../styles/styles.module.css';

export const FloatingLabelInput = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  error,
  className = ""
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={`${styles.inputGroup} ${(focused || hasValue) ? styles.focused : ""}`}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${styles.inputField} ${error ? styles.error : ""}`}
          placeholder=" "
        />
        <label className={styles.inputLabel}>{label}</label>
      </div>
      {error && <span className={styles.inputError}>{error}</span>}
    </div>
  );
};

 
