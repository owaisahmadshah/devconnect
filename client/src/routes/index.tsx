import { createFileRoute } from '@tanstack/react-router';
import { Posts } from './post/-components/Posts';

export const Route = createFileRoute('/')({
  component: Posts,
});
