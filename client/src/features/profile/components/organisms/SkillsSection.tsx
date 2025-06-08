import { type TSkillWithId } from 'shared';
import { EditSkillForm } from './EditSkillsForm';
import { SkillItem } from '../molecules/SkillItem';
import { AddSkillForm } from './AddSkillForm';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';

interface SkillsSectionProps {
  skills: TSkillWithId[];
  isCurrentUser: boolean;
}

export const SkillsSection = ({ skills, isCurrentUser }: SkillsSectionProps) => {
  return (
    <ProfileSectionCard
      title="Skills"
      actionEditChildren={isCurrentUser && <EditSkillForm skills={skills} />}
      actionAddChild={isCurrentUser && <AddSkillForm />}
    >
      <div className="flex w-full flex-col gap-3">
        {skills.map(skill => (
          <SkillItem
            key={skill._id}
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
