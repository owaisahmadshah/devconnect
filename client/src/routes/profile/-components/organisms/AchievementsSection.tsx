import { type TAchievementWithId } from 'shared';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AchievementItem } from '../molecules/AchievementItem';
import { AddAchivementForm } from './AddAchievementForm';

interface AchievementsSectionProps {
  achievements: TAchievementWithId[];
  isCurrentUser: boolean;
}

export const AchievementsSection = ({ achievements, isCurrentUser }: AchievementsSectionProps) => {
  return (
    <ProfileSectionCard
      title="Achievements"
      actionAddChild={isCurrentUser && <AddAchivementForm />}
    >
      <div className="divide-border/40 flex w-full flex-col divide-y">
        {achievements.map(achievement => (
          <AchievementItem
            key={achievement._id}
            _id={achievement._id}
            title={achievement.title}
            awardedBy={achievement.awardedBy}
            description={achievement.description}
            date={achievement.date}
            isCurrentUser={isCurrentUser}
            className="py-6 first:pt-0 last:pb-0"
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
