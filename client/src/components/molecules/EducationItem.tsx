import { getDateRange } from '@/lib/dateUtils';
import { MdEdit, MdCalendarToday } from 'react-icons/md';
import { type TEducationWithId } from 'shared';

interface EducationItemProps extends Partial<TEducationWithId> {
  onAction?: () => Promise<void>;
  isCurrentUser: boolean;
}

export const EducationItem = ({
  onAction,
  degree,
  fieldOfStudy,
  school,
  started,
  ended,
  isCurrentUser = false,
}: EducationItemProps) => {
  return (
    <div className="flex w-full justify-between">
      <div className="grid gap-3">
        <div>
          <h1>{degree}</h1>
          <p>{fieldOfStudy}</p>
          <p>{school}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MdCalendarToday size={16} />
          <span>{getDateRange(started!, ended!)}</span>
        </div>
      </div>

      {/* If the user is signed and looking at his own profile then he can perform action on his profile */}
      {isCurrentUser && (
        <div>
          <span onClick={onAction} className="cursor-pointer">
            <MdEdit />
          </span>
        </div>
      )}
    </div>
  );
};
