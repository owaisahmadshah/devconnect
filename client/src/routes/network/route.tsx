import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { Connections } from './-components/Connections';

export const Route = createFileRoute('/network')({
  component: Connections,
  loader: requireAuth,
});
