import { IoPeople } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';

import type { TDeleteProfileArrayItem, TSkillWithId } from 'shared';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface SkillItemProps extends Partial<TSkillWithId> {
  onArrayItemDelete?: (deleteData: TDeleteProfileArrayItem) => Promise<void>;
  isCurrentUser: boolean;
  className: string;
  isEditable: boolean;
}

export const SkillItem = ({
  _id,
  onArrayItemDelete,
  skillName,
  skillProficiency,
  endorsements,
  isCurrentUser = false,
  className = '',
  isEditable = false,
}: SkillItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteItem = async () => {
    if (!onArrayItemDelete) return;
    setIsLoading(true);
    const response = await onArrayItemDelete({ fieldName: 'skills', deleteObjectId: _id! });
    console.log(response);
    setIsLoading(false);
  };

  return (
    <div className={cn('flex items-baseline justify-between', className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {!isEditable && <div className="bg-foreground h-2 w-2 rounded-full"></div>}
            <h1 className="font-bold">{skillName}</h1>
          </div>
          <p className="text-xs">({skillProficiency})</p>
        </div>

        <div className="flex justify-center gap-3">
          <p className="flex items-center gap-2 text-sm">
            <IoPeople />
            Endorsements
          </p>
          <p>{endorsements!.length === 0 ? '' : endorsements!.length}</p>
          {/* TODO: Show all the user who have given endorsements */}
        </div>
      </div>

      {/* If the user is signed and looking at his own profile then he can perfom action on his profile */}
      {isCurrentUser && isEditable && (
        <div className="flex gap-2">
          <Button variant={'ghost'} size={'icon'} onClick={handleDeleteItem} disabled={isLoading}>
            {isLoading ? '...' : <MdDelete />}
          </Button>
        </div>
      )}
    </div>
  );
};
