import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchOrganizationByURLService } from '../-services/organizationService';
import { useParams } from '@tanstack/react-router';

export const useFetchOrganizationByURL = () => {
  const { organizationURL } = useParams({ from: `/(settings)/o/organization/$organizationURL` });

  return useSuspenseQuery({
    queryKey: ['organization-by-url', organizationURL],
    queryFn: () => fetchOrganizationByURLService({ query: organizationURL! }),
    // enabled: !!organizationURL,
  });
};
