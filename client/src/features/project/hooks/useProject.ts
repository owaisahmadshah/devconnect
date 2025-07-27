import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import * as projectService from '../services/projectService';

export const useCreateProject = () => {
  return useMutation({
    mutationFn: projectService.createProjectService,
  });
};

export const useInfiniteFetchProjectsProfileUrl = (profileId?: string, pageSize: number = 10) => {
  const { profileId: routeId } = useParams({ strict: false });

  const finalId = profileId ?? routeId;

  return useInfiniteQuery({
    queryKey: ['infinite-projects', finalId],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return projectService.fetchUserProjectsService(
        { profileId: finalId },
        { limit: pageSize, cursor: pageParam },
      );
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: !!finalId,
    initialPageParam: null,
    staleTime: 3 * 60 * 1000,
  });
};
