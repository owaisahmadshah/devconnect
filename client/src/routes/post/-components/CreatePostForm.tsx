import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createPostFrontendSchema, type TCreatePostFrontend } from 'shared';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form } from '@/components/ui/form';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { ImageUploadSection } from '@/components/organisms/ImageUploadSection';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { getErrorDetails } from '@/lib/errorHanldling';

import { useState } from 'react';
import { useCreatePost } from '../-hooks/useCreatePost';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DismissibleBadge } from '@/components/molecules/DismissibleBadge';
import { useImageUpload } from '@/hooks/useImageUpload';

export const CreatePostForm = () => {
  const [inputValue, setInputValue] = useState('');

  const form = useForm<TCreatePostFrontend>({
    resolver: zodResolver(createPostFrontendSchema),
    defaultValues: {
      description: '',
      links: [],
      media: [],
    },
  });

  const { mutateAsync, isPending, isSuccess, error, isError } = useCreatePost();

  const imageUpload = useImageUpload(form);

  const watchedLinks = form.watch('links');

  const onSubmit = async (data: TCreatePostFrontend) => {
    const formData = new FormData();
    formData.append('description', data.description ?? '');
    formData.append('createdBy', '');

    if (data.links.length) {
      data.links.forEach((link, i) => {
        formData.append(`links[${i}]`, link);
      });
    }

    if (data.media?.length) {
      data.media.forEach(mediaObj => {
        formData.append('media', mediaObj.image);
      });
    }

    await mutateAsync(formData);
  };

  const handleAdd = () => {
    const link = inputValue.trim().toLowerCase();

    if (!link) {
      return;
    }

    const addedLinks = form.getValues('links');

    for (let i = 0; i < addedLinks.length; i++) {
      if (addedLinks[i] === link) {
        setInputValue('');
        return;
      }
    }
    form.setValue('links', [link.toLowerCase(), ...addedLinks]);
    setInputValue('');
  };

  const onDelete = (link: string) => {
    const filteredLinks = form.getValues('links').filter(lnk => lnk != link);

    form.setValue('links', [...filteredLinks]);
  };

  if (isSuccess) {
    // TODO Handle success
    return <div>Created post.</div>;
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
              <TextAreaField
                form={form}
                placeholder="Description"
                id="description"
                name="description"
              />

              <div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Link..."
                    onChange={e => setInputValue(e.target.value)}
                    value={inputValue}
                  />
                  <Button type="button" onClick={handleAdd}>
                    Add
                  </Button>
                </div>
                <div className="text-muted-foreground m-2 space-y-2 space-x-2 text-xs italic">
                  {watchedLinks.length > 0 ? (
                    watchedLinks.map((link: string) => (
                      <DismissibleBadge
                        key={link}
                        text={link}
                        onRemove={() => onDelete(link)}
                        customClasses="rounded"
                      />
                    ))
                  ) : (
                    <p>Empty</p>
                  )}
                </div>
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

              <SubmitButton isLoading={isPending} disabled={false}>
                Create Post
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
