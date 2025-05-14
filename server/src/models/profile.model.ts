import { model, Schema } from 'mongoose';

import type { IProfile } from '../types/profile.type.js';

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    profilePictureUrl: {
      type: String,
      default: '', // Add a default url picture
    },
    bio: {
      type: String,
    },
    skills: [
      {
        skillName: {
          type: String,
          index: true,
        },
        skillProficiency: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced'],
        },
        endorsements: [
          {
            endorsedBy: {
              type: String,
            },
            endorsedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    educations: [
      {
        school: {
          type: String,
        },
        degree: {
          type: String,
        },
        fieldOfStudy: {
          type: String,
        },
        started: {
          type: Date,
        },
        ended: {
          type: Schema.Types.Mixed, // Can be Date or String 'Present'
        },
      },
    ],
    certifications: [
      {
        title: {
          type: String,
        },
        issuer: {
          type: String,
        },
        issuedDate: {
          type: Date,
        },
        credentials: {
          type: String,
        },
        credentialsUrl: {
          type: String,
        },
      },
    ],
    achievements: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        date: {
          type: Date,
        },
        awardedBy: {
          type: String,
        },
      },
    ],
    experiences: [
      {
        companyOrProject: {
          type: String,
        },
        role: {
          type: String,
        },
        description: {
          type: String,
        },
        type: {
          type: String,
          enum: ['Job', 'Internship', 'Freelance', 'Project'],
        },
        location: {
          type: String, // Can be 'Remote' or a location string
        },
        started: {
          type: Date,
        },
        ended: {
          type: Schema.Types.Mixed, // Can be Date or String 'Present'
        },
        technologies: [
          {
            type: String,
            index: true,
          },
        ],
      },
    ],
    visibility: [
      {
        education: {
          type: String,
          enum: ['Private', 'Public', 'connections-only'],
          default: 'Public',
        },
        skills: {
          type: String,
          enum: ['Private', 'Public', 'connections-only'],
          default: 'Public',
        },
        experience: {
          type: String,
          enum: ['Private', 'Public', 'connections-only'],
          default: 'Public',
        },
        certifications: {
          type: String,
          enum: ['Private', 'Public', 'connections-only'],
          default: 'Public',
        },
      },
    ],
    profileUrls: [
      {
        type: String,
      },
    ],
    socialLinks: [
      {
        platform: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Profile = model<IProfile>('Profile', profileSchema);
