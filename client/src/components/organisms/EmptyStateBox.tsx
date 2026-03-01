import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string; // Added for external overrides
  showAddIcon?: boolean;
}

export const EmptyStateBox = ({
  title = 'No items found',
  description = "You haven't created anything yet. Get started by creating your first item.",
  onAction,
  actionLabel = 'Create New',
  className,
  showAddIcon = true,
}: EmptyStateProps) => {
  return (
    <Empty
      className={cn(
        'bg-muted/30 hover:bg-muted/50 flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all sm:p-12',
        className,
      )}
    >
      <EmptyContent className="flex w-full max-w-md flex-col items-center text-center">
        <EmptyMedia className="mb-4 flex items-center justify-center">
          <div className="bg-primary/10 text-primary rounded-full p-4">
            <Plus className={`h-10 w-10 stroke-[1.5] ${showAddIcon ? 'block' : 'hidden'}`} />
          </div>
        </EmptyMedia>

        <EmptyHeader className="w-full">
          <EmptyTitle className="text-xl font-semibold tracking-tight">{title}</EmptyTitle>
          <EmptyDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {description}
          </EmptyDescription>
        </EmptyHeader>

        {onAction && (
          <div className="mt-6 flex w-full justify-center">
            <Button onClick={onAction} variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          </div>
        )}
      </EmptyContent>
    </Empty>
  );
};
