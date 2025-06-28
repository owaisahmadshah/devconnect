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
      className="relative"
      actionAddChild={isCurrentUser && <AddAchivementForm />}
    >
      <div className="flex flex-col gap-4">
        {achievements.map(achievement => (
          <AchievementItem
            key={achievement._id}
            title={achievement.title}
            awardedBy={achievement.awardedBy}
            description={achievement.description}
            date={achievement.date}
            _id={achievement._id}
            isCurrentUser={isCurrentUser}
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
