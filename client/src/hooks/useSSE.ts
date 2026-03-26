import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useSSE = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/notifications/sse`,
      { withCredentials: true },
    );

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'Connected') return;

      queryClient.setQueryData(
        ['notifications', 'unread-count'],
        (old: { count: number } | undefined) => ({
          count: (old?.count ?? 0) + 1,
        }),
      );

      queryClient.setQueryData(['notifications', 'has-new'], true);
    };

    eventSource.onerror = () => {
      console.warn('[SSE] Connection lost, browser will retry...');
    };

    return () => eventSource.close();
  }, [queryClient]);
};
