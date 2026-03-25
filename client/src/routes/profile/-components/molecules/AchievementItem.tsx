import { MdEmojiEvents, MdCalendarToday } from 'react-icons/md';
import { Trash2 } from 'lucide-react';

import { type TAchievementWithId } from 'shared';
import { formatDate } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';
import { useProfileArrayDelete } from '../../-hooks/useProfile';

interface AchievementItemProps extends Partial<TAchievementWithId> {
  isCurrentUser: boolean;
}

export const AchievementItem = ({
  _id,
  title,
  awardedBy,
  description,
  date,
  isCurrentUser,
}: AchievementItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'achievements', deleteObjectId: _id as string });
  };

  return (
    <div className="flex w-full justify-between">
      <div className="grid flex-1 gap-3">
        {/* Main achievement info */}
        <div>
          <div className="flex items-center gap-2">
            <MdEmojiEvents className="text-yellow-500" size={20} />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <p className="text-base font-medium text-gray-700">{awardedBy}</p>
        </div>

        {/* Date */}
        {date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MdCalendarToday size={16} />
            <span>{formatDate(date)}</span>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="text-sm text-gray-700">
            <p>{description}</p>
          </div>
        )}
      </div>

      {/* Edit button for current user */}
      {isCurrentUser && (
        <Button variant={'ghost'} onClick={deleteAchievement} disabled={isPending}>
          <span className="cursor-pointer transition-colors hover:text-gray-600">
            <Trash2 size={20} />
          </span>
        </Button>
      )}
    </div>
  );
};
