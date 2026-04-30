import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Button } from '@/components/ui/button';
import type { TCreateLike, TPostResponse } from 'shared';
import { MoreHorizontal } from 'lucide-react';
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
        'group border-border/40 bg-card hover:border-border/80 mx-auto w-full border shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
        !showProfile && 'rounded-none border-none bg-transparent shadow-none',
      )}
    >
      {showProfile && (
        <CardHeader className="flex flex-row items-center justify-between">
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
                className="text-muted-foreground hover:bg-secondary hover:text-foreground h-8 w-8 rounded-full transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border/50 w-48 rounded-xl">
              {isEditable && (
                <DropdownMenuItem
                  onClick={() => onDelete?.({ _id: post._id })}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  Delete Post
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer">Report Post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      )}

      {post.description && (
        <CardContent className={cn('px-4 pt-0 pb-3', !showProfile && 'pt-0')}>
          <div
            className="text-foreground/90 text-[15px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: displayDescription }}
          />
          {descriptionTooLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary mt-1 text-[13px] font-semibold transition-opacity hover:opacity-80"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </CardContent>
      )}

      {post.media && post.media.length > 0 && (
        <div className="border-border/30 bg-muted/10 overflow-hidden border-y">
          <ImagesCarousel images={post.media} openImages={openImages} />
        </div>
      )}

      <CardFooter className="flex flex-col p-2 pt-2">
        {post?.totalLikes && post.totalLikes > 0 ? (
          <div className="text-muted-foreground/80 mb-1.5 w-full px-2 text-[12px] font-medium">
            <span className="text-foreground/80">{post.totalLikes.toLocaleString()}</span>{' '}
            {post.totalLikes === 1 ? 'reaction' : 'reactions'}
          </div>
        ) : null}

        <div className="border-border/40 flex w-full items-center justify-between border-t pt-0.5">
          <div className="flex flex-1 justify-between">
            <ReactionButton
              postOwnerId={post.createdBy._id}
              postId={post._id}
              onAction={onReaction}
              likeType={post.likeType}
              currentUserProfileUrl={currentUserProfileUrl}
            />

            <PostComments
              post={post}
              onReaction={onReaction}
              currentUserProfileUrl={currentUserProfileUrl}
              onDelete={onDelete}
            />

            <ShareDialog postId={post._id} baseUrl="http://localhost:5173" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
