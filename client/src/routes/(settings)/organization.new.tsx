import { createFileRoute } from '@tanstack/react-router';

import { CreateOrganizationForm } from './-components/CreateOrganizationForm';

export const Route = createFileRoute('/(settings)/organization/new')({
  component: CreateOrganizationForm,
});
