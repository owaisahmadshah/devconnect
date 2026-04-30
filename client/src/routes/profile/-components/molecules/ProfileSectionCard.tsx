import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProfileSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actionAddChild?: React.ReactNode;
  actionEditChildren?: React.ReactNode;
}

export const ProfileSectionCard = ({
  title,
  children,
  className = '',
  actionAddChild,
  actionEditChildren,
}: ProfileSectionCardProps) => {
  return (
    <Card
      className={cn(
        'border-border/40 bg-card overflow-hidden rounded-2xl shadow-sm transition-all',
        className,
      )}
    >
      <CardHeader className="border-border/10 bg-muted/5 flex flex-row items-center justify-between border-b px-6 py-4">
        <h3 className="text-foreground/70 text-[13px] font-black tracking-[0.15em] uppercase">
          {title}
        </h3>
        <div className="flex items-center gap-1.5">
          {actionAddChild && (
            <div className="transition-transform hover:scale-105">{actionAddChild}</div>
          )}
          {actionEditChildren && (
            <div className="transition-transform hover:scale-105">{actionEditChildren}</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
};
