import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Link2, X, ImagePlus } from 'lucide-react';
import { FiX } from 'react-icons/fi';

import { createPostFrontendSchema, type TCreatePostFrontend } from 'shared';
import { Form } from '@/components/ui/form';
import { TextAreaField } from '@/components/molecules/TextAreaField';
import { ImageUploadSection } from '@/components/organisms/ImageUploadSection';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { getErrorDetails } from '@/lib/errorHanldling';
import { useCreatePost } from '../-hooks/useCreatePost';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DismissibleBadge } from '@/components/molecules/DismissibleBadge';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const CreatePostForm = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

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

    if (!link) return;

    const addedLinks = form.getValues('links');

    if (addedLinks.includes(link)) {
      setInputValue('');
      return;
    }

    form.setValue('links', [link, ...addedLinks]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const onDelete = (link: string) => {
    const filteredLinks = form.getValues('links').filter(lnk => lnk !== link);
    form.setValue('links', filteredLinks);
  };

  if (isSuccess) {
    navigate({ to: '/' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-3xl">
        <Card className="border-slate-200 shadow-lg dark:border-slate-800">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Create New Post</CardTitle>
            <CardDescription className="text-base">
              Share your thoughts, links, and images with the community
            </CardDescription>
            <CardAction>
              <Link to="/" className="sticky text-gray-500 transition-colors hover:text-gray-800">
                <FiX size={22} />
              </Link>
            </CardAction>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, error => {
                  console.log('Form validation failed:', error);
                })}
                className="space-y-8"
              >
                {/* Description Section */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description
                  </Label>
                  <TextAreaField
                    form={form}
                    placeholder="What's on your mind? Share your thoughts here..."
                    id="description"
                    name="description"
                  />
                </div>

                {/* Links Section */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <Link2 className="h-4 w-4" />
                    Links
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Paste a link and press Enter or click Add"
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                        className="pr-8"
                      />
                      {inputValue && (
                        <button
                          type="button"
                          onClick={() => setInputValue('')}
                          className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={handleAdd}
                      disabled={!inputValue.trim()}
                      className="px-6"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Links Display */}
                  <div className="min-h-[60px] rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                    {watchedLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {watchedLinks.map((link: string) => (
                          <DismissibleBadge
                            key={link}
                            text={link}
                            onRemove={() => onDelete(link)}
                            customClasses="rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="py-2 text-center text-sm text-slate-400 dark:text-slate-500">
                        No links added yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <ImagePlus className="h-4 w-4" />
                    Images
                  </Label>
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

                {/* Error Message */}
                {isError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
                      {getErrorDetails(error).message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <SubmitButton
                    isLoading={isPending}
                    disabled={isPending}
                    customClasses="w-full h-11 text-base font-semibold"
                  >
                    {isPending ? 'Creating Post...' : 'Create Post'}
                  </SubmitButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
