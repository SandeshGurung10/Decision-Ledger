import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import {
    HomeIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ArrowRightOnRectangleIcon,
    PlusCircleIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export const MainLayout = () => {
    const { user, clearAuth: logout } = useAuthStore(); 
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: HomeIcon },
        { name: 'Decisions', path: '/decisions', icon: DocumentTextIcon },
         { name: 'Profile', path: '/profile', icon: UsersIcon },
    ];

    if (user?.role === 'Admin') {
        navLinks.push({ name: 'Users', path: '/users', icon: UserGroupIcon });
    }

    return (
        <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-primary-100">
            {/* Sidebar */}
            <aside className="w-72 glass-dark border-r border-slate-200/50 flex flex-col hidden md:flex z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                            <span className="text-white font-black text-xl">D</span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Decision Ledger</h1>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-1">Enterprise Console</p>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative",
                                    isActive
                                        ? "bg-white text-primary-600 shadow-sm border border-slate-100"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-primary-600")} />
                                    <span className="font-semibold tracking-tight">{link.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute right-2 w-1.5 h-1.5 bg-primary-600 rounded-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {['Admin', 'Decision-Maker'].includes(user?.role) && (
                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <NavLink
                                to="/decisions/new"
                                className={({ isActive }) =>
                                    cn(
                                        "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                        isActive
                                            ? "bg-white text-primary-600 shadow-sm border border-slate-100"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                    )
                                }
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                <span className="font-semibold tracking-tight">New Decision</span>
                            </NavLink>
                        </div>
                    )}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="glass bg-white/60 p-4 rounded-2xl mb-4 border border-white/40 ring-1 ring-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white ring-4 ring-primary-50 shadow-inner">
                                <span className="font-bold">{user?.name?.charAt(0)}</span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="group flex w-full items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 font-semibold"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-[#f1f5f9]/30">
                <div className="max-w-7xl mx-auto p-4 md:p-10 min-h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
