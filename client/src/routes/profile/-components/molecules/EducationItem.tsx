import { Trash2 } from 'lucide-react';
import { MdCalendarToday } from 'react-icons/md';

import { getDateRange } from '@/lib/dateUtils';
import { type TEducationWithId } from 'shared';
import { useProfileArrayDelete } from '../../-hooks/useProfile';
import { Button } from '@/components/ui/button';
interface EducationItemProps extends Partial<TEducationWithId> {
  isCurrentUser: boolean;
}

export const EducationItem = ({
  _id,
  degree,
  fieldOfStudy,
  school,
  started,
  ended,
  isCurrentUser = false,
}: EducationItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'educations', deleteObjectId: _id as string });
  };

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
        <Button variant={'ghost'} onClick={deleteAchievement} disabled={isPending}>
          <span className="cursor-pointer transition-colors hover:text-gray-600">
            <Trash2 size={20} />
          </span>
        </Button>
      )}
    </div>
  );
};
