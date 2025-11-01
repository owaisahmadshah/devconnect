import { requireAuth } from '@/lib/requireAuth';
import { createFileRoute } from '@tanstack/react-router';
import { CreatePostForm } from './-components/CreatePostForm';

export const Route = createFileRoute('/post/new')({
  component: CreatePostForm,
  loader: requireAuth,
});
