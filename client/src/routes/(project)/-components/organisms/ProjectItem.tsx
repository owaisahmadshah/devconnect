import { Card, CardContent } from '@/components/ui/card';
import type { TProjectSummaryResponse } from 'shared';
import { DisplayBadgesList } from '../molecules/DisplayBadgesList';
import { Link } from '@tanstack/react-router';
import { formatDate } from '@/lib/dateUtils';
import { Calendar, ArrowUpRight } from 'lucide-react';

export const ProjectItem = ({
  _id,
  title,
  description,
  tags,
  techStacks,
  creationDate,
}: TProjectSummaryResponse) => {
  return (
    <Card className="group border-border/40 bg-card hover:border-primary/40 hover:shadow-primary/5 relative overflow-hidden rounded-[1.5rem] transition-all hover:shadow-2xl">
      <CardContent className="p-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: _id }}
                  className="text-foreground hover:text-primary text-xl font-black tracking-tight uppercase transition-colors"
                >
                  {title}
                </Link>
                <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground/80 max-w-2xl text-[14px] leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <DisplayBadgesList
                list={tags.slice(0, 3)}
                listLabel="Industry"
                listKey="tag"
                hasMore={tags.length > 3}
                badgeVariant="secondary"
              />
              <DisplayBadgesList
                list={techStacks.slice(0, 3)}
                listLabel="Stack"
                listKey="tech"
                hasMore={techStacks.length > 3}
                badgeVariant="outline"
              />
            </div>
          </div>

          <div className="bg-muted/40 text-muted-foreground border-border/10 flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-[11px] font-bold tracking-widest uppercase">
            <Calendar className="size-3.5" />
            {formatDate(creationDate)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
