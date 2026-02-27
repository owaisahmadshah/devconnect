import { createFileRoute } from '@tanstack/react-router';

import { OrganizationsList } from './-components/OrganizationsList';

export const Route = createFileRoute('/(settings)/organizations-list')({
  component: OrganizationsList,
});
