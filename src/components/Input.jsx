import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { value, onChange, placeholder, maxLength, disabled, onKeyDown, "aria-label": ariaLabel, required },
  ref
) {
  return (
    <input
      ref={ref}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
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
