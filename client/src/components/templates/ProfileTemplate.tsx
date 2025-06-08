import { ProfileHeader } from '../../features/profile/components/organisms/ProfileHeader';
import { SkillsSection } from '@/features/profile/components/organisms/SkillsSection';
import { AchievementsSection } from '../organisms/profile/AchievementsSection';
import { CertificationSection } from '../../features/profile/components/organisms/CertificationSection';
import { EducationSection } from '../../features/profile/components/organisms/EducationSection';
import { ExperienceSection } from '../../features/profile/components/organisms/ExperienceSection';
import type { TUserProfileResponse } from 'shared';

interface ProfileTemplateProps {
  profile: TUserProfileResponse;
  isCurrentUser: boolean;
}

export const ProfileTemplate = ({
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
