import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../-hooks/useProfile';
import { DatePickerField } from '@/components/molecules/DatePickerField';

export const AddCertificationForm = () => {
  const { mutateAsync, isPending } = useProfileArrayUpdate();

  const form = useForm<TAddProfileArrayField>({
    resolver: zodResolver(addProfileArrayFieldSchema),
    defaultValues: {
      fieldName: 'certifications',
      fieldData: {
        title: '',
        issuer: '',
        issuedDate: new Date(),
        credentials: '',
        credentialsUrl: '',
      },
    },
  });

  const onSubmit = async (data: TAddProfileArrayField) => {
    await mutateAsync(data);
    form.reset();
  };

  return (
    <DynamicDialogWithHeaderAction
      title="Add Certification"
      description="Showcase your verified professional achievements"
      mode={'create'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              form={form}
              labelText="Issuing Organization"
              placeholder="e.g. Google, AWS, Coursera"
              id="issuer"
              name="fieldData.issuer"
            />
            <FormField
              form={form}
              labelText="Certification Name"
              placeholder="e.g. Professional Cloud Architect"
              id="title"
              name="fieldData.title"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                form={form}
                labelText="Credential ID"
                placeholder="Certificate serial number"
                id="credentials"
                name="fieldData.credentials"
              />
              <DatePickerField
                form={form}
                id="date"
                name="fieldData.issuedDate"
                placeholder="Date of issue"
                labelText="Issue Date"
              />
            </div>
            <FormField
              form={form}
              labelText="Credential URL"
              placeholder="Link to verify certificate"
              id="credentialsUrl"
              name="fieldData.credentialsUrl"
            />
          </div>

          <div className="pt-4">
            <SubmitButton
              isLoading={isPending}
              className="h-11 w-full rounded-xl font-bold tracking-tight uppercase"
            >
              Add Certification
            </SubmitButton>
          </div>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
