import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IOrganizationHeaderProps {
  name: string;
  logo: string;
  action?: () => void;
  isFollowing?: boolean; // Added for better UX state
}

export const OrganizationHeader = ({
  name,
  logo,
  action,
  isFollowing = false,
}: IOrganizationHeaderProps) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4 md:gap-6">
        {/* Logo Container with shadow and border */}
        <div className="relative shrink-0">
          <Avatar className="border-background h-16 w-16 rounded-2xl border-2 shadow-xl md:h-20 md:w-20">
            <AvatarImage src={logo} className="object-cover" />
            <AvatarFallback className="bg-muted">
              <Building2 className="text-muted-foreground/50 size-1/2" />
            </AvatarFallback>
          </Avatar>
          {/* Decorative element for a "verified" feel or extra flair */}
          <div className="bg-primary border-card absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-4 shadow-sm">
            <div className="bg-primary-foreground h-1.5 w-1.5 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Brand Info */}
        <div className="flex min-w-0 flex-col">
          <h1 className="text-foreground truncate text-xl font-black tracking-tight uppercase md:text-3xl">
            {name}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-primary bg-primary/10 rounded px-2 py-0.5 text-[10px] font-black tracking-[0.2em] uppercase">
              Verified Entity
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        <Button
          onClick={action}
          variant={isFollowing ? 'outline' : 'default'}
          className={cn(
            'shadow-primary/20 h-10 rounded-xl px-6 text-[11px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-95 md:h-12 md:px-8',
            isFollowing ? 'border-border/60' : 'hover:opacity-90',
          )}
        >
          {isFollowing ? (
            'Following'
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Follow
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
