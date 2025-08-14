import React, { forwardRef } from 'react';

export interface AccessibleInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = "text",
    required = false,
    disabled = false,
    error,
    helperText,
    className = "",
    ...ariaProps
  }, ref) => {
    const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const describedBy = [ariaProps['aria-describedby'], errorId, helperId]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`space-y-2 ${className}`}>
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          `}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaProps['aria-invalid'] || !!error}
          aria-required={ariaProps['aria-required'] || required}
          aria-label={ariaProps['aria-label']}
          {...ariaProps}
        />

        {helperText && !error && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput; 