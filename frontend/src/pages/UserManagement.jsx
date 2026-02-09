import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data.users);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.patch(`/users/${userId}`, { role: newRole });
            toast.success('User role updated');
            fetchUsers(); // Refresh list to get updated data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user role');
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-gray-600">Manage user accounts and their system roles.</p>
            </div>

            <Card className="overflow-hidden p-0">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                    <div className="text-sm text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{u.department || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <select
                                                className="input-field py-1 text-sm inline-block w-auto"
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            >
                                                <option value="Viewer">Viewer</option>
                                                <option value="Decision-Maker">Decision-Maker</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};
