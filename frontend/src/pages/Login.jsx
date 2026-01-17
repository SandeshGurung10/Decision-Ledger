import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

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
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-primary-600 mb-8">
                    Decision Ledger
                </h2>

                <Card>
                    <h3 className="text-xl font-semibold mb-6">Log in to your account</h3>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Email Address"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required'
                            })}
                            error={errors.password?.message}
                        />

                        <Button type="submit" className="w-full mt-4">
                            Log In
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                            Register here
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};
