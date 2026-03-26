import { createFileRoute } from '@tanstack/react-router';

import { Notifications } from './-components/Notifications';
import { requireAuth } from '@/lib/requireAuth';

export const Route = createFileRoute('/(notifications)/notifications')({
  loader: requireAuth,
  component: RouteComponent,
});

function RouteComponent() {
  return <Notifications />;
}
