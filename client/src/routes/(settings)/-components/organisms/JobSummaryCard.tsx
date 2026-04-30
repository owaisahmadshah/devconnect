import { MoreHorizontal, MapPin, Building2, Clock, CheckCircle2 } from 'lucide-react';
import type { TJobSummaryResponse } from 'shared';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface IJobSummaryCardProps extends TJobSummaryResponse {
  action?: () => void;
}

export const JobSummaryCard = (props: IJobSummaryCardProps) => {
  const { _id, createdAt, location, title, organization, status } = props;

  return (
    <Link
      to="/organization/$organizationURL/job/$jobId"
      params={{ organizationURL: organization.organizationURL, jobId: _id }}
      className="group border-border/40 bg-card hover:bg-muted/30 relative flex w-full gap-4 border-b p-5 transition-all duration-300"
    >
      <div className="border-border/60 bg-muted/50 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-sm transition-transform group-hover:scale-105">
        {organization.logo ? (
          <img
            src={organization.logo}
            alt={organization.name}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <Building2 className="text-muted-foreground/50 h-6 w-6" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-foreground group-hover:text-primary text-[17px] leading-tight font-black tracking-tight transition-colors sm:text-lg">
              {title}
            </h3>

            <div className="flex items-center gap-1.5">
              <span className="text-foreground/80 text-[14px] font-bold hover:underline">
                {organization.name}
              </span>
              {status === 'open' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
            </div>
          </div>

          <button
            onClick={e => e.preventDefault()}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="text-primary/70 h-3.5 w-3.5" />
            {location}
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase',
              status === 'open'
                ? 'border-emerald-200/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground border-border',
            )}
          >
            {status}
          </span>

          {status === 'open' && (
            <span className="text-[11px] font-bold text-emerald-600/80">Actively recruiting</span>
          )}
        </div>
      </div>
    </Link>
  );
};
