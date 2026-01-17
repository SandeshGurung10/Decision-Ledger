import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // API call will go here
            console.log('Register data', data);
            toast.success('Registration successful!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to register');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-primary-600 mb-8">
                    Decision Ledger
                </h2>

                <Card>
                    <h3 className="text-xl font-semibold mb-6">Create a new account</h3>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Full Name"
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            {...register('name', {
                                required: 'Name is required'
                            })}
                            error={errors.name?.message}
                        />

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
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                }
                            })}
                            error={errors.password?.message}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            id="passwordConfirm"
                            placeholder="••••••••"
                            {...register('passwordConfirm', {
                                required: 'Please confirm your password',
                                validate: (val) => {
                                    if (watch('password') != val) {
                                        return "Your passwords do no match";
                                    }
                                },
                            })}
                            error={errors.passwordConfirm?.message}
                        />

                        <div className="mb-4">
                            <label htmlFor="department" className="label-field mb-1">
                                Department (Optional)
                            </label>
                            <input
                                id="department"
                                type="text"
                                placeholder="e.g. Engineering"
                                className="input-field"
                                {...register('department')}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4">
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                            Log in
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};
