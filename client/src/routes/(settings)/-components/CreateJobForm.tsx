import { zodResolver } from '@hookform/resolvers/zod';
import 'react-quill-new/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill-new';

import { SubmitButton } from '@/components/atoms/SubmitButton';
import FormField from '@/components/molecules/FormField';
import { RadioFormField } from '@/components/molecules/RadioFormField';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { createJobSchema, type TCreateJob } from 'shared';
import { Button } from '@/components/ui/button';
import { useCreateJob } from '@/routes/(settings)/-hooks/useCreateJob';
import { useState } from 'react';

export const CreateJobForm = () => {
  const [orgError, setOrgError] = useState<string | null>(null);

  const { organizationId } = useSearch({ from: '/(settings)/job/new' });

  const { mutateAsync, isPending, isError, error } = useCreateJob();

  const navigate = useNavigate();

  const form = useForm<TCreateJob>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      type: 'full-time',
      status: 'open',
      organizationId: '',
      postedBy: '',
    },
  });

  const handleSubmit = async (data: TCreateJob) => {
    setOrgError(null);
    if (organizationId) {
      data.organizationId = organizationId;
      await mutateAsync(data);
      form.reset();
    } else {
      setOrgError(
        'Organization ID is missing. Please select an organization before posting a job.',
      );
    }
  };

  if (!organizationId) {
    navigate({ to: '/organization/select?from=create-job' });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Post a new job</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Reach the right candidates by providing detailed information about the role.
        </p>
      </div>

      <div className="bg-card border-border rounded-xl border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="divide-border divide-y">
            {orgError && <div className="text-destructive p-4 text-sm">{orgError}</div>}
            {isError && <div className="text-destructive p-4 text-sm">{error?.message}</div>}
            <div className="space-y-6 p-6 md:p-8">
              <FormField
                form={form}
                id="title"
                name="title"
                labelText="Job Title"
                placeholder="e.g. Senior Software Engineer"
                type="text"
              />

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description
                </Label>
                <div className="prose-sm border-input focus-within:ring-ring overflow-hidden rounded-md border transition-all focus-within:ring-1">
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Describe the responsibilities, requirements, and benefits..."
                        className="border-none"
                      />
                    )}
                  />
                </div>
                {form.formState.errors.description && (
                  <p className="text-destructive text-[0.8rem] font-medium">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <FormField
                form={form}
                id="location"
                name="location"
                labelText="Location"
                placeholder="e.g. Remote, New York, or London"
                type="text"
              />
            </div>

            <div className="bg-muted/30 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <RadioFormField
                  form={form}
                  name="type"
                  label="Employment Type"
                  options={[
                    { label: 'Full-time', value: 'full-time' },
                    { label: 'Part-time', value: 'part-time' },
                    { label: 'Contract', value: 'contract' },
                    { label: 'internship', value: 'internship' },
                  ]}
                />
                <RadioFormField
                  form={form}
                  name="status"
                  label="Initial Listing Status"
                  options={[
                    { label: 'Open', value: 'open' },
                    { label: 'Closed', value: 'closed' },
                  ]}
                />
              </div>
            </div>

            <div className="bg-card flex items-center justify-center gap-3 rounded-b-xl p-6">
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => form.reset()}
                className="w-[40%]"
              >
                Clear all
              </Button>
              <SubmitButton loadingText="Posting..." customClasses="w-[40%]" isLoading={isPending}>
                Post Job
              </SubmitButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
