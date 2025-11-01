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
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../-hooks/useProfile';

export const AddSkillForm = () => {
  const { mutateAsync, isPending } = useProfileArrayUpdate();

  const form = useForm<TAddProfileArrayField>({
    resolver: zodResolver(addProfileArrayFieldSchema),
    defaultValues: {
      fieldName: 'skills',
      fieldData: {
        skillName: '',
        skillProficiency: 'Beginner',
        endorsements: [],
      },
    },
  });

  const onSubmit = async (data: TAddProfileArrayField) => {
    await mutateAsync(data);
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
          <SubmitButton isLoading={isPending}>Save</SubmitButton>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
