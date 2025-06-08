import { type TAchievementWithId } from 'shared';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AchievementItem } from '../molecules/AchievementItem';

interface AchievementsSectionProps {
  achievements: TAchievementWithId[];
  isCurrentUser: boolean;
}

export const AchievementsSection = ({ achievements, isCurrentUser }: AchievementsSectionProps) => {
  return (
    <ProfileSectionCard title="Achievements" className="relative">
      {isCurrentUser && (
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Plus className="h-4 w-4" />
        </Button>
      )}
      <div className="flex flex-col gap-4">
        {achievements.map((achievement) => (
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
