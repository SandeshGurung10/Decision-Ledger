import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    className = '',
    disabled = false,
    onClick,
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        glass: "glass bg-white/40 hover:bg-white/60 text-slate-700"
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            className={cn(
                "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </motion.button>
    );
};
