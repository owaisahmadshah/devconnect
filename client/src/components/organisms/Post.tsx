import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Button } from '@/components/ui/button';
import type { TPostResponse } from 'shared';
import { FaHeart, FaRegCommentDots, FaShare } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { ImagesCarousel } from '@/components/organisms/ImagesCarousel';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostProps {
  post: TPostResponse;
  isEditable?: boolean;
  onDelete?: ({ _id }: { _id: string }) => void;
}

const MAX_DESCRIPTION_LENGTH = 280;

export const Post = ({ post, isEditable = false, onDelete }: PostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const descriptionTooLong = post.description && post.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription =
    descriptionTooLong && !isExpanded
      ? post.description.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : post.description;

  // const displayDescription =
  //   descriptionTooLong && !isExpanded
  //     ? truncateHtml(post.description, MAX_DESCRIPTION_LENGTH)
  //     : post.description;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  // function truncateHtml(html: string, maxLength: number) {
  //   const div = document.createElement('div');
  //   div.innerHTML = html;
  //   const text = div.textContent || div.innerText || '';
  //   return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  // }

  return (
    <Card className="mx-auto w-full rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Header */}
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
          <div className="mx-5 border-t border-slate-200 dark:border-slate-800" />
        </CardContent>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-0 py-0">
          <ImagesCarousel images={post.media} />
        </div>
      )}

      {/* Stats Bar */}
      {likesCount > 0 && (
        <div className="px-5 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">{likesCount}</span> {likesCount === 1 ? 'like' : 'likes'}
        </div>
      )}

      {/* Divider */}
      <div className="mx-5 border-t border-slate-200 dark:border-slate-800" />

      {/* Actions */}
      <CardFooter className="px-3 py-0">
        <div className="flex w-full justify-between gap-1">
          {/* Like */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isLiked
                ? 'text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <FaHeart
              className={`h-[18px] w-[18px] transition-transform duration-200 ${isLiked ? 'scale-110' : ''}`}
            />
            <span className="hidden sm:inline">Like</span>
          </Button>

          {/* Comment */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FaRegCommentDots className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Comment</span>
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-green-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FaShare className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
