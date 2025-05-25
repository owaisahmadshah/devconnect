import type { AuthContext } from '@/hooks/useAuth';
import type { QueryClient } from '@tanstack/react-query';

export interface MyRouterContext {
  queryClient: QueryClient;
  authentication: AuthContext;
}
