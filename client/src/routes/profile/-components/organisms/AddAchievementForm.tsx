import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../-hooks/useProfile';
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
    <DynamicDialogWithHeaderAction
      title="Add Achievement"
      description="Highlight your honors, awards, and professional milestones"
      mode={'create'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              form={form}
              labelText="Achievement Title"
              placeholder="e.g. Employee of the Year"
              id="title"
              name="fieldData.title"
            />

            <FormField
              form={form}
              labelText="Awarding Organization"
              placeholder="e.g. Global Tech Forum"
              id="awardedBy"
              name="fieldData.awardedBy"
            />

            <DatePickerField
              form={form}
              id="date"
              name="fieldData.date"
              labelText="Award Date"
              placeholder="Pick award date"
            />

            <FormField
              form={form}
              labelText="Description"
              placeholder="Provide more context about this honor..."
              id="description"
              name="fieldData.description"
            />
          </div>

          <div className="pt-4">
            <SubmitButton
              isLoading={isPending}
              className="h-11 w-full rounded-xl font-bold tracking-tight uppercase shadow-sm"
            >
              Save Achievement
            </SubmitButton>
          </div>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
