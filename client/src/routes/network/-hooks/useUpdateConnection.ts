import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateConnection } from '../-services/networkService';

export function useUpdateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConnection,
    onSuccess: data => {
      queryClient.setQueryData(['recommend-connections'], oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            profiles: page.profiles.map(profile => {
              if (profile._id !== data.receiver) {
                return profile;
              }

              return { ...profile, connection: data };
            }),
          })),
        };
      });

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
