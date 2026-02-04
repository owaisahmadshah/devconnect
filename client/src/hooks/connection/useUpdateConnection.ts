import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { updateConnection } from '@/services/networkService';
import { updateConnectionInCache } from '@/lib/connection/updateConnectionCache';
import { updateConnection as updateConnectionInProfile } from '@/store/profile/profileSlice';
import type { RootState } from '@/store/store';

export function useUpdateConnection() {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);

  return useMutation({
    mutationFn: updateConnection,
    onSuccess: data => {
      queryClient.setQueryData(['recommend-connections'], oldData =>
        updateConnectionInCache({
          oldData,
          dataKey: 'profiles',
          connectionId: data._id,
          updateData: data,
        }),
      );

      queryClient.setQueryData(['pending-connections'], oldData =>
        updateConnectionInCache({
          oldData,
          dataKey: 'connections',
          connectionId: data._id,
          updateData: data,
        }),
      );

      queryClient.setQueryData(['connections'], oldData =>
        updateConnectionInCache({
          oldData,
          dataKey: 'connections',
          connectionId: data._id,
          updateData: data,
        }),
      );

      if (profile?._id === data.receiver) {
        dispatch(updateConnectionInProfile(data));
      }

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
