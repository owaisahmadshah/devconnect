import type { TBasePost } from 'shared';
import { Document, model, Schema } from 'mongoose';

export interface IPost extends Document, Omit<TBasePost, 'createdBy'> {
  createdBy: Schema.Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    description: {
      type: String,
      default: '',
    },
    links: {
      type: [String],
      default: [],
    },
    media: {
      type: [
        {
          url: {
            type: String,
          },
          mediaType: {
            type: String,
            enum: ['video', 'image'],
            default: 'image',
          },
        },
      ],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({ description: 'text' });

export const Post = model<IPost>('Post', postSchema);
