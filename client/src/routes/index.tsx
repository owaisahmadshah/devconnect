import { createFileRoute } from '@tanstack/react-router';
import { Posts } from './post/-components/Posts';
import { requireAuth } from '@/lib/requireAuth';

export const Route = createFileRoute('/')({
  component: Posts,
  loader: requireAuth,
});
