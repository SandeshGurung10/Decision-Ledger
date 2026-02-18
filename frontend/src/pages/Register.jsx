import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldCheckIcon,
    UserPlusIcon,
    EnvelopeIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    KeyIcon               // optional, you can use LockClosedIcon again
} from '@heroicons/react/24/outline';
import { registerSchema } from '../lib/validations';
import { useAuthStore } from '../stores/authStore';
import { register as registerUser } from '../services/authService';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Register() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            const res = await registerUser(data);
            const { token, data: userData } = res.data;
            setAuth(userData.user, token);
            toast.success('Registration Confirmed: Welcome Aboard');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Provisioning Failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 selection:bg-primary-100">
            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Onboarding</h3>
                        <p className="text-slate-500 font-medium italic">Securely provision your enterprise account.</p>
                    </div>

                    <Card className="border-none shadow-2xl ring-1 ring-slate-200/50 p-2 bg-slate-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Personnel Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Full Name"
                                    id="name"
                                    icon={ShieldCheckIcon}
                                    placeholder="John Smith"
                                    {...register('name')}
                                    error={errors.name?.message}
                                />

                                <Input
                                    label="Business Email"
                                    id="email"
                                    type="email"
                                    icon={EnvelopeIcon}
                                    placeholder="name@company.com"
                                    {...register('email')}
                                    error={errors.email?.message}
                                />

                                <Input
                                    label="Department"
                                    id="department"
                                    icon={BuildingOfficeIcon}
                                    placeholder="Operations, Strategy..."
                                    {...register('department')}
                                />

                                <Input
                                    label="Access Keyword"
                                    id="password"
                                    type="password"
                                    icon={LockClosedIcon}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    error={errors.password?.message}
                                />

                                {/* ✅ New Confirm Password Field */}
                                <Input
                                    label="Confirm Access Keyword"
                                    id="passwordConfirm"
                                    type="password"
                                    icon={LockClosedIcon}   // or KeyIcon if you prefer
                                    placeholder="••••••••"
                                    {...register('passwordConfirm')}
                                    error={errors.passwordConfirm?.message}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg mt-4"
                                    disabled={isSubmitting}
                                    icon={UserPlusIcon}
                                >
                                    {isSubmitting ? 'Provisioning...' : 'Initialize Profile'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-slate-500 font-bold text-sm">
                        Already verified?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-2">
                            Establish Session
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Decoration Side */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 flex items-center justify-end gap-3 text-right">
                    <h1 className="text-2xl font-black text-white tracking-tighter">Decision Ledger</h1>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                        <ShieldCheckIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                <div className="relative z-10 space-y-6 text-right">
                    <h2 className="text-6xl font-black text-white leading-none tracking-tight">
                        Traceable <span className="text-emerald-400">Intelligence.</span>
                    </h2>
                    <p className="text-slate-400 text-xl font-medium ml-auto max-w-md">
                        The foundation of organizational memory. Ensure every core pivot is documented with rigorous rationale.
                    </p>
                </div>

                <div className="relative z-10 flex justify-end gap-8">
                    <div className="text-right">
                        <p className="text-2xl font-black text-white">RBAC</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enforced</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-white">Immutable</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tracking</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}