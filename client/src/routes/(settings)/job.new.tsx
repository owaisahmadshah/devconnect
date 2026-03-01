import { createFileRoute } from '@tanstack/react-router';
import { CreateJobForm } from './-components/CreateJobForm';
import { requireAuth } from '@/lib/requireAuth';

export const Route = createFileRoute('/(settings)/job/new')({
  component: CreateJobForm,
  loader: requireAuth,
});
