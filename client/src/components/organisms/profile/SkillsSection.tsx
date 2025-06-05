import {
  type TSkillWithId,
  type TAddProfileArrayField,
  type TDeleteProfileArrayItem,
} from 'shared';
import { SkillItem } from '../../molecules/SkillItem';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';
import { AddSkillForm } from './AddSkillForm';
import { EditSkillForm } from './EditSkillIForm';

interface SkillsSectionProps {
  onAddItem: (updateData: TAddProfileArrayField) => Promise<void>;
  onDeleteItem: (deleteData: TDeleteProfileArrayItem) => Promise<void>;
  isLoading?: boolean;
  skills: TSkillWithId[];
  isCurrentUser: boolean;
}

export const SkillsSection = ({
  onAddItem,
  onDeleteItem,
  skills,
  isCurrentUser,
  isLoading,
}: SkillsSectionProps) => {
  return (
    <ProfileSectionCard
      title="Skills"
      actionEditChildren={
        isCurrentUser && <EditSkillForm onArrayItemDelete={onDeleteItem} skills={skills} />
      }
      actionAddChild={isCurrentUser && <AddSkillForm onAddItem={onAddItem} isLoading={isLoading} />}
    >
      <div className="flex w-full flex-col gap-3">
        {skills.map((skill, index) => (
          <SkillItem
            key={index}
            skillName={skill.skillName}
            endorsements={skill.endorsements}
            skillProficiency={skill.skillProficiency}
            isCurrentUser={isCurrentUser}
            className="my-3 border-b p-3"
            isEditable={false}
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
