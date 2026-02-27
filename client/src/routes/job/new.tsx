import { createFileRoute } from '@tanstack/react-router';

import { CreateJobForm } from './-components/CreateJobForm';

export const Route = createFileRoute('/job/new')({
  component: CreateJobForm,
});
