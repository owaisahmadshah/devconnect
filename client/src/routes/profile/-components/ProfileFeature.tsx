import { useState } from 'react';

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
import { UserPosts } from './UserPosts';
import { useCreateConnection } from '@/hooks/connection/useCreateConnection';
import { useDeleteConnection } from '@/hooks/connection/useDeleteConnection';
import { useUpdateConnection } from '@/hooks/connection/useUpdateConnection';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  const [isActivityFocusMode, setIsActivityFocusMode] = useState(false);

  // Fetching user profile
  useProfile(identifier);

  const { mutate: addConnection } = useCreateConnection();
  const { mutateAsync: deleteConnection } = useDeleteConnection();
  const { mutateAsync: updateConnection } = useUpdateConnection();

  const { profile, isCurrentUser } = useSelector((state: RootState) => state.profile);

  const hasSkills = profile.skills.length > 0;
  const hasAchievements = profile.achievements.length > 0;
  const hasCertfications = profile.certifications.length > 0;
  const hasExperience = profile.experiences.length > 0;
  const hasEducation = profile.educations.length > 0;

  const hasAnyProfessionalContent =
    hasSkills ||
    hasAchievements ||
    hasCertfications ||
    hasExperience ||
    hasEducation ||
    !!profile.bio;

  // TODO: Update it
  // const hasAnyActivity = (profile?.postsCount && profile.postsCount > 0) || true;
  const hasAnyActivity = true;

  const leftColClass = hasAnyActivity ? 'lg:col-span-7' : 'lg:col-span-12';
  const rightColClass = hasAnyProfessionalContent ? 'lg:col-span-5' : 'lg:col-span-12';

  return (
    <div className="mx-auto min-h-screen space-y-2 md:w-10/12">
      <div className="">
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

      {!isActivityFocusMode && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {hasAnyProfessionalContent && (
              <div className={cn('space-y-6', leftColClass)}>
                <section className="border-border/50 bg-card rounded-2xl border p-6 shadow-sm">
                  <h3 className="text-foreground/80 mb-4 text-lg font-black tracking-widest uppercase">
                    About
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {profile.bio || 'No bio added yet.'}
                  </p>
                </section>

                <div className="space-y-4">
                  {hasExperience && (
                    <ExperienceSection
                      experiences={profile.experiences}
                      isCurrentUser={isCurrentUser}
                    />
                  )}
                  {hasEducation && (
                    <EducationSection
                      educations={profile.educations}
                      isCurrentUser={isCurrentUser}
                    />
                  )}
                  {hasSkills && (
                    <SkillsSection skills={profile.skills} isCurrentUser={isCurrentUser} />
                  )}
                </div>
                <div className="space-y-4">
                  {hasCertfications && (
                    <CertificationSection
                      certificates={profile.certifications}
                      isCurrentUser={isCurrentUser}
                    />
                  )}
                  {hasAchievements && (
                    <AchievementsSection
                      achievements={profile.achievements}
                      isCurrentUser={isCurrentUser}
                    />
                  )}
                </div>
              </div>
            )}

            <div className={cn('space-y-6 self-start lg:sticky lg:top-24', rightColClass)}>
              {isCurrentUser && (
                <SuggestionsSection
                  showAddSkillButton={!hasSkills}
                  showAddAchievementButton={!hasAchievements}
                  showAddCertficationButton={!hasCertfications}
                  showAddExperienceButton={!hasExperience}
                  showAddEducationButton={!hasEducation}
                  navigateProfileUrl={profile.profileUrls[0].url}
                  showOrganizationsButton={isCurrentUser}
                  showPostAJobButton={isCurrentUser}
                />
              )}

              {hasAnyActivity && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-muted-foreground text-sm font-black tracking-widest uppercase">
                      Recent Activity
                    </h3>
                    <button
                      className="text-primary text-xs font-bold hover:underline"
                      onClick={() => setIsActivityFocusMode(true)}
                    >
                      View All
                    </button>
                  </div>

                  <UserPosts profileUrl={identifier} isCurrentUser={isCurrentUser} limit={1} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isActivityFocusMode && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-3xl pt-6 duration-500">
          <div className="border-border/50 bg-background/80 sticky top-20 z-20 mb-6 flex items-center justify-between rounded-2xl border p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsActivityFocusMode(false)}
                className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
              <div>
                <h2 className="text-lg leading-none font-black">All Activity</h2>
                <p className="text-muted-foreground mt-1 text-xs font-bold tracking-wider uppercase">
                  {profile.firstName}'s Posts
                </p>
              </div>
            </div>
          </div>

          <UserPosts profileUrl={identifier} isCurrentUser={isCurrentUser} />

          <Button
            variant="outline"
            onClick={() => {
              setIsActivityFocusMode(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-muted-foreground hover:text-primary mt-8 w-full rounded-xl border-dashed py-6"
          >
            Back to Profile
          </Button>
        </div>
      )}
    </div>
  );
};
