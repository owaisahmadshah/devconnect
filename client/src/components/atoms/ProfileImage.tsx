import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileImageProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProfileImage = ({
  src,
  fallback,
  size = 'md',
  className = '',
}: ProfileImageProps) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={src} alt={fallback} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};
