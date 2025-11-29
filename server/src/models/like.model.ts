import type { TCreateLike } from 'shared';
import { Document, model, Schema } from 'mongoose';

interface ILike extends Document, Omit<TCreateLike, 'likedBy' | 'postId'> {
  likedBy: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
      index: true,
    },
    value: {
      type: String,
      enum: ['like', 'love', 'dislike'],
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Profile',
      index: true,
    },
  },
  { timestamps: true },
);

export const Like = model<ILike>('Like', likeSchema);
