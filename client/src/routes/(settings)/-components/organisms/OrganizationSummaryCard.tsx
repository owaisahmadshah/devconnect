import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import type { TOrganizationSummaryResponse } from 'shared';
import { Building2 } from 'lucide-react';

interface IOrganizationSummaryCardProps extends TOrganizationSummaryResponse {
  redirectURL?: string;
  params?: {
    name: string;
    value: string;
  }[];
  size?: 's' | 'm' | 'l';
  customClassName?: string;
}

export const OrganizationSummaryCard = ({
  name,
  logo,
  organizationURL,
  size = 'm',
  redirectURL,
  params = [],
  customClassName = '',
}: IOrganizationSummaryCardProps) => {
  return (
    <Link
      className={cn('group flex w-full items-center gap-4 transition-all', customClassName)}
      to={redirectURL ?? '/o/organization/$organizationURL'}
      search={{
        ...Object.fromEntries(params.map(p => [p.name, p.value])),
      }}
      params={{
        organizationURL: organizationURL,
      }}
    >
      <div className="relative">
        <Avatar
          className={cn(
            'border-border/40 border shadow-sm transition-transform group-hover:scale-105',
            size === 's' && 'h-9 w-9',
            size === 'm' && 'h-12 w-12',
            size === 'l' && 'h-16 w-16',
          )}
        >
          <AvatarImage src={logo} className="object-cover" />
          <AvatarFallback className="bg-muted text-[10px] font-black tracking-tighter uppercase">
            <Building2 className="text-muted-foreground/50 size-1/2" />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex min-w-0 flex-col">
        <div
          className={cn(
            'text-foreground/90 group-hover:text-primary truncate font-black tracking-tight uppercase transition-colors',
            size === 's' && 'text-[11px]',
            size === 'm' && 'text-[13px]',
            size === 'l' && 'text-[15px]',
          )}
        >
          {name}
        </div>
        <div className="text-muted-foreground text-[9px] font-bold tracking-widest uppercase opacity-60 transition-opacity group-hover:opacity-100">
          Entity Profile
        </div>
      </div>
    </Link>
  );
};
