import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/signup')({
  component: About,
});

function About() {
  return (
    <div>Welcome sign up!</div>
  );
}
