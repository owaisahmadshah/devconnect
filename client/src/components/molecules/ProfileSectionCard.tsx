import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ProfileSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actionChildren?: React.ReactNode;
}

export const ProfileSectionCard = ({
  title,
  children,
  className = '',
  actionChildren,
}: ProfileSectionCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        {actionChildren && <div>{actionChildren}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
