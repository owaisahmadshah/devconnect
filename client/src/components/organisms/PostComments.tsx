import { FaRegCommentDots } from 'react-icons/fa';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  createCommentSchema,
  type TCreateComment,
  type TCreateLike,
  type TPostResponse,
} from 'shared';
import { Post } from './Post';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '../atoms/SubmitButton';
// import FormField from '../molecules/FormField';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProfileWithUrl } from './ProfileWithUrl';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PostCommentsProps {
  post: TPostResponse;
  isEditable?: boolean;
  onDelete?: ({ _id }: { _id: string }) => void;
  onReaction: (data: TCreateLike & { profileUrl?: string }) => void;
  currentUserProfileUrl?: string;
}

export function PostComments({
  post,
  // isEditable,
  // onDelete,
  onReaction,
  // currentUserProfileUrl,
}: PostCommentsProps) {
  const form = useForm<TCreateComment>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: '',
      commentBy: '',
      postId: post._id,
    },
  });

  const onSubmit = async (data: TCreateComment) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger className="flex flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-slate-800">
        <FaRegCommentDots className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">Comment</span>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] min-w-[85vw] p-0 max-sm:min-h-[70vh]">
        <DialogHeader>
          <DialogDescription className="flex items-center gap-3">
            {/* Post Section */}
            <div className="w-[50%] max-sm:hidden">
              <Post post={post} showProfile={false} onReaction={onReaction} openImages={false} />
            </div>

            {/* Comment Section */}
            <div className="flex h-full flex-col justify-between p-3 max-sm:min-h-[70vh] max-sm:w-full sm:w-[50%]">
              <div className="h-full">
                {/* Profile */}
                <div className="flex flex-1 items-center gap-3 max-sm:hidden">
                  <ProfileWithUrl
                    user={post.createdBy}
                    profileSize="m"
                    reverse={true}
                    underlineOnHover={false}
                    postDate={post.createdAt}
                  />
                </div>

                {/* Comments */}
                <ScrollArea className="mt-2 h-[85%] max-h-[60vh] rounded-sm border p-3 max-sm:mt-6">
                  {/* Comments Goes here */}
                  No comments yet...
                </ScrollArea>
              </div>

              {/* Comment Input Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex justify-center gap-3 pb-3"
                >
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Add a comment..."
                              className="min-h-[40px] resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <SubmitButton
                    // isLoading={isPending}
                    // disabled={isPending}
                    customClasses="text-base font-semibold w-20"
                  >
                    {/* {isPending ? 'Commenting...' : 'Comment'} */}
                    Comment
                  </SubmitButton>
                </form>
              </Form>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
