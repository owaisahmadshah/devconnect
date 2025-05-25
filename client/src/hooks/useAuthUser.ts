import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/auth-api';

export const useAuthUser = () =>
  useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
