import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // API call will go here
            console.log('Login data', data);
            toast.success('Logged in successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to log in');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-12 flex-col justify-between relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-16">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <ShieldCheckIcon className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Decision Ledger</h1>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Transparent Decision<br />
                            Making for Modern<br />
                            Organizations
                        </h2>
                        <p className="text-blue-200 text-lg max-w-md">
                            Document, track, and analyze organizational decisions with full accountability and transparency.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 grid grid-cols-3 gap-8">
                    <div>
                        <div className="text-3xl font-bold text-white">500+</div>
                        <div className="text-sm text-blue-300">Decisions Tracked</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">98%</div>
                        <div className="text-sm text-blue-300">Transparency</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">24/7</div>
                        <div className="text-sm text-blue-300">Access</div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <ShieldCheckIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">Decision Ledger</h1>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h3>
                        <p className="text-slate-600">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl transition-all duration-200 outline-none focus:bg-white focus:border-blue-500 ${
                                    errors.email ? 'border-red-400' : 'border-transparent'
                                }`}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl transition-all duration-200 outline-none focus:bg-white focus:border-blue-500 ${
                                    errors.password ? 'border-red-400' : 'border-transparent'
                                }`}
                                {...register('password', {
                                    required: 'Password is required'
                                })}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg shadow-blue-500/30"
                        >
                            <span>Sign In</span>
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            Create an account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
