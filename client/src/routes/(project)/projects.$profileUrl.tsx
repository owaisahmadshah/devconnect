import { createFileRoute } from '@tanstack/react-router';

import { useInfiniteFetchProjectsProfileUrl } from '@/features/project/hooks/useProject';
import { requireAuth } from '@/lib/requireAuth';

export const Route = createFileRoute('/(project)/projects/$profileUrl')({
  component: RouteComponent,
  loader: requireAuth,
});

function RouteComponent() {
  const { data, error } = useInfiniteFetchProjectsProfileUrl();

  return <div></div>;
}
