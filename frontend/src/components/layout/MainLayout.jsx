import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HomeIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ArrowRightOnRectangleIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';

export const MainLayout = () => {
    const { user, logout } = useAuth();

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: HomeIcon },
        { name: 'Decisions', path: '/decisions', icon: DocumentTextIcon },
    ];

    if (user?.role === 'Admin') {
        navLinks.push({ name: 'Users', path: '/users', icon: UserGroupIcon });
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-primary-600">Decision Ledger</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <link.icon className="h-5 w-5" />
                            <span>{link.name}</span>
                        </NavLink>
                    ))}

                    {['Admin', 'Decision-Maker'].includes(user?.role) && (
                        <NavLink
                            to="/decisions/new"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>New Decision</span>
                        </NavLink>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4 px-4">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
