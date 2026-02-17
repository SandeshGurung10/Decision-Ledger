import api from './api';

/**
 * Get all decisions with optional query params (pagination, filters, sorting)
 * @param {Object} params - Query parameters (page, limit, sort, isArchived, status, category, priority, search)
 */
export const getAllDecisions = (params) => api.get('/decisions', { params });

/**
 * Get a single decision by ID
 */
export const getDecisionById = (id) => api.get(`/decisions/${id}`);

/**
 * Create a new decision (Admin or Decision-Maker)
 */
export const createDecision = (data) => api.post('/decisions', data);

/**
 * Update an existing decision (owner or Admin)
 */
export const updateDecision = (id, data) => api.patch(`/decisions/${id}`, data);

/**
 * Delete a decision (owner or Admin)
 */
export const deleteDecision = (id) => api.delete(`/decisions/${id}`);

/**
 * Archive a decision (owner or Admin)
 */
export const archiveDecision = (id) => api.patch(`/decisions/${id}/archive`);

/**
 * Unarchive a decision (owner or Admin)
 */
export const unarchiveDecision = (id) => api.patch(`/decisions/${id}/unarchive`);

/**
 * Review a decision (Admin only) – body: { status: 'Approved' | 'Rejected' }
 */
export const reviewDecision = (id, status) => api.patch(`/decisions/${id}/review`, { status });