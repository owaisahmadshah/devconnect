import { useSelector } from 'react-redux';
import { SkillsSection } from './organisms/SkillsSection';
import { useProfile } from '../-hooks/useProfile';
import type { RootState } from '@/store/store';
import { ProfileHeader } from './organisms/ProfileHeader';
import { AchievementsSection } from './organisms/AchievementsSection';
import { CertificationSection } from './organisms/CertificationSection';
import { ExperienceSection } from './organisms/ExperienceSection';
import { EducationSection } from './organisms/EducationSection';
import { SuggestionsSection } from './organisms/SuggestionsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPosts } from './UserPosts';
import { useCreateConnection } from '@/hooks/connection/useCreateConnection';
import { useDeleteConnection } from '@/hooks/connection/useDeleteConnection';
import { useUpdateConnection } from '@/hooks/connection/useUpdateConnection';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  // Fetching user profile
  useProfile(identifier);

  const { mutate: addConnection } = useCreateConnection();
  const { mutateAsync: deleteConnection } = useDeleteConnection();
  const { mutateAsync: updateConnection } = useUpdateConnection();

  const { profile, isCurrentUser } = useSelector((state: RootState) => state.profile);

  const isGithubConnected = profile?.github_html_url ? true : false;

  const hasSkills = profile.skills.length > 0;
  const hasAchievements = profile.achievements.length > 0;
  const hasCertfications = profile.certifications.length > 0;
  const hasExperience = profile.experiences.length > 0;
  const hasEducation = profile.educations.length > 0;

  return (
    <div className="mx-auto min-h-screen space-y-2 md:w-10/12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProfileHeader
          firstName={profile.firstName}
          lastName={profile.lastName || ''}
          role={profile.role}
          bio={profile.bio}
          profilePictureUrl={profile.profilePictureUrl}
          isEditable={isCurrentUser}
          connections={profile?.connections ?? 0}
          connection={{
            ...profile?.connection,
            userId: profile._id,
            addConnection: () => addConnection({ receiver: profile._id, state: 'pending' }),
            deleteConnection: () =>
              deleteConnection({ connectionId: profile.connection?._id ?? '' }),
            removeConnection: () =>
              updateConnection({
                connectionId: profile.connection?._id ?? '',
                state: 'rejected',
              }),
            acceptConnection: () =>
              updateConnection({
                connectionId: profile.connection?._id ?? '',
                state: 'accepted',
              }),
          }}
        />
      </div>

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
                navigateProfileUrl={profile.profileUrls[0].url}
                showOrganizationsButton={isCurrentUser}
                showPostAJobButton={isCurrentUser}
              />
            )}

            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                {' '}
                <UserPosts profileUrl={identifier} isCurrentUser={isCurrentUser} />{' '}
              </TabsContent>
              <TabsContent value="profile" className="space-y-2">
                {hasSkills && (
                  <SkillsSection skills={profile.skills} isCurrentUser={isCurrentUser} />
                )}

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

                {hasExperience && (
                  <ExperienceSection
                    experiences={profile.experiences}
                    isCurrentUser={isCurrentUser}
                  />
                )}
                {hasEducation && (
                  <EducationSection educations={profile.educations} isCurrentUser={isCurrentUser} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
