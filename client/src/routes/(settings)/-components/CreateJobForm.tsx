import { zodResolver } from '@hookform/resolvers/zod';
import 'react-quill-new/dist/quill.snow.css';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import { useNavigate, useSearch, useRouter, useCanGoBack } from '@tanstack/react-router';

import { SubmitButton } from '@/components/atoms/SubmitButton';
import FormField from '@/components/molecules/FormField';
import { RadioFormField } from '@/components/molecules/RadioFormField';
import { Form } from '@/components/ui/form';

import { createJobSchema, type TCreateJob } from 'shared';
import { Button } from '@/components/ui/button';
import { useCreateJob } from '@/routes/(settings)/-hooks/useCreateJob';
import { useState } from 'react';
import { Briefcase, MapPin, AlignLeft, Settings2, ChevronLeft } from 'lucide-react';

export const CreateJobForm = () => {
  const [orgError, setOrgError] = useState<string | null>(null);

  const { organizationId } = useSearch({ from: '/(settings)/job/new' });

  const { mutateAsync, isPending, isError, error } = useCreateJob();

  const navigate = useNavigate();

  const router = useRouter();
  const canGoBack = useCanGoBack();

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
    <div className="relative mx-auto max-w-4xl px-4 py-12">
      {/* Back Button */}
      <div className="absolute top-10 left-4 md:left-0">
        <Button
          variant="ghost"
          size="sm"
          className="group text-muted-foreground hover:text-foreground flex items-center gap-1 p-0 transition-colors"
          onClick={() => router.history.back()}
          disabled={!canGoBack}
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black tracking-widest uppercase">Back to Hub</span>
        </Button>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-foreground text-3xl font-black tracking-[0.2em] uppercase">
          Create Opportunity
        </h1>
        <p className="text-muted-foreground mt-2 text-[11px] font-bold tracking-widest uppercase">
          Publish a new position to your organization network
        </p>
      </div>

      <div className="bg-card border-border/40 overflow-hidden rounded-3xl border shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col">
            {orgError && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 border-b px-8 py-4 text-xs font-bold tracking-widest uppercase">
                {orgError}
              </div>
            )}

            {isError && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 border-b px-8 py-4 text-xs font-bold tracking-widest uppercase">
                {error?.message}
              </div>
            )}

            <div className="space-y-10 p-8 md:p-12">
              {/* Role Header Section */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="mb-2 flex items-center gap-2">
                    <Briefcase className="text-primary size-4" />
                    <span className="text-muted-foreground text-[10px] font-black tracking-[0.15em] uppercase">
                      Position Title
                    </span>
                  </div>
                  <FormField
                    form={form}
                    id="title"
                    name="title"
                    placeholder="e.g. Lead Product Architect"
                    type="text"
                    className="bg-muted/20 border-border/40 focus:ring-primary/40 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="text-primary size-4" />
                    <span className="text-muted-foreground text-[10px] font-black tracking-[0.15em] uppercase">
                      Geography
                    </span>
                  </div>
                  <FormField
                    form={form}
                    id="location"
                    name="location"
                    placeholder="e.g. Remote / San Francisco, CA"
                    type="text"
                    className="bg-muted/20 border-border/40 focus:ring-primary/40 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlignLeft className="text-primary size-4" />
                  <span className="text-muted-foreground text-[10px] font-black tracking-[0.15em] uppercase">
                    Detailed Brief
                  </span>
                </div>
                <div className="prose-invert border-border/40 bg-muted/5 focus-within:border-primary/40 focus-within:ring-primary/40 overflow-hidden rounded-2xl border transition-all focus-within:ring-1">
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Define the scope of work, technical requirements, and core benefits..."
                        className="min-h-[200px] border-none"
                      />
                    )}
                  />
                </div>
                {form.formState.errors.description && (
                  <p className="text-destructive text-[10px] font-bold tracking-widest uppercase">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Config Section */}
            <div className="bg-muted/30 border-border/10 border-t p-8 md:p-12">
              <div className="mb-8 flex items-center gap-2">
                <Settings2 className="text-primary size-4" />
                <span className="text-muted-foreground text-[10px] font-black tracking-[0.15em] uppercase">
                  Classification
                </span>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <RadioFormField
                  form={form}
                  name="type"
                  label="Employment Structure"
                  options={[
                    { label: 'Full-time', value: 'full-time' },
                    { label: 'Part-time', value: 'part-time' },
                    { label: 'Contract', value: 'contract' },
                    { label: 'Internship', value: 'internship' },
                  ]}
                />
                <RadioFormField
                  form={form}
                  name="status"
                  label="Listing Visibility"
                  options={[
                    { label: 'Open', value: 'open' },
                    { label: 'Closed', value: 'closed' },
                  ]}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card border-border/10 flex flex-col items-center justify-end gap-4 border-t p-8 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
                className="h-12 w-full rounded-xl text-[11px] font-black tracking-widest uppercase sm:w-32"
              >
                Reset
              </Button>
              <SubmitButton
                loadingText="Synchronizing..."
                className="shadow-primary/20 h-12 w-full rounded-xl font-black tracking-widest uppercase shadow-lg sm:w-64"
                isLoading={isPending}
              >
                Publish Job
              </SubmitButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
