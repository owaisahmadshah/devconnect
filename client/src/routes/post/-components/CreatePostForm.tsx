import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from '@tanstack/react-router';
import { ImagePlus } from 'lucide-react';
import { FiX } from 'react-icons/fi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { createPostFrontendSchema, type TCreatePostFrontend } from 'shared';
import { Form } from '@/components/ui/form';
import { ImageUploadSection } from '@/components/organisms/ImageUploadSection';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { getErrorDetails } from '@/lib/errorHanldling';
import { useCreatePost } from '../-hooks/useCreatePost';
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
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="What's on your mind? Share your thoughts here..."
                        className="min-h-[150px]"
                      />
                    )}
                  />
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
