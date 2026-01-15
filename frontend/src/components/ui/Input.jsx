import React, { forwardRef } from 'react';

export const Input = forwardRef(({
    label,
    id,
    type = 'text',
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`mb-4 w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="label-field mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                ref={ref}
                className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
