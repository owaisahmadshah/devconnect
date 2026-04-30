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
      description="Professional skillset and endorsements"
      mode={`Show all ${noOfSkills} skills`}
    >
      <ScrollArea className="h-[50vh] pr-4">
        <div className="divide-border/40 flex flex-col space-y-1 divide-y">
          {skills.map(skill => (
            <SkillItem
              key={skill._id}
              _id={skill._id}
              skillName={skill.skillName}
              endorsements={skill.endorsements}
              skillProficiency={skill.skillProficiency}
              isCurrentUser={false}
              className="py-4"
              isEditable={false}
            />
          ))}
        </div>
      </ScrollArea>
    </DynamicDialogWithHeaderAction>
  );
};
