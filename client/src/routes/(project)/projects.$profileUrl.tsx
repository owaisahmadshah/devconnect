import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { ProjectList } from './-components/ProjectList';

export const Route = createFileRoute('/(project)/projects/$profileUrl')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return <ProjectList />;
}
