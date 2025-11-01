import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Button } from '@/components/ui/button';
import type { TPostResponse } from 'shared';
import { FaHeart, FaRegCommentDots, FaShare } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { ImagesCarousel } from '@/components/organisms/ImagesCarousel';

interface PostProps {
  post: TPostResponse;
}

export const Post = ({ post }: PostProps) => {
  return (
    <Card className="rounded-radius-lg border-border mx-auto h-3/4 w-full border py-2 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <CardHeader className="border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ProfileWithUrl
            user={post.createdBy}
            profileSize="m"
            reverse={true}
            underlineOnHover={false}
            postDate={post.createdAt}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <HiDotsHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>

      {/* Description */}
      {post.description && (
        <CardContent className="px-4">
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
            {post.description}
          </p>
        </CardContent>
      )}
      {/* Media */}
      {post.media && post.media.length > 0 && <ImagesCarousel images={post.media} />}

      {/* Divider */}
      <div className="border-border mx-4 border-t" />

      {/* Actions */}
      <CardFooter className="px-2 sm:px-4">
        <div className="text-muted-foreground flex w-full justify-between">
          {/* Like */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary flex flex-1 items-center justify-center gap-2 text-sm font-medium"
          >
            <FaHeart className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Like</span>
          </Button>

          {/* Comment */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary flex flex-1 items-center justify-center gap-2 text-sm font-medium"
          >
            <FaRegCommentDots className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Comment</span>
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary flex flex-1 items-center justify-center gap-2 text-sm font-medium"
          >
            <FaShare className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
