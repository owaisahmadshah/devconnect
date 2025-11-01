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
    <p className={cn('flex flex-wrap gap-2', customClasses)}>
      <span className="font-medium mr-2">{listLabel}</span>
      {list.map((listItem, idx) => (
        <Badge key={idx} variant={badgeVariant}>
          {listItem[listKey]}
        </Badge>
      ))}
      {hasMore && <Badge variant={badgeVariant}>+more</Badge>}
    </p>
  );
};
