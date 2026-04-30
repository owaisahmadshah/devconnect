import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DisplayBadgesListProps {
  list: any[];
  listLabel: string;
  listKey: string;
  hasMore: boolean;
  badgeVariant?: 'default' | 'outline' | 'secondary' | 'destructive';
  customClasses?: string;
}

export const DisplayBadgesList = ({
  list,
  listLabel,
  listKey,
  hasMore,
  badgeVariant = 'default',
  customClasses = '',
}: DisplayBadgesListProps) => {
  return (
    <div className={cn('flex flex-col gap-1.5', customClasses)}>
      <span className="text-muted-foreground/60 text-[10px] font-black tracking-[0.1em] uppercase">
        {listLabel}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {list.map((listItem, idx) => (
          <Badge
            key={idx}
            variant={badgeVariant}
            className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold tracking-tight uppercase"
          >
            {listItem[listKey]}
          </Badge>
        ))}
        {hasMore && (
          <Badge
            variant={badgeVariant}
            className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold opacity-50"
          >
            +{list.length - 3} more
          </Badge>
        )}
      </div>
    </div>
  );
};
