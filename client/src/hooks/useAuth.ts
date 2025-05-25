import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import type { TUserProfileSummaryResponse } from 'shared';

export interface AuthContext {
  isLoggedIn: () => boolean;
  user: TUserProfileSummaryResponse | null;
  isLoading: boolean;
}

export const useAuth = (): AuthContext => {
  const {
    user,
    isLoggedIn: isSignedIn,
    isLoading,
  } = useSelector((state: RootState) => state.profileSummary);
  const isLoggedIn = () => !!user && isSignedIn;
  return { isLoggedIn, user, isLoading };
};
