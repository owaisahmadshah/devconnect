import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React, { useCallback, useState } from 'react';

import { createProjectSchema, type TCreateProject } from 'shared';
import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';

import { RadioFormField } from '@/components/molecules/RadioFormField';
import { DatePickerField } from '@/components/molecules/DatePickerField';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DismissibleBadge } from '@/components/molecules/DismissibleBadge';
import { useDropzone } from 'react-dropzone';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export const CreateProjectForm = () => {
  const [tag, setTag] = useState('');
  const [techStack, setTechStack] = useState('');
  const [preview, setPreview] = useState<string[] | null>(null);

  const form = useForm<TCreateProject>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      githubUrl: '',
      liveDemoUrl: '',
      createdBy: '',
      isFeatured: true,
      creationDate: new Date(),
      visibility: 'Public',
      collaborators: [],
      tags: [],
      media: [],
      techStacks: [],
    },
  });

  const watchedTags = form.watch('tags');
  const watchedTechStacks = form.watch('techStacks');

  const onSubmit = async (data: TCreateProject) => {
    console.log(data);
  };

  const handleAddTag = () => {
    if (tag) {
      const currentTags = form.getValues('tags');
      if (!currentTags.some(t => t.tag === tag)) {
        form.setValue('tags', [...currentTags, { tag }]);
      }
      setTag('');
    }
  };

  const handleAddTechStack = () => {
    if (techStack) {
      const currentTechStacks = form.getValues('techStacks');
      if (!currentTechStacks.some(t => t.tech === techStack)) {
        form.setValue('techStacks', [...currentTechStacks, { tech: techStack }]);
      }
      setTechStack('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    const filteredTags = form.getValues('tags').filter(t => t.tag !== tag);
    form.setValue('tags', filteredTags);
  };

  const handleDeleteTechStack = (tech: string) => {
    const filteredTechStacks = form.getValues('techStacks').filter(t => t.tech !== tech);
    form.setValue('techStacks', filteredTechStacks);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles;
    if (file.length) {
      const img = [];
      for (let i = 0; i < file.length; i++) {
        img.push(URL.createObjectURL(file[i]));
      }
      setPreview(img);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    multiple: true,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField form={form} placeholder="Title" id="title" name="title" />
        <TextAreaField form={form} placeholder="Description" id="description" name="description" />
        <FormField form={form} placeholder="Github url" id="githubUrl" name="githubUrl" />
        <FormField form={form} placeholder="Live demo url" id="liveDemoUrl" name="liveDemoUrl" />
        <div>
          <div className="flex gap-2">
            <Input placeholder="Tags" onChange={e => setTag(e.target.value?.trim())} value={tag} />
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="text-muted-foreground m-2 space-y-2 space-x-2 text-xs italic">
            {watchedTags.length > 0 ? (
              watchedTags.map(tag => (
                <DismissibleBadge
                  key={tag.tag}
                  text={tag.tag}
                  onRemove={() => handleDeleteTag(tag.tag)}
                  customClasses="rounded"
                />
              ))
            ) : (
              <p className="">No tags have been added!</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex gap-2">
            <Input
              placeholder="Tech Stack"
              onChange={e => setTechStack(e.target.value?.trim())}
              value={techStack}
            />
            <Button type="button" onClick={handleAddTechStack}>
              Add
            </Button>
          </div>
          <div className="text-muted-foreground m-2 space-y-2 space-x-2 text-xs italic">
            {watchedTechStacks.length > 0 ? (
              watchedTechStacks.map(tech => (
                <DismissibleBadge
                  key={tech.tech}
                  text={tech.tech}
                  onRemove={() => handleDeleteTechStack(tech.tech)}
                  customClasses="rounded"
                />
              ))
            ) : (
              <p className="">No tags have been added!</p>
            )}
          </div>
        </div>
        <div className="mx-auto max-h-2/3 max-w-2/3">
          {preview && preview.length > 0 && (
            <Carousel>
              <CarouselContent>
                {preview.map(image => (
                  <CarouselItem>
                    <img src={image} alt={image} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious type="button" />
              <CarouselNext type="button" />
            </Carousel>
          )}
          <div
            {...getRootProps()}
            className={`mx-auto flex h-40 w-64 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-gray-400 transition ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Click or drag image here to upload</p>
            )}
          </div>
        </div>
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
        <SubmitButton isLoading={false} disabled={false}>
          Create Project
        </SubmitButton>
      </form>
    </Form>
  );
};
