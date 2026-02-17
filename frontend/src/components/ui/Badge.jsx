import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary-100 text-primary-800',
};

export const Badge = ({ children, variant = 'default', className }) => {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
                variants[variant] || variants.default,
                className
            )}
        >
            {children}
        </span>
    );
};
