import { fetchOrganizationsInvitations } from '@/services/organizationMemberService';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useFetchOrganizationsInvitations = () => {
  return useSuspenseQuery({
    queryKey: ['invitations'],
    queryFn: fetchOrganizationsInvitations,
  });
};
