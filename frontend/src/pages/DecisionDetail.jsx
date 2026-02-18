import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeftIcon,
    PencilSquareIcon,
    ArchiveBoxIcon,
    ArrowUpTrayIcon,
    TrashIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    LifebuoyIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useDecision, useUpdateDecision, useArchiveDecision, useUnarchiveDecision, useDeleteDecision } from '../hooks/useDecisions';
import { useAuthStore } from '../stores/authStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const STATUS_STEPS = ['Draft', 'Under Review', 'Approved', 'Implemented'];

export const DecisionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Fetch decision
    const { data, isLoading, error } = useDecision(id);
    const decision = data?.data?.decision;

    // Mutations
    const updateMutation = useUpdateDecision();
    const archiveMutation = useArchiveDecision();
    const unarchiveMutation = useUnarchiveDecision();
    const deleteMutation = useDeleteDecision();

    // Initialize edit form when decision loads
    React.useEffect(() => {
        if (decision) {
            setEditForm(decision);
        }
    }, [decision]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const saveChanges = async () => {
        try {
            // Remove fields that shouldn't be sent
            const { createdBy, isArchived, _id, __v, createdAt, updatedAt, ...updateData } = editForm;
            await updateMutation.mutateAsync({ id, data: updateData });
            toast.success('Decision updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update decision');
        }
    };

    const archiveDecision = async () => {
        if (window.confirm('Are you sure you want to archive this decision?')) {
            try {
                await archiveMutation.mutateAsync(id);
                toast.success('Decision safely archived');
            } catch (error) {
                toast.error('Failed to archive decision');
            }
        }
    };

    const unarchiveDecision = async () => {
        if (window.confirm('Are you sure you want to unarchive this decision?')) {
            try {
                await unarchiveMutation.mutateAsync(id);
                toast.success('Decision restored from archive');
            } catch (error) {
                toast.error('Failed to unarchive decision');
            }
        }
    };

    const deleteDecision = async () => {
        if (window.confirm('Are you sure you want to permanently delete this decision? This action cannot be undone.')) {
            try {
                await deleteMutation.mutateAsync(id);
                toast.success('Decision deleted successfully');
                navigate('/decisions');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete decision');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !decision) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-rose-600">
                Failed to load decision. Please try again.
            </div>
        );
    }

    const canEdit = ['Admin', 'Decision-Maker'].includes(user?.role);
    const isArchived = decision.isArchived;
    const currentStepIndex = STATUS_STEPS.indexOf(decision.status);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Link to="/decisions">
                    <Button variant="ghost" className="gap-2 px-0 text-slate-500 hover:text-slate-900">
                        <ChevronLeftIcon className="w-5 h-5" />
                        Back to Catalog
                    </Button>
                </Link>
                {canEdit && !isEditing && (
                    <div className="flex gap-3">
                        {!isArchived && (
                            <Button 
                                variant="outline" 
                                icon={PencilSquareIcon} 
                                onClick={() => setIsEditing(true)}
                                disabled={updateMutation.isLoading}
                            >
                                Edit
                            </Button>
                        )}
                        {isArchived ? (
                            <Button 
                                variant="secondary" 
                                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" 
                                icon={ArrowUpTrayIcon} 
                                onClick={unarchiveDecision}
                                disabled={unarchiveMutation.isLoading}
                            >
                                Unarchive
                            </Button>
                        ) : (
                            <Button 
                                variant="secondary" 
                                className="text-amber-600 border-amber-200 hover:bg-amber-50" 
                                icon={ArchiveBoxIcon} 
                                onClick={archiveDecision}
                                disabled={archiveMutation.isLoading}
                            >
                                Archive
                            </Button>
                        )}
                        <Button 
                            variant="danger" 
                            className="text-white bg-rose-600 hover:bg-rose-700" 
                            icon={TrashIcon} 
                            onClick={deleteDecision}
                            disabled={deleteMutation.isLoading}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Archived notice */}
            {isArchived && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 font-medium flex items-center gap-2">
                    <ArchiveBoxIcon className="w-5 h-5" />
                    This decision is archived and cannot be edited. Use the Unarchive button to restore it.
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="primary">{decision.category}</Badge>
                            <Badge variant={decision.priority.toLowerCase() === 'critical' ? 'danger' : 'default'}>
                                {decision.priority} Priority
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {decision.title}
                        </h1>
                    </div>

                    {/* Timeline Visualizer */}
                    <Card className="bg-slate-900 text-white border-none shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-slate-400 text-xs font-black uppercase tracking-widest">Decision Roadmap</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative flex justify-between items-center px-4 py-6">
                                <div className="absolute h-1 left-8 right-8 bg-slate-800 top-1/2 -translate-y-1/2 z-0" />
                                <div
                                    className="absolute h-1 left-8 bg-primary-500 top-1/2 -translate-y-1/2 z-0 transition-all duration-1000"
                                    style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * (100 - (16 * 100 / (1000)))}%` }}
                                />

                                {STATUS_STEPS.map((step, idx) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ring-8 ring-slate-900",
                                            idx <= currentStepIndex ? "bg-primary-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]" : "bg-slate-800 text-slate-500"
                                        )}>
                                            {idx <= currentStepIndex ? <ShieldCheckIcon className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-wider",
                                            idx <= currentStepIndex ? "text-primary-400" : "text-slate-600"
                                        )}>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Content */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                                    <CardTitle>Context & Perspective</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                                    {isEditing && !isArchived ? (
                                        <textarea
                                            name="description"
                                            value={editForm.description || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500 min-h-[150px] font-medium transition-all"
                                        />
                                    ) : (
                                        <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">{decision.description}</p>
                                    )}
                                </div>
                                <div className="pt-6 border-t border-slate-100">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Core Rationale</label>
                                    {isEditing && !isArchived ? (
                                        <textarea
                                            name="rationale"
                                            value={editForm.rationale || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary-500 min-h-[150px] font-medium transition-all"
                                        />
                                    ) : (
                                        <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100 shadow-inner">
                                            <p className="text-primary-900 leading-relaxed font-semibold whitespace-pre-wrap italic">"{decision.rationale}"</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sidebar Metadata */}
                <aside className="space-y-6">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Governance Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: 'Status', value: decision.status, icon: ShieldCheckIcon, color: 'text-primary-600' },
                                { label: 'Current Outcome', value: decision.outcome, icon: LifebuoyIcon, color: 'text-rose-600' },
                                { label: 'Owner', value: decision.createdBy?.name, icon: UserIcon, color: 'text-indigo-600' },
                                { label: 'Recorded On', value: new Date(decision.createdAt).toLocaleDateString(), icon: CalendarIcon, color: 'text-amber-600' }
                            ].map((meta, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-50 rounded-xl">
                                        <meta.icon className={cn("w-5 h-5", meta.color)} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{meta.label}</p>
                                        {isEditing && !isArchived && ['Status', 'Current Outcome'].includes(meta.label) ? (
                                            <select
                                                name={meta.label === 'Status' ? 'status' : 'outcome'}
                                                value={meta.label === 'Status' ? editForm.status : editForm.outcome}
                                                onChange={handleEditChange}
                                                className="text-sm font-bold bg-transparent outline-none border-b border-primary-500 pb-1"
                                            >
                                                {meta.label === 'Status'
                                                    ? STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)
                                                    : ['Pending', 'Success', 'Failed', 'Partially Successful'].map(o => <option key={o} value={o}>{o}</option>)
                                                }
                                            </select>
                                        ) : (
                                            <p className="text-sm font-black text-slate-800 leading-none">{meta.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tags & Labels</p>
                                <div className="flex flex-wrap gap-2">
                                    {decision.tags?.map(tag => (
                                        <Badge key={tag} className="flex gap-1.5 items-center px-3">
                                            <TagIcon className="w-3 h-3" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {isEditing && !isArchived && (
                                <div className="space-y-3 pt-6">
                                    <Button 
                                        onClick={saveChanges} 
                                        className="w-full" 
                                        disabled={updateMutation.isLoading}
                                    >
                                        {updateMutation.isLoading ? 'Saving...' : 'Push Changes'}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setIsEditing(false)} 
                                        className="w-full text-slate-400"
                                        disabled={updateMutation.isLoading}
                                    >
                                        Discard
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
};