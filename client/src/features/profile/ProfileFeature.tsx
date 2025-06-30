import { useSelector } from 'react-redux';
import { SkillsSection } from './components/organisms/SkillsSection';
import { useProfile } from './hooks/useProfile';
import type { RootState } from '@/store/store';
import { ProfileHeader } from './components/organisms/ProfileHeader';
import { AchievementsSection } from './components/organisms/AchievementsSection';
import { CertificationSection } from './components/organisms/CertificationSection';
import { ExperienceSection } from './components/organisms/ExperienceSection';
import { EducationSection } from './components/organisms/EducationSection';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  // Fetching user profile
  useProfile(identifier);

  const { profile, isCurrentUser } = useSelector((state: RootState) => state.profile);

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
        <div className="mx-auto grid gap-6 md:w-11/12">
          <div className="space-y-6">
            <SkillsSection skills={profile.skills} isCurrentUser={isCurrentUser} />

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
