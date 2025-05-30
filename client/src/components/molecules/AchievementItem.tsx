import { MdEdit, MdEmojiEvents, MdCalendarToday } from 'react-icons/md';

import { type TAchievement } from 'shared';
import { formatDate } from '@/lib/dateUtils';

interface AchievementItemProps extends TAchievement {
  onAction?: () => Promise<void>;
  isCurrentUser: boolean;
}

export const AchievementItem = ({
  onAction,
  title,
  awardedBy,
  description,
  date,
  isCurrentUser,
}: AchievementItemProps) => {
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
        <div className="ml-4 flex-shrink-0">
          <span onClick={onAction} className="cursor-pointer transition-colors hover:text-gray-600">
            <MdEdit size={20} />
          </span>
        </div>
      )}
    </div>
  );
};
