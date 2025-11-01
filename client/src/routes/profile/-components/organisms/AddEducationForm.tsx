import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../-hooks/useProfile';
import { DatePickerField } from '@/components/molecules/DatePickerField';

export const AddEducationForm = () => {
  const { mutateAsync, isPending } = useProfileArrayUpdate();

  const form = useForm<TAddProfileArrayField>({
    resolver: zodResolver(addProfileArrayFieldSchema),
    defaultValues: {
      fieldName: 'educations',
      fieldData: {
        school: '',
        degree: '',
        fieldOfStudy: '',
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
          <FormField form={form} placeholder="School" id="school" name="fieldData.school" />
          <FormField form={form} placeholder="Degree" id="degree" name="fieldData.degree" />
          <FormField
            form={form}
            placeholder="Field of study"
            id="fieldOfStudy"
            name="fieldData.fieldOfStudy"
          />

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
