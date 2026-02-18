import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/20/solid';
import { useDecisions } from '../hooks/useDecisions';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

const CATEGORIES = ['Strategic', 'Operational', 'Financial', 'HR', 'Technical', 'Other'];
const STATUSES = ['Draft', 'Under Review', 'Approved', 'Rejected', 'Implemented'];

export const DecisionList = () => {
    const { user } = useAuthStore();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '', category: '' });
    const [archiveFilter, setArchiveFilter] = useState('false'); // 'false' = active, 'true' = archived, 'all' = both

    // Build query params
    const params = {
        page,
        limit: 8,
        sort: '-createdAt',
        ...filters,
        ...(archiveFilter !== 'all' && { isArchived: archiveFilter }),
        ...(search && { search }),
    };

    // Fetch decisions with React Query
    const { data, isLoading, isError, refetch } = useDecisions(params);

    const decisions = data?.data?.decisions || [];
    const totalPages = Math.ceil((data?.total || 0) / 8);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, filters, archiveFilter]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'success';
            case 'implemented': return 'primary';
            case 'under review': return 'warning';
            case 'rejected': return 'danger';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Decisions</h1>
                    <p className="text-slate-500 font-medium">Browse and manage organizational outcomes.</p>
                </div>
                {['Admin', 'Decision-Maker'].includes(user?.role) && (
                    <Link to="/decisions/new">
                        <Button icon={PlusIcon}>New Decision</Button>
                    </Link>
                )}
            </div>

            {/* Filter Bar */}
            <Card className="p-4 bg-white/50 border-none ring-1 ring-slate-200/50 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <Input
                            icon={MagnifyingGlassIcon}
                            placeholder="Search decisions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mb-0"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        {/* Status Filter */}
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Status</label>
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 transition-all font-semibold text-sm"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {/* Category Filter */}
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Category</label>
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 transition-all font-semibold text-sm"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {/* Archive Filter */}
                        <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Archive</label>
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 transition-all font-semibold text-sm"
                                value={archiveFilter}
                                onChange={(e) => setArchiveFilter(e.target.value)}
                            >
                                <option value="false">Active Only</option>
                                <option value="true">Archived Only</option>
                                <option value="all">All Decisions</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Table Section */}
            <Card className="p-0 overflow-hidden border-none ring-1 ring-slate-200/50 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decision Info</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metadata</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-8 py-6 h-20 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FunnelIcon className="w-12 h-12 text-slate-200" />
                                            <p className="font-bold text-slate-400 text-lg">Error loading decisions</p>
                                            <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : decisions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FunnelIcon className="w-12 h-12 text-slate-200" />
                                            <p className="font-bold text-slate-400 text-lg">No decisions discovered yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                decisions.map((decision) => (
                                    <tr key={decision._id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="max-w-md">
                                                <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                                    {decision.title}
                                                </p>
                                                <p className="text-xs text-slate-400 font-medium mt-1">
                                                    {new Date(decision.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="primary" className="px-2 py-0">{decision.category}</Badge>
                                                    <Badge variant={decision.priority.toLowerCase() === 'critical' ? 'danger' : decision.priority.toLowerCase() === 'high' ? 'warning' : 'default'} className="px-2 py-0">
                                                        {decision.priority}
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400">by {decision.createdBy?.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={getStatusVariant(decision.status)}>
                                                {decision.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link to={`/decisions/${decision._id}`}>
                                                <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider h-8 py-0">Details</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pb-10">
                    <p className="text-sm font-bold text-slate-400">
                        Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="px-3"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="px-3"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};