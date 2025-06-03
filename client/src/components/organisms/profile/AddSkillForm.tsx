import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { Form } from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { userProfileUpdateArrayDataSchema, type TUserProfileUpdateArrayData } from 'shared';

interface SkillsSectionProps {
  onItemAction?: () => Promise<void>;
  onAddItem: (updateData: TUserProfileUpdateArrayData) => Promise<void>;
  isLoading?: boolean;
}

export const AddSkillForm = ({ onAddItem, isLoading }: SkillsSectionProps) => {
  const form = useForm<TUserProfileUpdateArrayData>({
    resolver: zodResolver(userProfileUpdateArrayDataSchema),
    defaultValues: {
      fieldName: 'skills',
      fieldData: {
        skillName: '',
        skillProficiency: 'Beginner',
        endorsements: [],
      },
    },
  });

  const onSubmit = async (data: TUserProfileUpdateArrayData) => {
    await onAddItem(data);
    form.reset();
  };

  return (
    <DynamicDialogWithHeaderAction title="Add Skill" description="Add your skill with proficiency">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            form={form}
            placeholder="Skill Name"
            id="skillName"
            name="fieldData.skillName"
          />
          <Select
            onValueChange={(value: 'Beginner' | 'Intermediate' | 'Advanced') =>
              form.setValue('fieldData.skillProficiency', value)
            }
            defaultValue="Beginner"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select proficiency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <SubmitButton isLoading={isLoading}>Save</SubmitButton>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
