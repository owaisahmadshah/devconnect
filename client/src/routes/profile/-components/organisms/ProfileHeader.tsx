import { IoCamera } from 'react-icons/io5';

import { ProfileImage } from '@/components/atoms/ProfileImage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <Card className="border-border bg-card relative mx-auto mt-2 overflow-hidden border shadow-md md:w-11/12">
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Profile Picture */}
          <div className="group relative shrink-0">
            {/* Glow effect */}
            <div className="from-primary/30 via-primary/20 absolute inset-0 scale-110 rounded-full bg-gradient-to-br to-transparent blur-2xl" />

            {/* Profile Image */}
            <div className="relative">
              <ProfileImage
                src={profilePictureUrl}
                fallback={initials}
                size="lg"
                className="border-background ring-primary/20 group-hover:ring-primary/40 relative border-4 shadow-xl ring-2 transition-all duration-300 group-hover:shadow-2xl"
              />

              {/* Camera Icon Overlay */}
              {isEditable && (
                <Label
                  htmlFor="profilePicture"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center text-white">
                          <IoCamera className="h-7 w-7" />
                          <span className="mt-1.5 text-xs font-semibold">Update</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Change profile picture</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Input
                    name="profilePicture"
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeProfilePicture}
                    className="hidden"
                  />
                </Label>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
            {/* Name and Edit Button */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  {fullName}
                </h1>
                {isEditable && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <UpdateProfileHeaderForm />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit profile details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {/* Role Badge */}
              {role && (
                <div className="flex justify-center sm:justify-start">
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                    {role}
                  </Badge>
                </div>
              )}
            </div>

            {/* Bio */}
            {bio && (
              <div className="pt-2">
                <p className="text-muted-foreground mx-auto max-w-2xl text-[15px] leading-relaxed sm:mx-0">
                  {bio}
                </p>
              </div>
            )}

            {/* Optional: Stats or Additional Info */}
            <div className="flex items-center justify-center gap-6 pt-2 sm:justify-start">
              <div className="text-center sm:text-left">
                <p className="text-foreground text-2xl font-bold">0</p>
                <p className="text-muted-foreground text-xs font-medium">Connections</p>
              </div>
              <div className="bg-border h-10 w-px" />
              <div className="text-center sm:text-left">
                <p className="text-foreground text-2xl font-bold">0</p>
                <p className="text-muted-foreground text-xs font-medium">Posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
