import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { CreateProjectForm } from './-components/CreateProjectForm';

export const Route = createFileRoute('/(project)/project/new')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return <CreateProjectForm />;
}
