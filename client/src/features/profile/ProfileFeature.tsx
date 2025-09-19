import { useSelector } from 'react-redux';
import { SkillsSection } from './components/organisms/SkillsSection';
import { useProfile } from './hooks/useProfile';
import type { RootState } from '@/store/store';
import { ProfileHeader } from './components/organisms/ProfileHeader';
import { AchievementsSection } from './components/organisms/AchievementsSection';
import { CertificationSection } from './components/organisms/CertificationSection';
import { ExperienceSection } from './components/organisms/ExperienceSection';
import { EducationSection } from './components/organisms/EducationSection';
import { SuggestionsSection } from './components/organisms/SuggestionsSection';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  // Fetching user profile
  useProfile(identifier);

  const { profile, isCurrentUser } = useSelector((state: RootState) => state.profile);

  const isGithubConnected = profile?.github_html_url ? true : false;

  const hasSkills = profile.skills.length > 0;
  const hasAchievements = profile.achievements.length > 0;
  const hasCertfications = profile.certifications.length > 0;
  const hasExperience = profile.experiences.length > 0;
  const hasEducation = profile.educations.length > 0;

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
        <div className="mx-auto grid gap-2 md:w-11/12">
          <div className="space-y-2">
            {isCurrentUser && (
              <SuggestionsSection
                showGithubAddButton={!isGithubConnected}
                showAddSkillButton={!hasSkills}
                showAddAchievementButton={!hasAchievements}
                showAddCertficationButton={!hasCertfications}
                showAddExperienceButton={!hasExperience}
                showAddEducationButton={!hasEducation}
                showAddGithubProject={isGithubConnected}
              />
            )}

            {hasSkills && <SkillsSection skills={profile.skills} isCurrentUser={isCurrentUser} />}

            {hasAchievements && (
              <AchievementsSection
                achievements={profile.achievements}
                isCurrentUser={isCurrentUser}
              />
            )}

            {hasCertfications && (
              <CertificationSection
                certificates={profile.certifications}
                isCurrentUser={isCurrentUser}
              />
            )}
          </div>

          <div className="space-y-2">
            {hasExperience && (
              <ExperienceSection experiences={profile.experiences} isCurrentUser={isCurrentUser} />
            )}
            {hasEducation && (
              <EducationSection educations={profile.educations} isCurrentUser={isCurrentUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
