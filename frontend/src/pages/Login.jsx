import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ArrowRightIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { loginSchema } from '../lib/validations';
import { useAuthStore } from '../stores/authStore';
import { login } from '../services/authService';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      const { token, data: userData } = res.data;
      setAuth(userData.user, token);
      toast.success('Access Granted: Welcome to Decision Ledger');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication Failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 selection:bg-primary-100">

      {/* Left Decoration Side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">Decision Ledger</h1>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-6xl font-black text-white leading-none tracking-tight">
            Structure Your <span className="text-primary-400">Governance.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-md">
            The professional standard for documenting, tracking, and analyzing organizational logic.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-2xl font-black text-white">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Traceable</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">Real-time</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analytics</p>
          </div>
        </div>
      </motion.div>

      {/* Right Login Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h3>
            <p className="text-slate-500 font-medium italic">Welcome back to the command center.</p>
          </div>

          <Card className="border-none shadow-2xl ring-1 ring-slate-200/50 p-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Security Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Business Email"
                  id="email"
                  type="email"
                  icon={EnvelopeIcon}
                  placeholder="name@company.com"
                  {...register('email')}
                  error={errors.email?.message}
                />

                <div className="space-y-1">
                  <Input
                    label="Secret Keyword"
                    id="password"
                    type="password"
                    icon={LockClosedIcon}
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <div className="text-right">
                    <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest">
                      Forgot Access?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg"
                  disabled={isSubmitting}
                  icon={ArrowRightIcon}
                >
                  {isSubmitting ? 'Verifying...' : 'Establish Connection'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-slate-500 font-bold text-sm">
            Operational onboard required?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 underline underline-offset-4 decoration-2">
              Request Access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}