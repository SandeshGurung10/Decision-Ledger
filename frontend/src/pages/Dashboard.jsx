import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import {
    DocumentCheckIcon,
    DocumentMinusIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

export const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        underReview: 0,
        pendingOutcome: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentDecisions, setRecentDecisions] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/decisions?limit=5&sort=-createdAt');
                const decisions = res.data.data.decisions;
                setRecentDecisions(decisions);

                // For a real app, you'd want a separate aggregation endpoint.
                // Doing a quick fetch of all for demo metrics.
                const allRes = await api.get('/decisions?fields=status,outcome');
                const all = allRes.data.data.decisions;

                setStats({
                    total: all.length,
                    approved: all.filter(d => d.status === 'Approved').length,
                    underReview: all.filter(d => d.status === 'Under Review').length,
                    pendingOutcome: all.filter(d => d.outcome === 'Pending').length,
                });

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="animate-pulse flex space-x-4">Loading dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Decisions', value: stats.total, icon: ChartBarIcon, color: 'text-blue-500', bg: 'bg-blue-100' },
        { title: 'Approved', value: stats.approved, icon: DocumentCheckIcon, color: 'text-green-500', bg: 'bg-green-100' },
        { title: 'Under Review', value: stats.underReview, icon: ClockIcon, color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { title: 'Pending Outcomes', value: stats.pendingOutcome, icon: DocumentMinusIcon, color: 'text-purple-500', bg: 'bg-purple-100' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <Card key={index} className="flex items-center p-6">
                        <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Recently Added Decisions</h3>
            <Card className="overflow-hidden p-0">
                <ul className="divide-y divide-gray-200">
                    {recentDecisions.length === 0 ? (
                        <li className="p-6 text-center text-gray-500">No decisions found. Create one to get started!</li>
                    ) : (
                        recentDecisions.map((decision) => (
                            <li key={decision._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-primary-600 truncate">{decision.title}</p>
                                        <p className="text-sm text-gray-500">{decision.category} • by {decision.createdBy?.name || 'Unknown'}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800`}>
                                            {decision.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </Card>
        </div>
    );
};
