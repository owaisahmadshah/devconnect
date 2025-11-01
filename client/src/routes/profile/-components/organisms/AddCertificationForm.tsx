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
    <DynamicDialogWithHeaderAction title="Add Certificate" description="Add your certifications">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField form={form} placeholder="Issuer" id="issuer" name="fieldData.issuer" />
          <FormField form={form} placeholder="Title" id="title" name="fieldData.title" />
          <FormField
            form={form}
            placeholder="Credentials"
            id="credentials"
            name="fieldData.credentials"
          />
          <FormField
            form={form}
            placeholder="Credentials urls"
            id="credentialsUrl"
            name="fieldData.credentialsUrl"
          />

          <DatePickerField
            form={form}
            id="date"
            name="fieldData.issuedDate"
            placeholder="Pick issued date"
          />

          <SubmitButton isLoading={isPending}>Save</SubmitButton>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
