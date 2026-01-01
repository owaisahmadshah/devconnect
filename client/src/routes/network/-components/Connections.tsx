import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { ConnectionCard } from './organisms/ConnectionCard';

import { useInfiniteRecommendConnections } from '../-hooks/useRecommendConnections';
import { useCreateConnection } from '../-hooks/useCreateConnection';
import { useDeleteConnection } from '../-hooks/useDeleteConnection';
import { useUpdateConnection } from '../-hooks/useUpdateConnection';

export const Connections = () => {
  const { data, error, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteRecommendConnections();

  const connections = data?.pages.flatMap(page => page.profiles) ?? [];

  const { mutateAsync: addConnection } = useCreateConnection();
  const { mutateAsync: deleteConnection } = useDeleteConnection();
  const { mutateAsync: updateConnection } = useUpdateConnection();

  if (isLoading) {
    return <div className="mt-2 space-y-3 text-center">Loading connections...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <div>{error.respons.data.message}</div>
        <Button>Reload page</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 space-y-2 py-4">
      {/* If user is signed in then he can create a post */}
      <Link to={'/connections/pending'} className="w-full text-center">
        No pending connections
      </Link>
      {connections.map(connection => (
        <ConnectionCard
          key={connection._id}
          user={connection}
          addConnection={() => addConnection({ receiver: connection._id, state: 'pending' })}
          deleteConnection={() =>
            deleteConnection({ connectionId: connection.connection?._id ?? '' })
          }
          removeConnection={() =>
            updateConnection({ connectionId: connection.connection?._id ?? '', state: 'rejected' })
          }
          acceptConnection={() =>
            updateConnection({ connectionId: connection.connection?._id ?? '', state: 'accepted' })
          }
        />
      ))}
      {hasNextPage && (
        <div className="px-4 py-2">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="link">
            {isFetchingNextPage ? 'Loading more posts...' : 'Load more connections'}
          </Button>
        </div>
      )}
    </div>
  );
};
