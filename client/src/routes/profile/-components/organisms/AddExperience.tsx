import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../-hooks/useProfile';
import { DatePickerField } from '@/components/molecules/DatePickerField';

export const AddExperienceForm = () => {
  const { mutateAsync, isPending } = useProfileArrayUpdate();

  const form = useForm<TAddProfileArrayField>({
    resolver: zodResolver(addProfileArrayFieldSchema),
    defaultValues: {
      fieldName: 'experiences',
      fieldData: {
        companyOrProject: '',
        description: '',
        location: '',
        role: '',
        technologies: [],
        type: 'Project',
        started: new Date(),
        ended: new Date(),
      },
    },
  });

  const onSubmit = async (data: TAddProfileArrayField) => {
    await mutateAsync(data);
    form.reset();
  };

  return (
    <DynamicDialogWithHeaderAction title="Add Education" description="Add your education">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            form={form}
            placeholder="Company or Project"
            id="componyOrProject"
            name="fieldData.companyOrProject"
          />

          <FormField
            form={form}
            placeholder="Description"
            id="description"
            name="fieldData.description"
          />

          <FormField form={form} placeholder="Role" id="role" name="fieldData.role" />

          <FormField form={form} placeholder="Location" id="location" name="fieldData.location" />

          {/* TODO: Add Type and Technologies */}

          <DatePickerField
            form={form}
            id="started"
            name="fieldData.started"
            placeholder="Pick start date"
          />

          <DatePickerField
            form={form}
            id="ended"
            name="fieldData.ended"
            placeholder="Pick end date"
          />

          <SubmitButton isLoading={isPending}>Save</SubmitButton>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
