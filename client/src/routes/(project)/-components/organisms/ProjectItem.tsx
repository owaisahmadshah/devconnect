import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { TProjectSummaryResponse } from 'shared';
import { DisplayBadgesList } from '../molecules/DisplayBadgesList';
import { Link } from '@tanstack/react-router';
import { formatDate } from '@/lib/dateUtils';

export const ProjectItem = ({
  _id,
  title,
  description,
  tags,
  techStacks,
  creationDate,
}: TProjectSummaryResponse) => {
  return (
    <Card className="hover:bg-background hover:border-popover mx-auto w-3/4 rounded-none max-sm:w-full">
      <CardHeader>
        <CardTitle>
          <Link to="/projects/$projectId" params={{ projectId: _id }} className="hover:underline text-xl">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">{description}</p>
        <div className="space-y-2">
          <DisplayBadgesList
            list={tags.slice(0, 3)}
            listLabel={'Tags'}
            listKey={'tag'}
            hasMore={tags.length > 3}
            badgeVariant="outline"
            customClasses="gap-1"
          />
          <DisplayBadgesList
            list={techStacks.slice(0, 3)}
            listLabel={'Tech Stacks'}
            listKey={'tech'}
            hasMore={techStacks.length > 3}
            badgeVariant="outline"
            customClasses="gap-1"
          />
          <p>
            <span className="font-medium">Created at:</span> {formatDate(creationDate)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
