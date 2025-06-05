import { ProfileHeader } from '../organisms/profile/ProfileHeader';
import { SkillsSection } from '../organisms/profile/SkillsSection';
import { AchievementsSection } from '../organisms/profile/AchievementsSection';
import { CertificationSection } from '../organisms/profile/CertificationSection';
import { EducationSection } from '../organisms/profile/EducationSection';
import { ExperienceSection } from '../organisms/profile/ExperienceSection';
import type { TUserProfileResponse, TAddProfileArrayField, TDeleteProfileArrayItem } from 'shared';

interface ProfileTemplateProps {
  onProfileArrayUpdate: (updateData: TAddProfileArrayField) => Promise<void>;
  onProfileArrayDelete: (deleteData: TDeleteProfileArrayItem) => Promise<void>;
  isPending: boolean;
  profile: TUserProfileResponse;
  isCurrentUser: boolean;
}

export const ProfileTemplate = ({
  onProfileArrayUpdate,
  onProfileArrayDelete,
  isPending,
  profile,
  isCurrentUser,
}: ProfileTemplateProps) => {
  return (
    <div className="mx-auto min-h-screen md:w-10/12">
      <ProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName || ''}
        role={profile.role}
        bio={profile.bio}
        profilePictureUrl={profile.profilePictureUrl}
        isEditable={isCurrentUser}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <SkillsSection
              onAddItem={onProfileArrayUpdate}
              onDeleteItem={onProfileArrayDelete}
              isLoading={isPending}
              skills={profile.skills}
              isCurrentUser={isCurrentUser}
            />

            <AchievementsSection
              achievements={profile.achievements}
              isCurrentUser={isCurrentUser}
            />

            <CertificationSection
              certificates={profile.certifications}
              isCurrentUser={isCurrentUser}
            />
          </div>

          <div className="space-y-6">
            <ExperienceSection experiences={profile.experiences} isCurrentUser={isCurrentUser} />
            <EducationSection educations={profile.educations} isCurrentUser={isCurrentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};
