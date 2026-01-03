import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteConnection } from '../-services/networkService';
import { updateConnectionInCache } from '../-utils/updateConnectionCache';

export function useDeleteConnection() {
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

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
