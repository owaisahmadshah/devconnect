import { type TSkill } from 'shared';
import { Button } from '../../ui/button';
import { SkillItem } from '../../molecules/SkillItem';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';

interface SkillsSectionProps {
  onItemAction?: () => Promise<void>;
  onAddItem?: () => Promise<void>;
  skills: TSkill[];
  isCurrentUser: boolean;
}

export const SkillsSection = ({ onItemAction, skills, isCurrentUser }: SkillsSectionProps) => {
  return (
    <ProfileSectionCard title="Skills">
      {isCurrentUser && <Button variant={'outline'}>Add Skill</Button>}
      <div className="flex w-full flex-col gap-3">
        {skills.map((skill, index) => (
            <SkillItem
              key={index}
              onAction={onItemAction}
              skillName={skill.skillName}
              endorsements={skill.endorsements}
              skillProficiency={skill.skillProficiency}
              isCurrentUser={isCurrentUser}
            />
          ))}
      </div>
    </ProfileSectionCard>
  );
};
