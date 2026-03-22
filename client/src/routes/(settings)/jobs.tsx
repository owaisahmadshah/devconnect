import { createFileRoute } from '@tanstack/react-router';
import { JobsFeedList } from './-components/JobsFeedList';
import { getSearchJobBaseSchema } from 'shared';

export const Route = createFileRoute('/(settings)/jobs')({
  validateSearch: getSearchJobBaseSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <JobsFeedList />
    </div>
  );
}
