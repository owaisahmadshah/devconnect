import { cn } from '@/lib/utils';
import { IoPeople } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

import type { TSkill } from 'shared';

interface SkillItemProps extends TSkill {
  onAction?: () => Promise<void>;
  isCurrentUser: boolean;
  className: string;
}

export const SkillItem = ({
  onAction,
  skillName,
  skillProficiency,
  endorsements,
  isCurrentUser = false,
  className = '',
}: SkillItemProps) => {
  return (
    <div className={cn('flex items-baseline justify-between', className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="font-bold">{skillName}</h1>
          <p className="text-xs">({skillProficiency})</p>
        </div>

        <div className="flex justify-center gap-3">
          <p className="flex items-center gap-2 text-sm">
            <IoPeople />
            Endorsements
          </p>
          <p>{endorsements.length === 0 ? '' : endorsements.length}</p>
          {/* TODO: Show all the user who have given endorsements */}
        </div>
      </div>

      {/* If the user is signed and looking at his own profile then he can perfom action on his profile */}
      {isCurrentUser && (
        <div>
          <span onClick={onAction}>
            <MdEdit />
          </span>
        </div>
      )}
    </div>
  );
};
