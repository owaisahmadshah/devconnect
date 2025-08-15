import { createFileRoute } from '@tanstack/react-router';

import { requireAuth } from '@/lib/requireAuth';
import { CreateProjectForm } from '@/features/project/components/CreateProjectForm';

export const Route = createFileRoute('/project/new')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  return <CreateProjectForm />;
}
