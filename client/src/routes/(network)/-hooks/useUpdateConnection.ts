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
              if (profile.connection._id !== data.receiver) {
                return profile;
              }

              return { ...profile, connection: data };
            }),
          })),
        };
      });

      queryClient.setQueryData(['pending-connections'], oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            connections: page.connections.map(profile => {
              if (profile.connection._id === data._id) {
                return { ...profile, connection: data };
              }

              return profile;
            }),
          })),
        };
      });

      queryClient.setQueryData(['connections'], oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            connections: page.connections.map(profile => {
              if (profile.connection._id === data._id) {
                return { ...profile, connection: data };
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
