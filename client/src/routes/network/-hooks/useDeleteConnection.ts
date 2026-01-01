import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteConnection } from '../-services/networkService';

export function useDeleteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConnection,
    onSuccess: data => {
      queryClient.setQueryData(['recommend-connections'], oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            profiles: page.profiles.map(profile => {
              if (profile.connection?._id === data._id) {
                return { ...profile, connection: {} };
              }

              return profile;
            }),
          })),
        };
      });

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
