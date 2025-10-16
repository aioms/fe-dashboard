import React, { useState, useEffect } from "react";
import { formatMoney, parseCurrencyInput } from "helpers/utils";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  className = "",
  disabled = false,
  required = false,
  min = 0,
  max,
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (value === 0) {
      setDisplayValue("");
    } else {
      setDisplayValue(formatMoney(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input
    if (inputValue === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // Parse the numeric value
    const numericValue = parseCurrencyInput(inputValue);
    
    // Apply min/max constraints
    let constrainedValue = numericValue;
    if (min !== undefined && constrainedValue < min) {
      constrainedValue = min;
    }
    if (max !== undefined && constrainedValue > max) {
      constrainedValue = max;
    }

    // Update display value with formatting
    setDisplayValue(formatMoney(constrainedValue));
    onChange(constrainedValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Remove formatting on focus for easier editing
    if (value > 0) {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Restore formatting on blur
    if (value > 0) {
      setDisplayValue(formatMoney(value));
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200 ${className}`}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm text-slate-500 dark:text-zink-300">₫</span>
      </div>
    </div>
  );
};

export default MoneyInput;