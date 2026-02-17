import api from './api';

/**
 * Get reference data: categories, statuses, priorities, outcomes, roles
 */
export const getReferenceData = () => api.get('/reference');