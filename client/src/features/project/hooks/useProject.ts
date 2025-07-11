import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useSearch } from '@tanstack/react-router';

import * as projectService from '../services/projectService';
import type { TPagination } from 'shared';

export const useCreateProject = () => {
  return useMutation({
    mutationFn: projectService.createProjectService,
  });
};

export const useFetchProjectsById = (
  profileId?: string,
  pagination: TPagination = { limit: 10, cursor: null },
) => {
  const { profileId: routeId } = useParams({ strict: false });
  const { limit, cursor } = useSearch({ strict: false });

  const finalId = profileId ?? routeId;

  const finalPagination: TPagination = {
    limit: limit ?? pagination.limit,
    cursor: cursor ?? pagination.cursor,
  };

  return useQuery({
    queryKey: ['projects', finalId, finalPagination],
    queryFn: () => projectService.fetchUserProjectsService({ profileId: finalId }, finalPagination),
    enabled: !!finalId,
    staleTime: 3 * 60 * 1000,
  });
};
