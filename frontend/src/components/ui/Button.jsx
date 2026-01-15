import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    className = '',
    disabled = false,
    onClick,
    ...props
}) => {
    const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

    return (
        <button
            type={type}
            className={`${baseClasses} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};
