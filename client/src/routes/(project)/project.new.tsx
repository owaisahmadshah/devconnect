import { createFileRoute } from '@tanstack/react-router';

import { CreateProjectForm } from '@/features/project/components/CreateProjectForm';
import { requireAuth } from '@/lib/requireAuth';

export const Route = createFileRoute('/(project)/project/new')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return <CreateProjectForm />;
}
