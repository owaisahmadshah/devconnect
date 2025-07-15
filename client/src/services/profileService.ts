import { apiGet } from '@/lib/api-client';

import type {
  TFullNameSearch,
  TPagination,
  TUserProfileSummaryresponseWithPagination,
} from 'shared';

export const fetchUserByFullName = async (
  fullName: TFullNameSearch,
  pagination: TPagination,
  signal?: AbortSignal,
): Promise<TUserProfileSummaryresponseWithPagination> => {
  return apiGet<Promise<TUserProfileSummaryresponseWithPagination>>(
    '/api/v1/profile/fetch-profiles-by-names',
    {
      ...fullName,
      ...pagination,
    },
    { signal },
  );
};
