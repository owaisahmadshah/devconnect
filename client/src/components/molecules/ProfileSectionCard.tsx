import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ProfileSectionCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileSectionCard = ({
  title,
  children,
  className = '',
}: ProfileSectionCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
