import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { updateConnectionInCache } from '@/lib/connection/updateConnectionCache';
import { deleteConnection } from '@/services/networkService';
import type { RootState } from '@/store/store';
import {
  deleteConnection as deleteConnectionInProfile,
  updateConnection,
} from '@/store/profile/profileSlice';

export function useDeleteConnection() {
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConnection,
    onSuccess: data => {
      queryClient.setQueryData(['recommend-connections'], oldData =>
        updateConnectionInCache({
          oldData,
          dataKey: 'profiles',
          connectionId: data._id,
          updateData: {},
        }),
      );

      queryClient.setQueryData(['pending-connections'], oldData =>
        updateConnectionInCache({
          oldData,
          connectionId: data._id,
          dataKey: 'connections',
          updateData: {},
        }),
      );

      queryClient.setQueryData(['connections'], oldData =>
        updateConnectionInCache({
          oldData,
          connectionId: data._id,
          dataKey: 'connections',
          updateData: {},
        }),
      );

      if (profile?._id === data.receiver && data.state === 'accepted') {
        dispatch(deleteConnectionInProfile({ connectionId: data._id }));
      }

      if (profile?._id === data.receiver && data.state === 'pending') {
        dispatch(updateConnection({ ...data, state: 'rejected' }));
      }

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
