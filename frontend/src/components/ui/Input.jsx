import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({
    label,
    id,
    type = 'text',
    error,
    className = '',
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className={cn("space-y-2 w-full", className)}>
            {label && (
                <label htmlFor={id} className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 placeholder:text-slate-400",
                        Icon && "pl-11",
                        error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10",
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs font-medium text-rose-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
