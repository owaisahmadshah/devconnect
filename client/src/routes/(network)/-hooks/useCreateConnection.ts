import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import { createConnections } from '../-services/networkService';

export function useCreateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConnections,
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

      queryClient.setQueryData(['pending-connections'], oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            connections: page.connections.map(connection => {
              if (connection._id === data.receiver) {
                return { ...connection, connection: data };
              }

              return connection;
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
            connections: page.connections.map(connection => {
              if (connection._id === data.receiver) {
                return { ...connection, connection: data };
              }

              return connection;
            }),
          })),
        };
      });

      // TODO: Update in feed-posts and elsewhere necessary
    },
  });
}
