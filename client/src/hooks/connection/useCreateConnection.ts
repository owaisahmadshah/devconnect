import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { createConnections } from '@/services/networkService';
import { addConnectionInCache } from '@/lib/connection/addConnectionCache';
import type { RootState } from '@/store/store';
import { updateConnection } from '@/store/profile/profileSlice';

export function useCreateConnection() {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.profile);

  return useMutation({
    mutationFn: createConnections,
    onSuccess: data => {
      queryClient.setQueryData(['recommend-connections'], oldData =>
        addConnectionInCache({
          oldData,
          dataKey: 'profiles',
          receiverId: data.receiver,
          updateData: data,
        }),
      );

      queryClient.setQueryData(['pending-connections'], oldData =>
        addConnectionInCache({
          oldData,
          dataKey: 'connections',
          receiverId: data.receiver,
          updateData: data,
        }),
      );

      queryClient.setQueryData(['connections'], oldData =>
        addConnectionInCache({
          oldData,
          dataKey: 'connections',
          receiverId: data.receiver,
          updateData: data,
        }),
      );

      if (data.receiver === profile?._id) {
        dispatch(updateConnection(data));
      }
      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
