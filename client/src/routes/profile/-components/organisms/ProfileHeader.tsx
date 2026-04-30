import { IoCamera } from 'react-icons/io5';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { ProfileImage } from '@/components/atoms/ProfileImage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { singleImageSchema } from 'shared';
import { useProfilePictureUpdate } from '../../-hooks/useProfile';
import { UpdateProfileHeaderForm } from './UpdateProfileHeaderForm';
import { ConnectionActionButton } from '@/components/organisms/ConnectionActionButton';
import type { IConnectionActionButtonProps } from '@/types/connectionActionButton-type';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  profilePictureUrl?: string;
  isEditable?: boolean;
  connections: number;
  connection: IConnectionActionButtonProps;
}

export const ProfileHeader = ({
  firstName,
  lastName,
  role,
  bio,
  profilePictureUrl,
  isEditable = false,
  connections,
  connection,
}: ProfileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  const { mutateAsync: updatePicture } = useProfilePictureUpdate();

  const handleChangeProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent lightbox from opening when clicking upload
    const file = e.target.files?.[0];
    if (!file) return;

    const validationResult = singleImageSchema.safeParse({ image: file });
    if (!validationResult.success) return;

    const formData = new FormData();
    formData.append('profilePicture', file);
    await updatePicture(formData);
  };

  return (
    <Card className="bg-card relative mx-auto mt-2 w-full overflow-hidden border-none shadow-sm  md:rounded-xl">
      {/* Cover Pattern / Subtle Header Background */}
      {/* <div className="from-primary/10 via-muted to-primary/5 h-32 w-full bg-gradient-to-r" /> */}

      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-8">
          {/* Profile Picture Section */}
          <div className="group relative -mt-16 shrink-0">
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
              <ProfileImage
                src={profilePictureUrl}
                fallback={initials}
                size="lg"
                className="border-background bg-background ring-border h-32 w-32 border-4 shadow-xl ring-1 transition-transform duration-300 group-hover:scale-[1.02] sm:h-40 sm:w-40"
              />
            </div>

            {isEditable && (
              <div className="absolute right-2 bottom-2 z-10">
                <Label
                  htmlFor="profilePicture"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                >
                  <IoCamera className="h-5 w-5" />
                  <Input
                    name="profilePicture"
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeProfilePicture}
                    className="hidden"
                  />
                </Label>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3 text-center sm:pb-2 sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                {fullName}
              </h1>
              {isEditable && <UpdateProfileHeaderForm />}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {role && (
                <Badge
                  variant="secondary"
                  className="px-3 py-0.5 text-[13px] font-semibold tracking-wide uppercase"
                >
                  {role}
                </Badge>
              )}
              {!isEditable && <ConnectionActionButton {...connection} />}
            </div>

            {bio && (
              <p className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed">{bio}</p>
            )}

            <div className="flex items-center justify-center gap-6 pt-1 sm:justify-start">
              <div className="group cursor-default">
                <p className="text-foreground text-xl font-bold">{connections}</p>
                <p className="text-muted-foreground group-hover:text-primary text-[11px] font-bold tracking-wider uppercase transition-colors">
                  Connections
                </p>
              </div>
              <div className="bg-border/60 h-8 w-px" />
              <div className="group cursor-default">
                <p className="text-foreground text-xl font-bold">0</p>
                <p className="text-muted-foreground group-hover:text-primary text-[11px] font-bold tracking-wider uppercase transition-colors">
                  Posts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        plugins={[Zoom]}
        slides={[{ src: profilePictureUrl || '' }]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        styles={{
          root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, 0.9)' },
        }}
      />
    </Card>
  );
};
