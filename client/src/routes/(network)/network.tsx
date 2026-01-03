import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { Network } from './-components/Network';

export const Route = createFileRoute('/(network)/network')({
  component: Network,
  loader: requireAuth,
});
