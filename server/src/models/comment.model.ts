import type { TCreateComment } from 'shared';
import { Document, model, Schema } from 'mongoose';

interface IComment extends Document, Omit<TCreateComment, 'commentBy' | 'postId'> {
  commentBy: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
      index: true,
    },
    body: {
      type: String,
      required: true,
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Profile',
      index: true,
    },
  },
  { timestamps: true },
);

export const Comment = model<IComment>('Comment', commentSchema);
