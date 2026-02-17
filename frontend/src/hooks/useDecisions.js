import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDecisions, getDecisionById, createDecision, updateDecision, deleteDecision, archiveDecision, unarchiveDecision, reviewDecision } from '../services/decisionService';

// Hook for fetching a paginated/filtered list of decisions
export const useDecisions = (params) => {
  return useQuery({
    queryKey: ['decisions', params],
    queryFn: () => getAllDecisions(params).then(res => res.data),
    keepPreviousData: true, // smooth pagination
  });
};

// Hook for fetching a single decision
export const useDecision = (id) => {
  return useQuery({
    queryKey: ['decision', id],
    queryFn: () => getDecisionById(id).then(res => res.data),
    enabled: !!id, // only run if id exists
  });
};

// Mutation for creating a decision
export const useCreateDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDecision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
};

// Mutation for updating a decision
export const useUpdateDecision = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateDecision(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      queryClient.invalidateQueries({ queryKey: ['decision', id] });
    },
  });
};

// Mutation for deleting a decision
export const useDeleteDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDecision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
};

// Mutation for archiving a decision
export const useArchiveDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveDecision,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      queryClient.invalidateQueries({ queryKey: ['decision', variables] });
    },
  });
};

// Mutation for unarchiving a decision
export const useUnarchiveDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unarchiveDecision,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      queryClient.invalidateQueries({ queryKey: ['decision', variables] });
    },
  });
};

// Mutation for reviewing a decision (Admin)
export const useReviewDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => reviewDecision(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      queryClient.invalidateQueries({ queryKey: ['decision', variables.id] });
    },
  });
};