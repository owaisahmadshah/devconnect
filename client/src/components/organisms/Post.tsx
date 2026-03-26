import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Button } from '@/components/ui/button';
import type { TCreateLike, TPostResponse } from 'shared';
import { HiDotsHorizontal } from 'react-icons/hi';
import { ImagesCarousel } from '@/components/organisms/ImagesCarousel';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReactionButton } from './ReactionButton';
import { PostComments } from './PostComments';
import { cn } from '@/lib/utils';
import ShareDialog from './ShareDialog';

interface PostProps {
  post: TPostResponse;
  isEditable?: boolean;
  onDelete?: ({ _id }: { _id: string }) => void;
  onReaction: (data: TCreateLike & { profileUrl?: string }) => void;
  currentUserProfileUrl?: string;
  showProfile?: boolean;
  openImages?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 280;

export const Post = ({
  post,
  isEditable = false,
  onDelete,
  onReaction,
  currentUserProfileUrl,
  showProfile = true,
  openImages = true,
}: PostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const descriptionTooLong = post.description && post.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription =
    descriptionTooLong && !isExpanded
      ? post.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : post.description;

  // const displayDescription =
  //   descriptionTooLong && !isExpanded
  //     ? truncateHtml(post.description, MAX_DESCRIPTION_LENGTH)
  //     : post.description;

  // function truncateHtml(html: string, maxLength: number) {
  //   const div = document.createElement('div');
  //   div.innerHTML = html;
  //   const text = div.textContent || div.innerText || '';
  //   return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  // }

  return (
    <Card
      className={cn(
        'mx-auto w-full rounded-xl border-none shadow-sm transition-all duration-300 hover:shadow-lg',
        showProfile === false && 'rounded-sm shadow-none',
      )}
    >
      {/* Header */}
      {showProfile && (
        <CardHeader className="flex flex-row items-center justify-between px-5">
          <div className="flex flex-1 items-center gap-3">
            <ProfileWithUrl
              user={post.createdBy}
              profileSize="m"
              reverse={true}
              underlineOnHover={false}
              postDate={post.createdAt}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <HiDotsHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isEditable && (
                <DropdownMenuItem
                  onClick={() => onDelete?.({ _id: post._id })}
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950/30 dark:focus:text-red-400"
                >
                  Delete Post
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer">Report Post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      )}

      {/* Description */}
      {post.description && (
        <CardContent className="px-5 py-0">
          <div
            className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: displayDescription }}
          />
          {descriptionTooLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          {/* Divider */}
          {showProfile && <div className="mx-5 border-t border-slate-200 dark:border-slate-800" />}
        </CardContent>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-0 py-0">
          <ImagesCarousel images={post.media} openImages={openImages} />
        </div>
      )}

      {/* Stats Bar */}
      {post?.totalLikes && post.totalLikes > 0 ? (
        <div className="px-5 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">{post.totalLikes}</span>{' '}
          {post.totalLikes === 1 ? 'reaction' : 'reactions'}
        </div>
      ) : (
        ''
      )}

      {/* Divider */}
      {showProfile && <div className="mx-5 border-t border-slate-200 dark:border-slate-800" />}

      {/* Actions */}
      <CardFooter className="px-3 py-0">
        <div className="flex w-full justify-between gap-1">
          {/* Like */}
          <ReactionButton
            postOwnerId={post.createdBy._id}
            postId={post._id}
            onAction={onReaction}
            likeType={post.likeType}
            currentUserProfileUrl={currentUserProfileUrl}
          />

          {/* Comment */}
          <PostComments
            post={post}
            onReaction={onReaction}
            currentUserProfileUrl={currentUserProfileUrl}
            onDelete={onDelete}
          />
          {/* Share */}
          <ShareDialog postId={post._id} baseUrl="http://localhost:5173" />
        </div>
      </CardFooter>
    </Card>
  );
};
