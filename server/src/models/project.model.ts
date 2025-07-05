import { type TCreateProject } from '@shared/src/index.js';
import { Document, model, Schema } from 'mongoose';

export interface IProjectSchema extends Document, Omit<TCreateProject, 'createdBy'> {
  createdBy: Schema.Types.ObjectId;
}

const projectSchema = new Schema<IProjectSchema>({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  liveDemoUrl: { type: String, default: '' },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: true,
  },
  creationDate: Date,
  visibility: {
    type: String,
    enum: ['Private', 'Public', 'connections-only'],
    default: 'Public',
  },
  collaborators: {
    type: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'Profile',
        },
      },
    ],
    default: [],
  },
  tags: {
    type: [
      {
        tag: String,
        lowercase: true,
      },
    ],
    default: [],
  },
  media: {
    type: [
      {
        type: {
          type: String,
          enum: ['video', 'image'],
        },
        url: {
          type: String,
        },
      },
    ],
    default: [],
  },
  techStacks: {
    type: [
      {
        tech: {
          type: String,
          lowercase: true,
        },
      },
    ],
    default: [],
  },
});

projectSchema.index({ 'techStacks.tech': 1 });

export const Project = model<IProjectSchema>('Project', projectSchema);
