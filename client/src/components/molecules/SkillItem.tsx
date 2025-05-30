import { IoPeople } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

import type { TSkill } from 'shared';

interface SkillItemProps extends TSkill {
  onAction?: () => Promise<void>;
  isCurrentUser: boolean;
}

export const SkillItem = ({
  onAction,
  skillName,
  skillProficiency,
  endorsements,
  isCurrentUser = false,
}: SkillItemProps) => {
  return (
    <div className="flex w-full justify-between">
      <div className="grid gap-3">
        <div>
          <h1>{skillName}</h1>
          <p>{skillProficiency}</p>
        </div>

        <div className="flex justify-center gap-3">
          <IoPeople />
          <p>{endorsements.length}</p>
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