import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { SkillItem } from '@/components/molecules/SkillItem';
import type { TDeleteProfileArrayItem, TSkillWithId } from 'shared';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditSkillFormProps {
  skills: TSkillWithId[];
  onArrayItemDelete: (deleteData: TDeleteProfileArrayItem) => Promise<void>;
}

export const EditSkillForm = ({ skills, onArrayItemDelete }: EditSkillFormProps) => {
  return (
    <DynamicDialogWithHeaderAction
      title="Edit Skills"
      description="Edit or delete your skills"
      mode="edit"
    >
      <ScrollArea className="max-h-[60vh] w-full flex-col gap-3 pt-3">
        {skills.map((skill, index) => (
          <SkillItem
            _id={skill._id}
            onArrayItemDelete={onArrayItemDelete}
            key={index}
            skillName={skill.skillName}
            endorsements={skill.endorsements}
            skillProficiency={skill.skillProficiency}
            isCurrentUser={true}
            className="my-3 border-b p-3"
            isEditable={true}
          />
        ))}
      </ScrollArea>
    </DynamicDialogWithHeaderAction>
  );
};
