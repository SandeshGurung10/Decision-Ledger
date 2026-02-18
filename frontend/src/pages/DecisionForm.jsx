import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeftIcon,
    CloudArrowUpIcon,
    TagIcon,
    CalendarDaysIcon,
    ChartPieIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner'
import { cn } from '../lib/utils';

export const DecisionForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = ['Strategic', 'Operational', 'Financial', 'HR', 'Technical', 'Other'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
            };

            const res = await api.post('/decisions', payload);
            toast.success('Decision safely recorded in the ledger');
            navigate(`/decisions/${res.data.data.decision._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Protocol failure: Could not record decision');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Navigation & Header */}
            <div className="space-y-4">
                <Link to="/decisions">
                    <Button variant="ghost" className="gap-2 px-0 text-slate-500 hover:text-slate-900">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Back to Registry
                    </Button>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20">
                        <PresentationChartLineIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Propose Decision</h1>
                        <p className="text-slate-500 font-medium">Documenting organizational logic and strategic intent.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none ring-1 ring-slate-200/50 shadow-xl overflow-visible">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle>Core Documentation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <Input
                                label="Strategic Title"
                                id="title"
                                placeholder="Briefly describe the decision..."
                                {...register('title', {
                                    required: 'Critical: Title is mandatory',
                                    maxLength: { value: 150, message: 'Constraint: Max 150 characters' }
                                })}
                                error={errors.title?.message}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Detailed Description</label>
                                <textarea
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 min-h-[160px] font-medium placeholder:text-slate-400",
                                        errors.description && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                                    )}
                                    placeholder="Provide comprehensive context, objectives, and expected outcomes..."
                                    {...register('description', { required: 'Description is required for ledger integrity' })}
                                />
                                {errors.description && <p className="text-xs font-medium text-rose-500 ml-1">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Business Rationale</label>
                                <textarea
                                    className={cn(
                                        "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 min-h-[120px] font-medium placeholder:text-slate-400 italic",
                                        errors.rationale && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                                    )}
                                    placeholder="Why this path? What was the alternative?"
                                    {...register('rationale', { required: 'Rationale is required for transparency' })}
                                />
                                {errors.rationale && <p className="text-xs font-medium text-rose-500 ml-1">{errors.rationale.message}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <aside className="space-y-8">
                    <Card className="border-none ring-1 ring-slate-200/50 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <ChartPieIcon className="w-4 h-4 text-primary-500" />
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Domain</label>
                                </div>
                                <select
                                    className={cn(
                                        "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-200 focus:border-primary-500 font-semibold text-sm",
                                        errors.category && "border-rose-400"
                                    )}
                                    {...register('category', { required: 'Selection required' })}
                                >
                                    <option value="">Select Domain</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Priority Level</label>
                                </div>
                                <select
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 font-semibold text-sm transition-all"
                                    {...register('priority')}
                                >
                                    <option value="Medium">Standard</option>
                                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Input
                                    label="Sunset/Due Date"
                                    type="date"
                                    icon={CalendarDaysIcon}
                                    id="dueDate"
                                    {...register('dueDate')}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Metadata Tags"
                                    id="tags"
                                    icon={TagIcon}
                                    placeholder="e.g., ops, fiscal, 2026"
                                    {...register('tags')}
                                />
                                <p className="text-[10px] text-slate-400 font-bold px-1 uppercase tracking-tight">Separated by comma</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg"
                            disabled={loading}
                            icon={CloudArrowUpIcon}
                        >
                            {loading ? 'Submitting...' : 'Commit to Ledger'}
                        </Button>
                        <Link to="/decisions" className="block">
                            <Button variant="ghost" className="w-full text-slate-400" type="button">Discard Draft</Button>
                        </Link>
                    </div>
                </aside>
            </form>
        </div>
    );
};
