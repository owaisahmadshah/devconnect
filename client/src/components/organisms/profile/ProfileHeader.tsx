import { ProfileImage } from '@/components/atoms/ProfileImage';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  profilePictureUrl?: string;
  onEdit?: () => void;
  isEditable?: boolean;
}

export const ProfileHeader = ({
  firstName,
  lastName,
  role,
  bio,
  profilePictureUrl,
  onEdit,
  isEditable = false,
}: ProfileHeaderProps) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0]} ${lastName[0]}`.toUpperCase();

  return (
    <div className="relative mb-6">
      {/* <div className="absolute inset-0 h-32 bg-gradient-to-br from-blue-600 to-blue-700" /> */}
      <div className="absolute inset-0 h-32 border-2 bg-gradient-to-br" />
      <div className="relative px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:space-x-6">
          <ProfileImage
            src={profilePictureUrl}
            fallback={initials}
            size="lg"
            className="border-4 border-white"
          />
          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <div className="flex items-center justify-center space-x-4 sm:justify-start">
              <h1 className="text-2xl font-bold">{fullName}</h1>
              {isEditable && (
                <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500">{role}</p>
            <p className="mt-2 text-gray-600">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
