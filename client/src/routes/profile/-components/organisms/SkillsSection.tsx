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

  return (
    <ProfileSectionCard
      title="Skills"
      actionEditChildren={isCurrentUser && <EditSkillForm skills={skills} />}
      actionAddChild={isCurrentUser && <AddSkillForm />}
    >
      <div className="flex w-full flex-col gap-3">
        {len > 3 ? (
          <>
            <SkillItem
              key={skills[0]._id}
              skillName={skills[0].skillName}
              endorsements={skills[0].endorsements}
              skillProficiency={skills[0].skillProficiency}
              isCurrentUser={isCurrentUser}
              className="my-3 border-b p-3"
              isEditable={false}
            />
            <SkillItem
              key={skills[1]._id}
              skillName={skills[1].skillName}
              endorsements={skills[1].endorsements}
              skillProficiency={skills[1].skillProficiency}
              isCurrentUser={isCurrentUser}
              className="my-3 border-b p-3"
              isEditable={false}
            />
          </>
        ) : (
          skills.map(skill => (
            <SkillItem
              key={skill._id}
              skillName={skill.skillName}
              endorsements={skill.endorsements}
              skillProficiency={skill.skillProficiency}
              isCurrentUser={isCurrentUser}
              className="my-3 border-b p-3"
              isEditable={false}
            />
          ))
        )}
      </div>
      <div>
        {len > 3 && (
          <div>
            <AllSkills skills={skills} noOfSkills={len} />
          </div>
        )}
      </div>
    </ProfileSectionCard>
  );
};
