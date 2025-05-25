import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from '@/store/user/profileSlice';
import { useAuthUser } from './useAuthUser';

export const useSyncUserToRedux = () => {
  const dispatch = useDispatch();
  const { data, isSuccess, isLoading, isError, isFetched } = useAuthUser();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      return;
    }

    if (isError) {
      dispatch(clearUser(data));
    }
  }, [isSuccess, data, isError, isFetched, dispatch]);

  return { user: data, isSuccess, isLoading, isError, isFetched };
};
