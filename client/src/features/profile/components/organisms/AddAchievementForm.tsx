import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../hooks/useProfile';
import { DatePickerField } from '@/components/molecules/DatePickerField';

export const AddAchivementForm = () => {
  const { mutateAsync, isPending } = useProfileArrayUpdate();

  const form = useForm<TAddProfileArrayField>({
    resolver: zodResolver(addProfileArrayFieldSchema),
    defaultValues: {
      fieldName: 'achievements',
      fieldData: {
        title: '',
        description: '',
        awardedBy: '',
        date: new Date(),
      },
    },
  });

  const onSubmit = async (data: TAddProfileArrayField) => {
    await mutateAsync(data);
    form.reset();
  };

  return (
    <DynamicDialogWithHeaderAction title="Add Achivements" description="Add your achievements">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField form={form} placeholder="Title" id="title" name="fieldData.title" />
          <FormField
            form={form}
            placeholder="Description"
            id="description"
            name="fieldData.description"
          />
          <FormField
            form={form}
            placeholder="AwardedBy"
            id="awardedBy"
            name="fieldData.awardedBy"
          />

          <DatePickerField
            form={form}
            id="date"
            name="fieldData.date"
            placeholder="Pick award date"
            labelText="Award Date"
          />

          <SubmitButton isLoading={isPending}>Save</SubmitButton>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
