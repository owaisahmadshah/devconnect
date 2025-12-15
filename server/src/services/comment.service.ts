import type { TCommentDeleteResponse, TCommentResponse, TCreateComment } from 'shared';
import { CommentRepository } from '../repositories/comment.repository.js';
import { ProfileService } from './profile.service.js';
import { CommentMapper } from '../mapper/comment.mapper.js';
import { ApiError } from '../utils/ApiError.js';

export class CommentService {
  constructor(
    private repo: CommentRepository,
    private mapper: CommentMapper,
    private proService: ProfileService,
  ) {}

  async createComment(data: TCreateComment, userId: string): Promise<TCommentResponse> {
    const profile = await this.proService.getUserProfileSummary(userId);

    data.commentBy = profile._id;

    const dbComment = await this.repo.createComment(data);
    const responseComment = this.mapper.toPublicComment(dbComment);

    return { ...responseComment, commentBy: profile };
  }

  async deleteComment(commentId: string): Promise<TCommentDeleteResponse> {
    const deletedComment = await this.repo.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new ApiError(404, 'Comment not found');
    }

    return {
      success: true,
      postId: deletedComment.postId.toString(),
      commentId: deletedComment?._id ? deletedComment._id.toString() : '',
    };
  }

  async fetchPaginatedComments({
    postId,
    limit = 10,
    userId,
    cursor,
  }: {
    postId: string;
    userId: string;
    limit: number;
    cursor: string | null;
  }) {
    const profile = await this.proService.getUserProfileSummary(userId);

    const comments = await this.repo.fetchPaginatedComments({
      postId,
      limit,
      cursor,
      profileId: profile._id,
    });

    const responseComments: TCommentResponse[] = comments.map(comment =>
      this.mapper.toPublicComment(comment),
    );

    const hasMore = responseComments.length === limit;
    const lastComment = responseComments.at(-1);
    const nextCursor: string | null = lastComment?.createdAt
      ? lastComment.createdAt.toISOString()
      : null;

    return {
      comments: responseComments,
      hasMore,
      nextCursor,
    };
  }
}
