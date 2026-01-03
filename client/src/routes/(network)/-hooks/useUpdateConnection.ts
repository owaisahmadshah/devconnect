import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateConnection } from '../-services/networkService';
import { updateConnectionInCache } from '../-utils/updateConnectionCache';

export function useUpdateConnection() {
  const queryClient = useQueryClient();

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

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
