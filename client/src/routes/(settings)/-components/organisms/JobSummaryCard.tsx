import { MoreVertical, MapPin, Building2, Clock } from 'lucide-react';
import type { TJobSummaryResponse } from 'shared';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@tanstack/react-router';

interface IJobSummaryCardProps extends TJobSummaryResponse {
  action?: () => void;
}

export const JobSummaryCard = (props: IJobSummaryCardProps) => {
  const { _id, createdAt, location, title, organization, status } = props;

  return (
    <Link
      className="group border-border bg-card hover:bg-accent/50 relative flex cursor-pointer gap-4 border-b p-4 transition-colors"
      to="/o/organization/$organizationURL/job/$jobId"
      params={{ organizationURL: organization.organizationURL, jobId: _id }}
    >
      <div className="border-border bg-muted h-12 w-12 shrink-0 overflow-hidden rounded-md border">
        {organization.logo ? (
          <img
            src={organization.logo}
            alt={organization.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="text-muted-foreground h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="text-foreground group-hover:text-primary text-lg leading-tight font-semibold transition-colors">
            {title}
          </h3>
          <button className="hover:bg-muted text-muted-foreground rounded-full p-1">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <p className="text-foreground/90 text-sm font-medium">{organization.name}</p>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>

        {status && (
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {status}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
