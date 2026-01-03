import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { Link } from '@tanstack/react-router';

import { useInfiniteRecommendConnections } from '../-hooks/useRecommendConnections';
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { ConnectionsList } from './ConnectionList';
import ErrorFallback from '@/components/ErrorFallback';

export const Network = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<div>Loading Network from Suspense...</div>}>
      <ConnectionsList
        useInfiniteQuery={useInfiniteRecommendConnections}
        title=""
        dataKey="profiles"
        header={
          <div className="w-[80%] rounded-2xl border">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Pending Connections</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <Link to={'/network/pendings'} className="w-full text-center">
                  You haven&apos;t have any pending connection right now!
                </Link>
              </EmptyContent>
            </Empty>
          </div>
        }
      />
    </Suspense>
  </ErrorBoundary>
);
