import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { PendingConnections } from './-components/PendingConnections';

export const Route = createFileRoute('/(network)/network_/pendings')({
  component: PendingConnections,
  loader: requireAuth,
});
