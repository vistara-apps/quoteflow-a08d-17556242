"use client";

import { useState, useEffect } from "react";

interface InputGroupProps {
  label: string;
  type?: "text" | "number" | "dropdown" | "email" | "tel";
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
  errorMessage?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  autoComplete?: string;
  id?: string;
}

export function InputGroup({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
  required,
  hint,
  errorMessage,
  pattern,
  minLength,
  maxLength,
  min,
  max,
  validateOnBlur = true,
  validateOnChange = false,
  autoComplete,
  id
}: InputGroupProps) {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(errorMessage || null);
  const [touched, setTouched] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Generate a unique ID for the input if not provided
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const validate = (val: string | number) => {
    if (required && (val === "" || val === undefined || val === null)) {
      return `${label} is required`;
    }
    
    if (typeof val === 'string') {
      if (minLength && val.length < minLength) {
        return `${label} must be at least ${minLength} characters`;
      }
      
      if (maxLength && val.length > maxLength) {
        return `${label} must be less than ${maxLength} characters`;
      }
      
      if (pattern && !new RegExp(pattern).test(val)) {
        return `Please enter a valid ${label.toLowerCase()}`;
      }
      
      if (type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return 'Please enter a valid email address';
      }
      
      if (type === 'tel' && val && !/^[0-9+\-\s()]*$/.test(val)) {
        return 'Please enter a valid phone number';
      }
    }
    
    if (typeof val === 'number') {
      if (min !== undefined && val < min) {
        return `${label} must be at least ${min}`;
      }
      
      if (max !== undefined && val > max) {
        return `${label} must be less than ${max}`;
      }
    }
    
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === "number" ? Number(e.target.value) : e.target.value;
    onChange(newValue);
    setIsDirty(true);
    
    if (validateOnChange) {
      setError(validate(newValue));
    }
  };
  
  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
    
    if (validateOnBlur) {
      setError(validate(value));
    }
  };
  
  // Validate when error message prop changes
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  // Determine input status for styling
  const getInputStatus = () => {
    if (error && (touched || isDirty)) return 'error';
    if (focused) return 'focused';
    if (touched && !error) return 'valid';
    return 'default';
  };
  
  const inputStatus = getInputStatus();
  
  const inputClasses = {
    default: 'input-field w-full border-border',
    focused: 'input-field w-full border-accent ring-1 ring-accent/30',
    valid: 'input-field w-full border-green-500',
    error: 'input-field w-full border-red-500 ring-1 ring-red-500/30'
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {type === "dropdown" && options ? (
          <div className="relative">
            <select
              id={inputId}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setFocused(true)}
              className={inputClasses[inputStatus]}
              required={required}
              aria-invalid={!!error && touched}
              aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            >
              <option value="">{placeholder || "Select an option"}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              id={inputId}
              type={type}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setFocused(true)}
              placeholder={placeholder}
              className={inputClasses[inputStatus]}
              required={required}
              pattern={pattern}
              minLength={minLength}
              maxLength={maxLength}
              min={min}
              max={max}
              autoComplete={autoComplete}
              aria-invalid={!!error && touched}
              aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            />
            {inputStatus === 'valid' && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && touched && (
        <p id={`${inputId}-error`} className="text-sm text-red-500 animate-slide-up" role="alert">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  );
}
