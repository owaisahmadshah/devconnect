import type { TJobResponse } from 'shared';
import { CalendarDays, MapPin, Briefcase, Building2, Share2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/dateUtils';

interface IJobDetailCardProps extends TJobResponse {
  apply?: () => void;
  share?: () => void;
}

export const JobDetailCard = (props: IJobDetailCardProps) => {
  const { createdAt, description, location, organization, title, status, type, apply, share } =
    props;

  const dateStr = formatDate(createdAt);

  return (
    <Card className="border-border bg-card w-full max-w-2xl overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="space-y-4 p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Badge variant="secondary" className="mb-2 font-medium capitalize">
              {type.replace('-', ' ')}
            </Badge>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">{title}</h2>
            <div className="text-muted-foreground flex items-center gap-2">
              <Building2 className="size-4" />
              <span className="font-medium">{organization.name}</span>
            </div>
          </div>

          <Badge variant={status === 'open' ? 'default' : 'outline'} className="capitalize">
            {status}
          </Badge>
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            Posted {dateStr}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="size-4" />
            {type}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Description
          </h4>
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="text-foreground/80 text-sm leading-relaxed"
            // className="text-foreground/80 line-clamp-4 text-sm leading-relaxed"
          />
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 flex gap-3 border-t p-6">
        <Button onClick={apply} className="flex-1 gap-2 font-semibold">
          Apply Now
          <ExternalLink className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={share}
          className="shrink-0"
          aria-label="Share Job"
        >
          <Share2 className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
