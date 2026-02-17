import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = ({ children, className = '', animate = true }) => {
    return (
        <motion.div
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                "glass rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/80",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ children, className }) => (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
        {children}
    </div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={cn("text-xl font-bold text-slate-900 tracking-tight", className)}>
        {children}
    </h3>
);

export const CardContent = ({ children, className }) => (
    <div className={cn("relative", className)}>
        {children}
    </div>
);
