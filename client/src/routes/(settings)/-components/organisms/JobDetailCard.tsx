import type { TJobResponse } from 'shared';
import {
  CalendarDays,
  MapPin,
  Briefcase,
  Building2,
  Share2,
  ExternalLink,
  CircleDot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface IJobDetailCardProps extends TJobResponse {
  apply?: () => void;
  share?: () => void;
}

export const JobDetailCard = (props: IJobDetailCardProps) => {
  const { createdAt, description, location, organization, title, status, type, apply, share } =
    props;
  const dateStr = formatDate(createdAt);

  // Dynamic mapping for status styling
  const statusConfig = {
    open: 'border-emerald-500/50 text-emerald-600 bg-emerald-50/50',
    closed: 'border-red-500/50 text-red-600 bg-red-50/50',
  };

  return (
    <div className="bg-background mx-auto min-h-screen w-full max-w-4xl sm:min-h-fit">
      {/* Header Section */}
      <div className="border-border/40 border-b px-6 pt-8 pb-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex gap-5">
            {/* Organization Logo Placeholder */}
            <div className="bg-muted border-border/50 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border shadow-sm">
              {organization.logo ? (
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="h-full w-full rounded-xl object-contain"
                />
              ) : (
                <Building2 className="text-muted-foreground/60 size-8" />
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-foreground text-2xl leading-tight font-black tracking-tight sm:text-3xl">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px]">
                <span className="text-primary font-bold">{organization.name}</span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Badge
              variant="outline"
              className={cn(
                'rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase',
                statusConfig[status],
              )}
            >
              {status}
            </Badge>
          </div>
        </div>

        {/* Dynamic Stats Bar */}
        <div className="text-muted-foreground mt-8 flex flex-wrap items-center gap-6 text-[13px] font-medium">
          <div className="bg-muted/50 text-foreground flex items-center gap-2 rounded-lg px-3 py-1">
            <Briefcase className="text-primary size-4" />
            <span className="capitalize">{type.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            Posted {dateStr}
          </div>

          {status === 'open' && (
            <div className="flex items-center gap-2 text-emerald-600">
              <CircleDot className="size-3.5 animate-pulse" />
              Accepting Applications
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl px-6 py-10">
        <div className="space-y-6">
          <h3 className="text-foreground text-lg font-bold">Job Description</h3>
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="prose prose-slate dark:prose-invert text-foreground/80 max-w-none text-[16px] leading-[1.8] [&>p]:mb-4 [&>ul]:ml-4 [&>ul]:list-disc [&>ul]:space-y-2"
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-background/95 border-border/40 sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t p-6 backdrop-blur-md">
        <div className="hidden overflow-hidden sm:block">
          <p className="text-foreground truncate text-[13px] font-bold">{title}</p>
          <p className="text-muted-foreground truncate text-[11px] tracking-widest uppercase">
            {organization.name}
          </p>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={share}
            className="hover:bg-muted border-border/60 h-12 w-12 shrink-0 rounded-xl"
          >
            <Share2 className="size-5" />
          </Button>
          <Button
            onClick={apply}
            disabled={status === 'closed'}
            className={cn(
              'h-12 flex-1 gap-2 rounded-xl text-[15px] font-bold shadow-lg transition-all active:scale-95 sm:w-48',
              status === 'open' ? 'shadow-primary/20' : 'cursor-not-allowed grayscale',
            )}
          >
            {status === 'open' ? 'Apply Now' : 'Position Closed'}
            <ExternalLink className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
