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
    <DynamicDialogWithHeaderAction
      title="Add Experience"
      description="Document your professional journey and key projects"
      mode={'create'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                form={form}
                labelText="Role / Title"
                placeholder="e.g. Senior Developer"
                id="role"
                name="fieldData.role"
              />
              <FormField
                form={form}
                labelText="Company / Project"
                placeholder="e.g. Acme Corp"
                id="companyOrProject"
                name="fieldData.companyOrProject"
              />
            </div>

            <FormField
              form={form}
              labelText="Location"
              placeholder="e.g. Remote, New York, US"
              id="location"
              name="fieldData.location"
            />

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

            <FormField
              form={form}
              labelText="Description"
              placeholder="Describe your responsibilities and achievements..."
              id="description"
              name="fieldData.description"
              // Ensure your FormField supports multiline or textarea for description
            />
          </div>

          <div className="pt-4">
            <SubmitButton
              isLoading={isPending}
              className="h-11 w-full rounded-xl font-bold tracking-tight uppercase"
            >
              Save Experience
            </SubmitButton>
          </div>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
