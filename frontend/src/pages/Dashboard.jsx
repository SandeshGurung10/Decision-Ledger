import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    DocumentCheckIcon,
    ClockIcon,
    RocketLaunchIcon,
    ShieldCheckIcon,
    PlusIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStats, useArchivedCount } from '../hooks/useDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard = () => {
    const { user } = useAuthStore();
    const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats();
    const { data: archivedCount, isLoading: archivedLoading, error: archivedError } = useArchivedCount();

    if (statsLoading || archivedLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (statsError || archivedError) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-rose-600">
                Failed to load dashboard data. Please refresh.
            </div>
        );
    }

    // Extract the actual stats object from the API response
    const data = statsData?.data; // contains overview, byCategory, byPriority, recentDecisions
    const archived = archivedCount || 0;

    const overviewCards = [
        { title: 'Total Decisions', value: data.overview.total, icon: ShieldCheckIcon, color: 'text-primary-600', bg: 'bg-primary-50' },
        { title: 'Implemented', value: data.overview.implemented, icon: RocketLaunchIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Approved', value: data.overview.approved, icon: DocumentCheckIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Under Review', value: data.overview.underReview, icon: ClockIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Archived', value: archived, icon: ArchiveBoxIcon, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name?.split(' ')[0] || 'User'}!</h1>
                    <p className="text-slate-500">Here's what's happening in your decision ledger.</p>
                </div>
                <Link to="/decisions/new">
                    <Button icon={PlusIcon}>New Decision</Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {overviewCards.map((stat, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="flex items-center gap-5 p-6 border-none ring-1 ring-slate-200/50">
                            <div className={cn("p-3.5 rounded-2xl shadow-sm", stat.bg)}>
                                <stat.icon className={cn("w-7 h-7", stat.color)} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Charts – fixed container dimensions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <motion.div variants={item}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>By Category</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.byCategory}
                                        dataKey="count"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                    >
                                        {data.byCategory.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Priority Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.byPriority} layout="vertical" margin={{ left: 20, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="priority"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={80}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#6366f1"
                                        radius={[0, 8, 8, 0]}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity List */}
            <motion.div variants={item} className="mt-8">
                <Card className="p-0 overflow-hidden border-none ring-1 ring-slate-200/50">
                    <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <CardTitle>Recent Activity</CardTitle>
                        <Link to="/decisions" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                            View all
                        </Link>
                    </CardHeader>
                    <div className="divide-y divide-slate-100">
                        {data.recentDecisions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No activity yet.</div>
                        ) : (
                            data.recentDecisions.map((decision) => (
                                <Link
                                    key={decision._id}
                                    to={`/decisions/${decision._id}`}
                                    className="block p-5 hover:bg-slate-50 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                                                {decision.title}
                                            </h5>
                                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                                <span className="font-medium">{decision.category}</span>
                                                <span>•</span>
                                                <span>{new Date(decision.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={decision.priority.toLowerCase() === 'critical' ? 'danger' : decision.priority.toLowerCase() === 'high' ? 'warning' : 'default'}>
                                                {decision.priority}
                                            </Badge>
                                            <Badge variant="info">
                                                {decision.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Link to view archived decisions */}
            <motion.div variants={item} className="text-right">
                <Link to="/decisions?archived=true" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                    View archived decisions →
                </Link>
            </motion.div>
        </motion.div>
    );
};