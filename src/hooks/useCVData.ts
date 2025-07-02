
import { useQuery } from '@tanstack/react-query';
import { loadCVData } from '@/services/cvService';

export const useCVData = () => {
  return useQuery({
    queryKey: ['cv-data'],
    queryFn: loadCVData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
