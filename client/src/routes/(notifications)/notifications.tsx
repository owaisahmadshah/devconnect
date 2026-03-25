import { createFileRoute } from '@tanstack/react-router';
import { Notifications } from './-components/Notifications';

export const Route = createFileRoute('/(notifications)/notifications')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Notifications />;
}
