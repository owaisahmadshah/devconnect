import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { createConnections } from '../-services/networkService';
import { addConnectionInCache } from '../-utils/addConnectionCache';

export function useCreateConnection() {
  const queryClient = useQueryClient();

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

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
