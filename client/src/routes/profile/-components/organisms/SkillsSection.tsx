import { type TSkillWithId } from 'shared';
import { EditSkillForm } from './EditSkillsForm';
import { SkillItem } from '../molecules/SkillItem';
import { AddSkillForm } from './AddSkillForm';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AllSkills } from './AllSkills';

interface SkillsSectionProps {
  skills: TSkillWithId[];
  isCurrentUser: boolean;
}

export const SkillsSection = ({ skills, isCurrentUser }: SkillsSectionProps) => {
  const len = skills.length;
  const previewSkills = skills.slice(0, 3);

  return (
    <ProfileSectionCard
      title="Skills"
      actionEditChildren={isCurrentUser && <EditSkillForm skills={skills} />}
      actionAddChild={isCurrentUser && <AddSkillForm />}
    >
      <div className="flex flex-col">
        <div className="grid grid-cols-1 gap-1">
          {previewSkills.map(skill => (
            <SkillItem
              key={skill._id}
              _id={skill._id}
              skillName={skill.skillName}
              endorsements={skill.endorsements}
              skillProficiency={skill.skillProficiency}
              isCurrentUser={isCurrentUser}
              className="hover:bg-muted/30 rounded-lg px-1 py-3 transition-colors"
              isEditable={false}
            />
          ))}
        </div>

        {len > 3 && (
          <div className="border-border/40 mt-4 border-t pt-2">
            <AllSkills skills={skills} noOfSkills={len} />
          </div>
        )}
      </div>
    </ProfileSectionCard>
  );
};
