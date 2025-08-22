import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import * as projectService from '../services/projectService';

export const useCreateProject = () => {
  return useMutation({
    mutationFn: projectService.createProjectService,
  });
};

export const useInfiniteFetchProjectsProfileUrl = (profileUrl?: string, pageSize: number = 10) => {
  const { profileUrl: routeUrl } = useParams({ strict: false });

  const finalUrl = profileUrl ?? routeUrl;
  return useInfiniteQuery({
    queryKey: ['infinite-projects', finalUrl],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => {
      return projectService.fetchUserProjectsService(
        { profileUrl: finalUrl },
        { limit: pageSize, cursor: pageParam },
      );
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: !!finalUrl,
    initialPageParam: null,
    staleTime: 3 * 60 * 1000,
  });
};
