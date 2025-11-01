import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="flex gap-3">
          {actionAddChild && <span>{actionAddChild}</span>}
          {actionEditChildren && <span>{actionEditChildren}</span>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
