import { createFileRoute } from '@tanstack/react-router';

import { useInfiniteFetchProjectsProfileUrl } from '@/features/project/hooks/useProject';
import { requireAuth } from '@/lib/requireAuth';
import { CreateProjectForm } from '../../../features/project/components/CreateProjectForm';

export const Route = createFileRoute('/project/$profileId')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  const { data } = useInfiniteFetchProjectsProfileUrl();
  console.log(data);
  return <CreateProjectForm />;
}
