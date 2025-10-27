import { CreatePostForm } from '@/features/post/components/CreatePostForm';
import { requireAuth } from '@/lib/requireAuth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/post/new')({
  component: CreatePostForm,
  loader: requireAuth,
});
