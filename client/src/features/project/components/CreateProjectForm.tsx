import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCallback, useState, type ChangeEvent } from 'react';

import { createProjectSchema, type TCreateProject, type TUserProfileSummary } from 'shared';
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

import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import 'yet-another-react-lightbox/styles.css';
import { MdDelete } from 'react-icons/md';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInfiniteUserSearchByFullName } from '@/hooks/useProfile';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const CreateProjectForm = () => {
  const [tag, setTag] = useState('');
  const [techStack, setTechStack] = useState('');
  const [preview, setPreview] = useState<string[] | null>(null);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullName, setFullName] = useState('');
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<TUserProfileSummary[]>([]);

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

  // const { data, fetchNextPage, hasNextPage, isFetchNextPageError } =
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteUserSearchByFullName(fullName);

  // Filtered profiles, if a user is already selected it won't be shown
  const allProfiles =
    data?.pages
      ?.flatMap(page => page.profiles)
      ?.filter(profile => !collaborators.some(colUser => colUser._id === profile._id)) || [];

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
    const files = acceptedFiles;

    if (files.length) {
      const currentMedia = form.getValues('media');

      const media = files.map(file => ({ image: file }));
      form.setValue('media', [...currentMedia, ...media]);

      const img: string[] = [];
      for (let i = 0; i < files.length; i++) {
        img.push(URL.createObjectURL(files[i]));
      }

      setPreview(prev => (prev ? [...prev, ...img] : [...img]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    multiple: true,
  });

  const handleDelete = () => {
    setPreview(prev => (prev ? prev.filter((_, i) => i !== currentIndex) : prev));

    const media = form.getValues('media').filter((_, idx) => idx !== currentIndex);
    form.setValue('media', media);

    setOpen(preview && preview?.length - 1 > currentIndex ? true : currentIndex > 0 ? true : false);
  };

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
  };

  const handleCollaboratorUserSelect = (user: TUserProfileSummary) => {
    const currentCollaborators = form.getValues('collaborators');

    const userExists = currentCollaborators.some(colUserId => colUserId.user === user._id);

    if (!userExists) {
      form.setValue('collaborators', [...currentCollaborators, { user: user._id }]);
      setCollaborators(prevValues => [...prevValues, user]);
      setIsPopOverOpen(false);
    }
  };

  const handleCollaboratorUserDelete = (user: TUserProfileSummary) => {
    const currentCollaborators = form
      .getValues('collaborators')
      .filter(colUser => colUser.user !== user._id);

    form.setValue('collaborators', currentCollaborators);

    setCollaborators(prevValues => prevValues.filter(prevValue => prevValue._id !== user._id));
  };

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden">
      <ScrollArea className="relative h-full w-full rounded-md border">
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-[60%] space-y-8 py-5">
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
              <div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tags"
                    onChange={e => setTag(e.target.value?.trim())}
                    value={tag}
                  />
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
                    <p className="">No tech stacks have been added!</p>
                  )}
                </div>
              </div>

              {/* Adding collaborators */}
              <div>
                <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative flex gap-2">
                      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        placeholder="Search collaborators..."
                        onChange={handleFullNameChange}
                        value={fullName}
                        className="pl-10"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 overflow-y-auto p-0" align="start" side="bottom">
                    <ScrollArea
                      className={cn(
                        'h-80 min-h-2.5 rounded-md',
                        allProfiles.length === 0 && 'h-10',
                      )}
                    >
                      {isLoading ? (
                        <div className="max-h-72 p-4 text-center text-sm text-gray-500">
                          Searching...
                        </div>
                      ) : allProfiles.length > 0 ? (
                        <div className="py-2">
                          {allProfiles.map(user => (
                            <div
                              key={user._id}
                              onClick={() => handleCollaboratorUserSelect(user)}
                              className="bg-card hover:bg-muted flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profilePictureUrl} />
                                <AvatarFallback>
                                  {user.firstName?.[0]}
                                  {user.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                              </div>
                            </div>
                          ))}

                          {hasNextPage && (
                            <div className="border-t px-4 py-2">
                              <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="w-full text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                              >
                                {isFetchingNextPage ? 'Loading more...' : 'Load more users'}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : fullName ? (
                        <div className="p-4 text-center text-sm text-gray-500">No users found</div>
                      ) : null}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                {/* Display selected collaborators */}
                {collaborators.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium">Selected Collaborators:</p>
                    <div className="flex flex-wrap gap-2">
                      {collaborators.map(user => (
                        <DismissibleBadge
                          key={user._id}
                          avatar={user.profilePictureUrl}
                          avatarFallBack={`${user.firstName?.[0]} ${user.lastName?.[0]}`}
                          avatarClasses='h-5 w-5'
                          text={`${user.firstName} ${user.lastName}`}
                          onRemove={() => handleCollaboratorUserDelete(user)}
                          customClasses="rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload Section - Fixed Layout */}
              <div className="w-full">
                <div className="mx-auto w-[80%] space-y-4">
                  {/* Image Preview Grid */}
                  {preview && preview.length > 0 && (
                    <div className="rounded-sm border p-4">
                      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                        {preview.slice(0, 4).map((src, i) => (
                          <div key={i} className="relative overflow-hidden rounded-lg">
                            <img
                              src={src}
                              onClick={() => {
                                setCurrentIndex(i);
                                setOpen(true);
                              }}
                              className="h-40 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                              alt={`Preview ${i + 1}`}
                            />
                            {i === 3 && preview.length > 4 && (
                              <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-white">
                                <span className="text-lg font-semibold">
                                  +{preview.length - 4} more
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropzone */}
                  <div
                    {...getRootProps()}
                    className={`mx-auto flex h-40 w-full max-w-md cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-gray-400 transition ${
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
        </div>
      </ScrollArea>

      {/* Lightbox - Positioned as portal to prevent scroll interference */}
      {open && (
        <div className="fixed inset-0 z-50">
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={currentIndex}
            plugins={[Zoom, Fullscreen]}
            slides={preview?.map(src => ({ src })) || []}
            on={{
              view: ({ index }) => setCurrentIndex(index),
            }}
            toolbar={{
              buttons: [
                <button
                  key="delete"
                  onClick={handleDelete}
                  type="button"
                  className="hover:text-muted-foreground cursor-pointer rounded px-3 py-1 text-2xl"
                >
                  <MdDelete />
                </button>,
                <button
                  key="close"
                  onClick={() => setOpen(false)}
                  type="button"
                  className="hover:text-muted-foreground cursor-pointer rounded px-3 py-1 text-2xl"
                >
                  ✖
                </button>,
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};
