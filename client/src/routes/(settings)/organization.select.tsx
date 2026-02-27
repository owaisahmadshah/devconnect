import { createFileRoute } from '@tanstack/react-router';

import { SelectOrganizationForm } from '../job/-components/SelectOrganizationForm';

export const Route = createFileRoute('/(settings)/organization/select')({
  component: SelectOrganizationForm,
});
