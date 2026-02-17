import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../services/statsService';
import { getAllDecisions } from '../services/decisionService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats().then(res => res.data),
  });
};

// Optional: fetch archived count separately if needed
export const useArchivedCount = () => {
  return useQuery({
    queryKey: ['archivedCount'],
    queryFn: () => getAllDecisions({ isArchived: 'true', limit: 1 }).then(res => res.data.total),
  });
};