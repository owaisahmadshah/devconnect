import type { TCommentResponse } from 'shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { MoreHorizontal } from 'lucide-react';

interface CommentProps {
  comment: TCommentResponse;
  onDelete?: () => void;
  isAuthor?: boolean;
}

export const Comment = ({ comment, onDelete, isAuthor = false }: CommentProps) => {
  const { body, commentBy } = comment;

  return (
    <div className="flex gap-3 py-3">
      {/* Profile Picture */}
      <Link
        to={'/profile/$identifier'}
        params={{
          identifier: commentBy.profileUrls[0].url,
        }}
        className="flex-shrink-0"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={commentBy.profilePictureUrl} />
          <AvatarFallback>
            {commentBy.firstName[0]}
            {commentBy.lastName[0]}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Comment Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              to={'/profile/$identifier'}
              params={{
                identifier: commentBy.profileUrls[0].url,
              }}
              className="text-sm font-semibold text-black"
            >
              {`${commentBy.firstName} ${commentBy.lastName}`}
              {isAuthor && <span className="text-xs text-gray-600"> Author</span>}
            </Link>
            <p className="text-foreground mt-0.5 text-sm break-words whitespace-pre-wrap">{body}</p>
          </div>

          {/* Three Dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-shrink-0 transition-opacity hover:opacity-70 focus:outline-none">
              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
