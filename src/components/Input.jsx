import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { value, onChange, placeholder, maxLength, disabled, onKeyDown, "aria-label": ariaLabel, required },
  ref
) {
  return (
    <input
      ref={ref}
      className="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      required={required}
    />
  );
});
