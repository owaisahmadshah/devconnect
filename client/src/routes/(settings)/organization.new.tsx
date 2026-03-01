import { createFileRoute } from '@tanstack/react-router';

import { CreateOrganizationForm } from './-components/CreateOrganizationForm';
import { requireAuth } from '@/lib/requireAuth';

export const Route = createFileRoute('/(settings)/organization/new')({
  component: CreateOrganizationForm,
  loader: requireAuth,
});
