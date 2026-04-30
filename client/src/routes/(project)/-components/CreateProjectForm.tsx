import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { DatePickerField } from '@/components/molecules/DatePickerField';
import { RadioFormField } from '@/components/molecules/RadioFormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { ProjectCreatedDialog } from './organisms/ProjectCreatedDialog';
import { getErrorDetails } from '@/lib/errorHanldling';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ArrayFieldInput } from './organisms/ArrayFieldInput';
import { CollaboratorSearch } from './organisms/CollaboratorSearch';
import { ImageUploadSection } from '@/components/organisms/ImageUploadSection';
import type { TUserProfileSummary, TCreateProject } from 'shared';
import { useCreateProjectForm } from '../-hooks/useCreateProjectForm';
import { useCreateProject } from '../-hooks/useProject';
import { useArrayField } from '../-hooks/useArrayField';
import { buildProjectFormData } from '../-utils/formDataBuilder';
import { Rocket, Github, Globe, Layers, Users, ImageIcon } from 'lucide-react';

export const CreateProjectForm = () => {
  const [collaborators, setCollaborators] = useState<TUserProfileSummary[]>([]);

  const form = useCreateProjectForm();
  const { mutateAsync, isPending, isSuccess, error, isError } = useCreateProject();

  const tagField = useArrayField(form, 'tags', 'tag');
  const techStackField = useArrayField(form, 'techStacks', 'tech');
  const imageUpload = useImageUpload(form);

  const onSubmit = async (data: TCreateProject) => {
    const formData = buildProjectFormData(data);
    await mutateAsync(formData);
  };

  const handleCollaboratorSelect = (user: TUserProfileSummary) => {
    const currentCollaborators = form.getValues('collaborators');
    const userExists = currentCollaborators.some(colUser => colUser.user === user._id);

    if (!userExists) {
      form.setValue('collaborators', [...currentCollaborators, { user: user._id }]);
      setCollaborators(prev => [...prev, user]);
    }
  };

  const handleCollaboratorDelete = (user: TUserProfileSummary) => {
    const currentCollaborators = form
      .getValues('collaborators')
      .filter(colUser => colUser.user !== user._id);

    form.setValue('collaborators', currentCollaborators);
    setCollaborators(prev => prev.filter(prevUser => prevUser._id !== user._id));
  };

  if (isSuccess) {
    return <ProjectCreatedDialog />;
  }

  return (
    <div className="bg-background fixed inset-0 h-full w-full overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-foreground text-3xl font-black tracking-[0.2em] uppercase">
              Launch Project
            </h1>
            <p className="text-muted-foreground mt-2 text-[11px] font-bold tracking-widest uppercase">
              Showcase your technical expertise and collaborative efforts
            </p>
          </div>

          <div className="border-border/40 bg-card overflow-hidden rounded-[2rem] border shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="space-y-12 p-8 md:p-12">
                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Rocket className="text-primary size-4" />
                      <span className="text-muted-foreground text-[10px] font-black tracking-[0.15em] uppercase">
                        Core Details
                      </span>
                    </div>
                    <FormField
                      form={form}
                      labelText="Project Title"
                      placeholder="e.g. Decentralized Finance Protocol"
                      id="title"
                      name="title"
                    />
                    <TextAreaField
                      form={form}
                      labelText="Description"
                      placeholder="Deep dive into the problem solved, architecture used, and results achieved..."
                      id="description"
                      name="description"
                      className="min-h-[120px]"
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Github className="size-3.5" />
                          <span className="text-[10px] font-bold uppercase">Repository</span>
                        </div>
                        <FormField
                          form={form}
                          placeholder="https://github.com/..."
                          id="githubUrl"
                          name="githubUrl"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="size-3.5" />
                          <span className="text-[10px] font-bold uppercase">Live Environment</span>
                        </div>
                        <FormField
                          form={form}
                          placeholder="https://project-demo.com"
                          id="liveDemoUrl"
                          name="liveDemoUrl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Taxonomy Section */}
                  <div className="border-border/10 grid grid-cols-1 gap-10 border-t pt-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Layers className="text-primary size-4" />
                        <span className="text-[10px] font-black tracking-[0.15em] uppercase">
                          Categorization
                        </span>
                      </div>
                      <ArrayFieldInput
                        form={form}
                        fieldName="tags"
                        itemKey="tag"
                        placeholder="Add tag (e.g. Fintech)"
                        emptyMessage="No tags added"
                        onAdd={tagField.handleAdd}
                        onDelete={tagField.handleDelete}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Layers className="text-primary size-4" />
                        <span className="text-[10px] font-black tracking-[0.15em] uppercase">
                          Technology Stack
                        </span>
                      </div>
                      <ArrayFieldInput
                        form={form}
                        fieldName="techStacks"
                        itemKey="tech"
                        placeholder="Add tech (e.g. Next.js)"
                        emptyMessage="No tech stacks added"
                        onAdd={techStackField.handleAdd}
                        onDelete={techStackField.handleDelete}
                      />
                    </div>
                  </div>

                  {/* Collaboration & Media Section */}
                  <div className="border-border/10 space-y-8 border-t pt-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Users className="text-primary size-4" />
                        <span className="text-[10px] font-black tracking-[0.15em] uppercase">
                          Collaborators
                        </span>
                      </div>
                      <CollaboratorSearch
                        form={form}
                        collaborators={collaborators}
                        onSelect={handleCollaboratorSelect}
                        onDelete={handleCollaboratorDelete}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="text-primary size-4" />
                        <span className="text-[10px] font-black tracking-[0.15em] uppercase">
                          Visual Showcase
                        </span>
                      </div>
                      <ImageUploadSection
                        preview={imageUpload.preview}
                        onDrop={imageUpload.onDrop}
                        open={imageUpload.open}
                        currentIndex={imageUpload.currentIndex}
                        onDelete={imageUpload.handleDelete}
                        onOpenLightbox={imageUpload.openLightbox}
                        onCloseLightbox={() => imageUpload.setOpen(false)}
                        setCurrentIndex={imageUpload.setCurrentIndex}
                      />
                    </div>
                  </div>
                </div>

                {/* Visibility & Submission Section */}
                <div className="bg-muted/30 border-border/10 space-y-10 border-t p-8 md:p-12">
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <DatePickerField
                      form={form}
                      id="creationDate"
                      name="creationDate"
                      disabledFuture={true}
                      labelText="Project Launch Date"
                      placeholder="Select date"
                    />
                    <RadioFormField
                      form={form}
                      name="visibility"
                      label="Privacy Level"
                      options={[
                        { label: 'Public', value: 'Public' },
                        { label: 'Private', value: 'Private' },
                        { label: 'Connections', value: 'connections-only' },
                      ]}
                    />
                  </div>

                  <div className="border-border/10 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
                    <div className="flex-1">
                      <RadioFormField
                        form={form}
                        name="isFeatured"
                        label="Pin to Featured Section?"
                        options={[
                          { label: 'Yes', value: true },
                          { label: 'No', value: false },
                        ]}
                      />
                    </div>
                    <div className="flex w-full items-center gap-4 md:w-auto">
                      <SubmitButton
                        isLoading={isPending}
                        className="shadow-primary/20 h-12 w-full rounded-xl font-black tracking-widest uppercase shadow-lg md:w-64"
                      >
                        Create Project
                      </SubmitButton>
                    </div>
                  </div>

                  {isError && (
                    <div className="bg-destructive/10 border-destructive/20 rounded-xl border p-4">
                      <p className="text-destructive text-center text-xs font-bold tracking-widest uppercase">
                        {getErrorDetails(error).message}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
