import { lazy, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback2 from '@/components/ErrorFallback2';
import { InvitationsSkeleton } from './skeletons/InvitationsSkeleton';
import { NotificationsPanel } from './NotificationsPanel';

const Invitations = lazy(() => import('./Invitations').then(m => ({ default: m.Invitations })));

type TTab = 'notifications' | 'invitations';

export const Notifications = () => {
  const [activeTab, setActiveTab] = useState<TTab>('notifications');

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center space-y-4 py-4">
      <div className="border-border bg-muted flex w-full items-center gap-1 rounded-lg border p-1">
        {(['notifications', 'invitations'] as TTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all duration-150',
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeTab === 'notifications' && <NotificationsPanel />}

        {activeTab === 'invitations' && (
          <ErrorBoundary FallbackComponent={ErrorFallback2}>
            <Suspense fallback={<InvitationsSkeleton />}>
              <Invitations />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};
