import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import {
    UserIcon,
    EnvelopeIcon,
    BuildingOfficeIcon,
    KeyIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../services/userService';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';

// Validation schemas
const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    department: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const ProfilePage = () => {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Fetch current user data
    const { data, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => getCurrentUser().then(res => res.data),
    });

    const currentUser = data?.data?.user;

    // Profile form
    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            department: currentUser?.department || '',
        },
    });

    // Password form
    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Update profile mutation
    const updateMutation = useMutation({
        mutationFn: updateCurrentUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            toast.success('Profile updated successfully');
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });

  // Change password mutation (uses same endpoint as profile update)
const passwordMutation = useMutation({
    mutationFn: updateCurrentUser,  // sends PATCH to /users/updateMe
    onSuccess: () => {
        toast.success('Password changed successfully');
        passwordForm.reset();
        setIsChangingPassword(false);
    },
    onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
    // Delete account mutation
    const deleteMutation = useMutation({
        mutationFn: deleteCurrentUser,
        onSuccess: () => {
            toast.success('Account deleted');
            clearAuth();
            localStorage.removeItem('token');
            queryClient.clear();
            navigate('/login');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        },
    });

    const onProfileSubmit = (data) => {
        updateMutation.mutate(data);
    };

    const onPasswordSubmit = (data) => {
        const { confirmPassword, ...passwordData } = data; // remove confirmPassword
        passwordMutation.mutate(passwordData);
    };

    const handleDeleteAccount = () => {
        // Check if user is last admin
        if (user?.role === 'Admin') {
            // We need to know if this is the last admin. We could fetch user list and check count.
            // For simplicity, we'll assume backend handles this and returns an error.
            // But we can add a warning.
        }
        if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-8"
        >
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>

            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {!isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Name</p>
                                    <p className="font-medium">{currentUser?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="font-medium">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Department</p>
                                    <p className="font-medium">{currentUser?.department || '-'}</p>
                                </div>
                            </div>
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        </div>
                    ) : (
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <Input
                                label="Full Name"
                                icon={UserIcon}
                                {...profileForm.register('name')}
                                error={profileForm.formState.errors.name?.message}
                            />
                            <Input
                                label="Email"
                                type="email"
                                icon={EnvelopeIcon}
                                {...profileForm.register('email')}
                                error={profileForm.formState.errors.email?.message}
                            />
                            <Input
                                label="Department"
                                icon={BuildingOfficeIcon}
                                {...profileForm.register('department')}
                                error={profileForm.formState.errors.department?.message}
                            />
                            <div className="flex gap-3">
                                <Button type="submit" disabled={updateMutation.isLoading}>
                                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {!isChangingPassword ? (
                        <Button variant="outline" onClick={() => setIsChangingPassword(true)}>Change Password</Button>
                    ) : (
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <Input
                                label="Current Password"
                                type="password"
                                icon={KeyIcon}
                                {...passwordForm.register('currentPassword')}
                                error={passwordForm.formState.errors.currentPassword?.message}
                            />
                            <Input
                                label="New Password"
                                type="password"
                                icon={KeyIcon}
                                {...passwordForm.register('newPassword')}
                                error={passwordForm.formState.errors.newPassword?.message}
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                icon={KeyIcon}
                                {...passwordForm.register('confirmPassword')}
                                error={passwordForm.formState.errors.confirmPassword?.message}
                            />
                            <div className="flex gap-3">
                                <Button type="submit" disabled={passwordMutation.isLoading}>
                                    {passwordMutation.isLoading ? 'Changing...' : 'Change Password'}
                                </Button>
                                <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* Delete Account Card */}
            <Card className="border-rose-200">
                <CardHeader>
                    <CardTitle className="text-rose-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                        variant="danger"
                        icon={TrashIcon}
                        onClick={handleDeleteAccount}
                        disabled={deleteMutation.isLoading}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete Account'}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};