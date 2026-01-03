import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { Connections } from './-components/Connections';

export const Route = createFileRoute('/(network)/network_/connections')({
  component: Connections,
  loader: requireAuth,
});
