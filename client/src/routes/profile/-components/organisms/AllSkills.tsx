import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import type { TSkillWithId } from 'shared';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SkillItem } from '../molecules/SkillItem';

interface AllSkillsProps {
  skills: TSkillWithId[];
  noOfSkills: number;
}

export const AllSkills = ({ skills, noOfSkills }: AllSkillsProps) => {
  return (
    <DynamicDialogWithHeaderAction
      title="All Skills"
      description="All the skills of user"
      mode={`Show all ${noOfSkills} skills`}
    >
      <ScrollArea className="max-h-[60vh] w-full flex-col gap-3 pt-3">
        {skills.map((skill, index) => (
          <SkillItem
            key={index}
            skillName={skill.skillName}
            endorsements={skill.endorsements}
            skillProficiency={skill.skillProficiency}
            isCurrentUser={true}
            className="my-3 border-b p-3"
            isEditable={false}
          />
        ))}
      </ScrollArea>
    </DynamicDialogWithHeaderAction>
  );
};
