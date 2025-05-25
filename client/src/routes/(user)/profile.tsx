import { requireAuth } from '@/lib/requireAuth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(user)/profile')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return <div>Hello "/(user)/profile"!</div>;
}
