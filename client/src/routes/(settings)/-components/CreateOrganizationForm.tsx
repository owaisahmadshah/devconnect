import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { createOrganizationSchema, type TCreateOrganization } from 'shared';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { useCreateOrganization } from '../-hooks/useCreateOrganization';
import { getErrorDetails } from '@/lib/errorHanldling';
import { Form } from '@/components/ui/form';

export const CreateOrganizationForm = () => {
  const { from } = useSearch({ from: '/organization/new' });

  const form = useForm<TCreateOrganization>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      description: '',
      websiteURL: '',
      logo: '',
      createdBy: '',
    },
  });

  const { mutateAsync, isPending, isError, error, isSuccess } = useCreateOrganization();

  const navigate = useNavigate();

  const onSubmit = async (data: TCreateOrganization) => {
    // const formData = new FormData();
    // formData.append('name', data.name);
    // formData.append('description', data.description);
    // formData.append('websiteURL', data.websiteURL);
    // formData.append('logo', '');
    await mutateAsync(data);
  };

  if (isSuccess) {
    if (from && from === 'create-job') {
      navigate({ to: '/organization/select' });
    } else {
      navigate({ to: '/organizations' });
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold">Create Organization</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Set up your organization's professional profile to start connecting.
        </p>
      </div>

      <div className="rounded-xl p-6 shadow-sm md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              form={form}
              id="name"
              name="name"
              labelText="Company Name"
              placeholder="e.g. Acme Corp"
              type="text"
            />

            <div className="space-y-2">
              <label className="text-foreground text-sm font-semibold">
                Organization Description
              </label>
              <div className="prose-sm border-input focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-1">
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Tell us about your organization..."
                      className="border-none"
                    />
                  )}
                />
              </div>
              {form.formState.errors?.description && (
                <p className="text-destructive text-xs font-medium">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <FormField
              form={form}
              id="websiteURL"
              name="websiteURL"
              labelText="Website URL"
              placeholder="https://www.example.com"
              type="text"
            />

            {/* Error Message Alert */}
            {isError && (
              <div className="bg-destructive/10 border-destructive/20 rounded-md border p-3">
                <p className="text-destructive text-center text-sm">
                  {getErrorDetails(error).message}
                </p>
              </div>
            )}

            <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
              <SubmitButton
                isLoading={isPending}
                disabled={isPending}
                customClasses="w-full md:w-auto px-8 h-10 bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-full font-bold"
              >
                {isPending ? 'Saving...' : 'Create Organization'}
              </SubmitButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
