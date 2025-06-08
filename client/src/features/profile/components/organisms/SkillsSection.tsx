import { ProfileSectionCard } from '@/components/molecules/ProfileSectionCard';
import { type TSkillWithId } from 'shared';
import { EditSkillForm } from './EditSkillsForm';
import { SkillItem } from '../molecules/SkillItem';
import { AddSkillForm } from './AddSkillForm';

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
