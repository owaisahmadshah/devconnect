import { Button } from '@/components/ui/button';
import { ConnectionCard } from './organisms/ConnectionCard';
import { useCreateConnection } from '@/hooks/connection/useCreateConnection';
import { useUpdateConnection } from '@/hooks/connection/useUpdateConnection';
import { useDeleteConnection } from '@/hooks/connection/useDeleteConnection';
import type { TUserProfileSummaryResponse, TUserProfileWithConnection } from 'shared';

interface ConnectionsListProps {
  useInfiniteQuery: () => {
    data: any;
    error: any;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
    isLoading: boolean;
  };
  title: string;
  dataKey: 'connections' | 'profiles'; // Key to extract data from pages
  header?: React.ReactNode; // Optional header content (for Network component)
}

export const ConnectionsList = ({
  useInfiniteQuery,
  title,
  dataKey,
  header,
}: ConnectionsListProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery();

  const connections = data?.pages.flatMap((page: any) => page[dataKey]) ?? [];

  const { mutateAsync: addConnection } = useCreateConnection();
  const { mutateAsync: deleteConnection } = useDeleteConnection();
  const { mutateAsync: updateConnection } = useUpdateConnection();

  return (
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 space-y-2 py-4">
      {header}
      <h1 className="w-full text-center">{title}</h1>
      {connections.map((connection: TUserProfileSummaryResponse | TUserProfileWithConnection) => (
        <ConnectionCard
          key={connection._id}
          user={connection}
          addConnection={() => addConnection({ receiver: connection._id, state: 'pending' })}
          deleteConnection={() =>
            deleteConnection({ connectionId: connection.connection?._id ?? '' })
          }
          removeConnection={() =>
            updateConnection({
              connectionId: connection.connection?._id ?? '',
              state: 'rejected',
            })
          }
          acceptConnection={() =>
            updateConnection({
              connectionId: connection.connection?._id ?? '',
              state: 'accepted',
            })
          }
        />
      ))}
      {hasNextPage && (
        <div className="px-4 py-2">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="link">
            {isFetchingNextPage ? 'Loading more connections...' : 'Load more connections'}
          </Button>
        </div>
      )}
    </div>
  );
};
