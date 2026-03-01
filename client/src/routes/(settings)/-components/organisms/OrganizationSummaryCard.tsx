import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import type { TOrganizationSummaryResponse } from 'shared';

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
      className={cn('flex w-full items-center gap-5', customClassName)}
      to={redirectURL ?? '/organization/$organizationURL'}
      search={{
        ...Object.fromEntries(params.map(p => [p.name, p.value])),
      }}
      params={{
        organizationURL: organizationURL,
      }}
    >
      <Avatar
        className={cn(
          size === 's' && 'h-8 w-8 max-sm:h-6 max-sm:w-6',
          size === 'm' && 'h-12 w-12 max-sm:h-8 max-sm:w-8',
          size === 'l' && 'h-16 w-16 max-sm:h-10 max-sm:w-10',
        )}
      >
        <AvatarImage src={logo} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div
          className={cn(
            'leading-tight font-semibold text-[--color-foreground]',
            size === 's' && 'text-sm max-sm:text-xs',
            size === 'm' && 'text-base max-sm:text-sm',
            size === 'l' && 'text-lg max-sm:text-base',
          )}
        >
          {name}
        </div>
      </div>
    </Link>
  );
};
