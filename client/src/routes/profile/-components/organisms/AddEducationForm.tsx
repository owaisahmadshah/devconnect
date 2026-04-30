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
    <DynamicDialogWithHeaderAction
      title="Add Education"
      description="Add your academic background and qualifications"
      mode={'create'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              form={form}
              labelText="School / University"
              placeholder="e.g. Stanford University"
              id="school"
              name="fieldData.school"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                form={form}
                labelText="Degree"
                placeholder="e.g. Bachelor of Science"
                id="degree"
                name="fieldData.degree"
              />
              <FormField
                form={form}
                labelText="Field of Study"
                placeholder="e.g. Computer Science"
                id="fieldOfStudy"
                name="fieldData.fieldOfStudy"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DatePickerField
                form={form}
                id="started"
                name="fieldData.started"
                labelText="Start Date"
                placeholder="Start Date"
              />
              <DatePickerField
                form={form}
                id="ended"
                name="fieldData.ended"
                labelText="End Date"
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="pt-4">
            <SubmitButton
              isLoading={isPending}
              className="h-11 w-full rounded-xl font-bold tracking-tight uppercase"
            >
              Save Education
            </SubmitButton>
          </div>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
