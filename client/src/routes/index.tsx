import { createFileRoute } from '@tanstack/react-router';
import { Posts } from '@/features/post/components/Posts';

export const Route = createFileRoute('/')({
  component: Posts,
});
