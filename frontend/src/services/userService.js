import api from './api';

// ===== Current user (authenticated) =====
export const getCurrentUser = () => api.get('/users/me');
export const updateCurrentUser = (data) => api.patch('/users/updateMe', data);
export const deleteCurrentUser = () => api.delete('/users/deleteMe');

// ===== Admin only =====
export const getAllUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.patch(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);