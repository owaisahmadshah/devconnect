import { createFileRoute } from '@tanstack/react-router';

import { validateSearchParamsPaginationSchema, type TValidateSearchParamsPagination } from 'shared';
import { useFetchProjectsById } from '@/features/project/hooks/useProject';
import { requireAuth } from '@/lib/requireAuth';
import { CreateProjectForm } from '../../../features/project/components/CreateProjectForm';

export const Route = createFileRoute('/project/$profileId')({
  component: RouteComponent,
  loader: requireAuth,
  validateSearch: validateSearchParamsPaginationSchema,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const { data } = useFetchProjectsById();

  // Example: Update cursor after fetching next page
  const handleNext = async () => {
    if (data?.nextCursor) {
      navigate({
        search: (prev: TValidateSearchParamsPagination) => ({
          ...prev,
          cursor: data.nextCursor,
        }),
      });
    } else {
      navigate({
        search: (prev: TValidateSearchParamsPagination) => ({
          ...prev,
          cursor: 'thisIsNewNextCursor',
        }),
      });
    }
  };

  return <CreateProjectForm />;
}
