import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { DatePickerField } from '@/components/molecules/DatePickerField';
import { RadioFormField } from '@/components/molecules/RadioFormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { ProjectCreatedDialog } from './organisms/ProjectCreatedDialog';
import { useCreateProject } from '../hooks/useProject';
import { getErrorDetails } from '@/lib/errorHanldling';
import { useCreateProjectForm } from '../hooks/useCreateProjectForm';
import { useArrayField } from '../hooks/useArrayField';
import { useImageUpload } from '../hooks/useImageUpload';
import { ArrayFieldInput } from './organisms/ArrayFieldInput';
import { CollaboratorSearch } from './organisms/CollaboratorSearch';
import { ImageUploadSection } from './organisms/ImageUploadSection';
import { buildProjectFormData } from '../utils/formDataBuilder';
import type { TUserProfileSummary, TCreateProject } from 'shared';

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
    <div className="fixed inset-0 h-full w-full overflow-hidden">
      <ScrollArea className="relative h-full w-full rounded-md border">
        <div className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, error => {
                console.log('Form validation failed:', error);
              })}
              className="mx-auto w-[60%] space-y-8 py-5 max-sm:w-[90%]"
            >
              <FormField form={form} placeholder="Title" id="title" name="title" />
              <TextAreaField
                form={form}
                placeholder="Description"
                id="description"
                name="description"
              />
              <FormField form={form} placeholder="Github url" id="githubUrl" name="githubUrl" />
              <FormField
                form={form}
                placeholder="Live demo url"
                id="liveDemoUrl"
                name="liveDemoUrl"
              />

              <ArrayFieldInput
                form={form}
                fieldName="tags"
                itemKey="tag"
                placeholder="Tags"
                emptyMessage="No tags have been added!"
                onAdd={tagField.handleAdd}
                onDelete={tagField.handleDelete}
              />

              <ArrayFieldInput
                form={form}
                fieldName="techStacks"
                itemKey="tech"
                placeholder="Tech stack"
                emptyMessage="No tech stacks have been added!"
                onAdd={techStackField.handleAdd}
                onDelete={techStackField.handleDelete}
              />

              <CollaboratorSearch
                form={form}
                collaborators={collaborators}
                onSelect={handleCollaboratorSelect}
                onDelete={handleCollaboratorDelete}
              />

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

              <DatePickerField
                form={form}
                id="creationDate"
                name="creationDate"
                disabledFuture={true}
                labelText="Project Creation Date"
                placeholder="Creation Date"
              />

              <RadioFormField
                form={form}
                name="visibility"
                label="Project Visibility"
                options={[
                  { label: 'Public', value: 'Public' },
                  { label: 'Private', value: 'Private' },
                  { label: 'Connections-only', value: 'connections-only' },
                ]}
              />

              <RadioFormField
                form={form}
                name="isFeatured"
                label="Feature Project"
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />

              <SubmitButton isLoading={isPending} disabled={false}>
                Create Project
              </SubmitButton>

              <div className="mx-auto w-1/2 text-sm font-semibold text-red-500">
                {isError && <p className="text-center">{getErrorDetails(error).message}</p>}
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>
    </div>
  );
};
