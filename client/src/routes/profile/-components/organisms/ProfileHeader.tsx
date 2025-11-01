import { IoCamera } from 'react-icons/io5';

import { ProfileImage } from '@/components/atoms/ProfileImage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { singleImageSchema } from 'shared';
import { useProfilePictureUpdate } from '../../-hooks/useProfile';
import { UpdateProfileHeaderForm } from './UpdateProfileHeaderForm';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  profilePictureUrl?: string;
  isEditable?: boolean;
}

export const ProfileHeader = ({
  firstName,
  lastName,
  role,
  bio,
  profilePictureUrl,
  isEditable = false,
}: ProfileHeaderProps) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0]} ${lastName[0]}`.toUpperCase();

  const { mutateAsync: updatePicture } = useProfilePictureUpdate();

  const handleChangeProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn('No file selected.');
      return;
    }

    const validationResult = singleImageSchema.safeParse({ image: file });
    if (!validationResult.success) {
      console.warn('Image validation failed.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    await updatePicture(formData);
  };

  return (
    <div className="relative mb-6">
      {/* <div className="absolute inset-0 h-32 bg-gradient-to-br from-blue-600 to-blue-700" /> */}
      <div className="absolute inset-0 h-32 border-2 bg-gradient-to-br" />
      <div className="relative px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:space-x-6">
          <div className="flex items-end">
            <ProfileImage
              src={profilePictureUrl}
              fallback={initials}
              size="lg"
              className="border-4 border-white"
            />

            {isEditable && (
              <span className="mb-8">
                <Label htmlFor="profilePicture">
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer">
                      <IoCamera />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-muted-foreground bg-background w-fit rounded-md px-2 py-1 text-sm shadow-md">
                      Change profile picture.
                    </HoverCardContent>
                  </HoverCard>
                </Label>
                <Input
                  name="profilePicture"
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleChangeProfilePicture}
                  hidden
                />
              </span>
            )}
          </div>

          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <div className="flex items-center justify-center space-x-4 sm:justify-start">
              <h1 className="text-2xl font-bold">{fullName}</h1>
              {isEditable && (
                <HoverCard>
                  <HoverCardTrigger className="cursor-pointer">
                    <UpdateProfileHeaderForm />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-muted-foreground bg-background w-fit rounded-md px-2 py-1 text-sm shadow-md">
                    Edit name, role and bio.
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
            <p className="text-sm text-gray-500">{role}</p>
            <HoverCard>
              <HoverCardTrigger>
                <p className="mt-2 mb-2 line-clamp-1 w-3xs text-sm text-gray-600">{bio}</p>
              </HoverCardTrigger>
              <HoverCardContent className="text-muted-foreground bg-background w-fit rounded-md px-2 py-1 text-sm shadow-md">
                <p className="w-3xs text-sm text-gray-600">{bio}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </div>
  );
};
