import api from './api';

/**
 * Get dashboard statistics
 * Returns: overview (total, by status), byCategory, byPriority, recentDecisions, totalUsers (Admin only)
 */
export const getDashboardStats = () => api.get('/stats/dashboard');