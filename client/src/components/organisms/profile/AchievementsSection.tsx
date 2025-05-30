import { type TAchievement } from 'shared';
import { Button } from '../../ui/button';
import { Plus } from 'lucide-react';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';
import { AchievementItem } from '../../molecules/AchievementItem';

interface AchievementsSectionProps {
  onItemAction?: () => Promise<void>;
  onAddAchievement?: () => void;
  achievements: TAchievement[];
  isCurrentUser: boolean;
}

export const AchievementsSection = ({
  onItemAction,
  onAddAchievement,
  achievements,
  isCurrentUser,
}: AchievementsSectionProps) => {
  return (
    <ProfileSectionCard title="Achievements" className="relative">
      {isCurrentUser && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddAchievement}
          className="absolute top-4 right-4"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <div className="flex flex-col gap-4">
        {achievements.map((achievement, index) => (
            <AchievementItem
              key={index}
              onAction={onItemAction}
              title={achievement.title}
              awardedBy={achievement.awardedBy}
              description={achievement.description}
              date={achievement.date}
              isCurrentUser={isCurrentUser}
            />
          ))}
      </div>
    </ProfileSectionCard>
  );
};
