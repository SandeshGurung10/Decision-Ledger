import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const DecisionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [decision, setDecision] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit Mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchDecision();
    }, [id]);

    const fetchDecision = async () => {
        try {
            const res = await api.get(`/decisions/${id}`);
            setDecision(res.data.data.decision);
            setEditForm(res.data.data.decision);
        } catch (error) {
            toast.error('Failed to load decision');
            navigate('/decisions');
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const saveChanges = async () => {
        try {
            // Don't send createdBy or isArchived in update
            const { createdBy, isArchived, _id, __v, createdAt, updatedAt, ...updateData } = editForm;

            const res = await api.patch(`/decisions/${id}`, updateData);
            setDecision(res.data.data.decision);
            setIsEditing(false);
            toast.success('Decision updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update decision');
        }
    };

    const archiveDecision = async () => {
        if (window.confirm('Are you sure you want to archive this decision?')) {
            try {
                await api.patch(`/decisions/${id}/archive`);
                toast.success('Decision archived');
                navigate('/decisions');
            } catch (error) {
                toast.error('Failed to archive decision');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!decision) return <div className="p-8 text-center text-red-500">Decision not found.</div>;

    const canEdit = ['Admin', 'Decision-Maker'].includes(user?.role);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{decision.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            {decision.status}
                        </span>
                        <span>Category: {decision.category}</span>
                        <span>Created by: {decision.createdBy?.name || 'Unknown'}</span>
                        <span>Date: {new Date(decision.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {canEdit && !isEditing && (
                    <div className="flex space-x-2">
                        <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button variant="secondary" className="text-red-600 hover:bg-red-50 border-red-200" onClick={archiveDecision}>
                            Archive
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Description</h3>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                className="w-full input-field min-h-[150px]"
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-wrap">{decision.description}</p>
                        )}
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Rationale</h3>
                        {isEditing ? (
                            <textarea
                                name="rationale"
                                value={editForm.rationale}
                                onChange={handleEditChange}
                                className="w-full input-field min-h-[150px]"
                            />
                        ) : (
                            <p className="text-gray-700 whitespace-pre-wrap">{decision.rationale}</p>
                        )}
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-4 border-b pb-2">Details</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 font-semibold uppercase">Status</label>
                                {isEditing ? (
                                    <select name="status" value={editForm.status} onChange={handleEditChange} className="input-field mt-1">
                                        <option value="Draft">Draft</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                ) : (
                                    <p className="font-medium">{decision.status}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-semibold uppercase">Outcome</label>
                                {isEditing ? (
                                    <select name="outcome" value={editForm.outcome} onChange={handleEditChange} className="input-field mt-1">
                                        <option value="Pending">Pending</option>
                                        <option value="Successful">Successful</option>
                                        <option value="Unsuccessful">Unsuccessful</option>
                                        <option value="Needs Revision">Needs Revision</option>
                                    </select>
                                ) : (
                                    <p className="font-medium">{decision.outcome}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-semibold uppercase">Priority</label>
                                {isEditing ? (
                                    <select name="priority" value={editForm.priority} onChange={handleEditChange} className="input-field mt-1">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                ) : (
                                    <p className="font-medium">{decision.priority}</p>
                                )}
                            </div>

                            {decision.tags && decision.tags.length > 0 && (
                                <div>
                                    <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {decision.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {isEditing && (
                        <div className="flex flex-col space-y-3">
                            <Button onClick={saveChanges} className="w-full">Save Changes</Button>
                            <Button variant="secondary" onClick={() => { setIsEditing(false); setEditForm(decision); }} className="w-full">Cancel</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
