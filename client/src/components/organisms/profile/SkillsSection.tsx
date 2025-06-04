import { type TSkillWithId, type TAddProfileArrayField } from 'shared';
import { SkillItem } from '../../molecules/SkillItem';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';
import { AddSkillForm } from './AddSkillForm';

interface SkillsSectionProps {
  onItemAction?: () => Promise<void>;
  onAddItem: (updateData: TAddProfileArrayField) => Promise<void>;
  isLoading?: boolean;
  skills: TSkillWithId[];
  isCurrentUser: boolean;
}

export const SkillsSection = ({
  onAddItem,
  skills,
  isCurrentUser,
  isLoading,
}: SkillsSectionProps) => {
  return (
    <ProfileSectionCard
      title="Skills"
      actionChildren={isCurrentUser && <AddSkillForm onAddItem={onAddItem} isLoading={isLoading} />}
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
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
