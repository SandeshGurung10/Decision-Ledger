import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

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
            toast.success('Decision created successfully!');
            navigate(`/decisions/${res.data.data.decision._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create decision');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold">New Decision</h2>
                <p className="text-gray-600">Document a new decision for the ledger.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Title"
                        id="title"
                        placeholder="e.g., Migrate to Cloud Infrastructure"
                        {...register('title', {
                            required: 'Title is required',
                            maxLength: { value: 150, message: 'Max 150 characters' }
                        })}
                        error={errors.title?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label-field mb-1">Category</label>
                            <select
                                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                                {...register('category', { required: 'Category is required' })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                        </div>

                        <div>
                            <label className="label-field mb-1">Priority</label>
                            <select
                                className="input-field"
                                {...register('priority')}
                            >
                                <option value="Medium">Medium</option>
                                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="label-field mb-1">Description</label>
                        <textarea
                            className={`input-field min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Detailed description of the decision..."
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="label-field mb-1">Rationale</label>
                        <textarea
                            className={`input-field min-h-[100px] ${errors.rationale ? 'border-red-500' : ''}`}
                            placeholder="Why was this decision made? Alternatives considered?"
                            {...register('rationale', { required: 'Rationale is required' })}
                        />
                        {errors.rationale && <p className="mt-1 text-sm text-red-600">{errors.rationale.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Due Date"
                            type="date"
                            id="dueDate"
                            {...register('dueDate')}
                        />
                        <Input
                            label="Tags (comma separated)"
                            id="tags"
                            placeholder="e.g., frontend, react, performance"
                            {...register('tags')}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/decisions')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Decision'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
