import { Document, model, Schema } from 'mongoose';

import type { TBaseProfile } from 'shared';

export interface IProfile extends Document, TBaseProfile {
  user: Schema.Types.ObjectId;
}

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
      default: '/default-profile-picture.png',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [
        {
          skillName: {
            type: String,
          },
          skillProficiency: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
          },
          endorsements: {
            type: [
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
            default: [],
          },
        },
      ],
      default: [],
    },
    educations: {
      type: [
        {
          school: {
            type: String,
            required: true,
          },
          degree: {
            type: String,
            default: '',
          },
          fieldOfStudy: {
            type: String,
            default: '',
          },
          started: {
            type: Date,
            default: Date.now,
          },
          ended: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    certifications: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          issuer: {
            type: String,
            default: '',
          },
          issuedDate: {
            type: Date,
            default: Date.now,
          },
          credentials: {
            type: String,
            default: '',
          },
          credentialsUrl: {
            type: String,
            default: '',
          },
        },
      ],
      default: [],
    },
    achievements: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            default: '',
          },
          date: {
            type: Date,
            default: Date.now,
          },
          awardedBy: {
            type: String,
            default: '',
          },
        },
      ],
      default: [],
    },
    experiences: {
      type: [
        {
          companyOrProject: {
            type: String,
            required: true,
          },
          role: {
            type: String,
            default: '',
          },
          description: {
            type: String,
            default: '',
          },
          type: {
            type: String,
            enum: ['Job', 'Internship', 'Freelance', 'Project'],
            default: 'Job',
          },
          location: {
            type: String,
            default: 'Remote',
          },
          started: {
            type: Date,
            default: Date.now,
          },
          ended: {
            type: Date,
            default: Date.now,
          },
          technologies: {
            type: [String],
            default: [],
          },
        },
      ],
      default: [],
    },
    visibility: {
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
    profileUrls: {
      type: [
        {
          url: {
            type: String,
            unique: true,
            required: true,
          },
        },
      ],
      default: [],
    },
    socialMediaLinks: {
      type: [
        {
          platform: {
            type: String,
            required: true,
          },
          link: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    github_avatar_url: { type: String, default: '' },
    github_html_url: { type: String, default: '' },
    github_email: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

profileSchema.index({ user: 1 }, { unique: true });
profileSchema.index({ 'skills.skillName': 1 });
profileSchema.index({ 'experiences.technologies': 1 });
// profileSchema.index({ 'profileUrls.url': 1 });
// TODO: Investigate why enabling this index causes duplicate key errors.

export const Profile = model<IProfile>('Profile', profileSchema);
