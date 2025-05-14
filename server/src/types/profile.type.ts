import { Document, Schema } from 'mongoose';

export type TSkills = {
  skillName: string;
  skillProficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  endorsements: [
    {
      endorsedBy: string;
      endorsedAt: Date;
    },
  ];
};

export type TEducation = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  started: Date;
  ended: Date | 'Present';
};

export type TCertifications = {
  title: string;
  issuer: string;
  issuedDate: Date;
  // expiryDate: Date | null; // TODO:
  credentials: string;
  credentialsUrl: string;
};

export type TAchievements = {
  title: string;
  description: string;
  date: Date;
  awardedBy: string;
};

export type TExperiences = {
  companyOrProject: string;
  role: string;
  description: string;
  type: 'Job' | 'Internship' | 'Freelance' | 'Project';
  location: 'Remote' | string;
  started: Date;
  ended: Date | 'Present';
  technologies: string[];
};

export type TSocialLink = {
  platform: string;
  link: string;
};

export type TVISIBILITY = 'Private' | 'Public' | 'connections-only';

export type TVisibility = {
  education: TVISIBILITY;
  skills: TVISIBILITY;
  experience: TVISIBILITY;
  certifications: TVISIBILITY;
};

export interface IProfile extends Document {
  user: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl: string;
  bio: string;
  skills: TSkills[];
  educations: TEducation[];
  certifications: TCertifications[];
  achievements: TAchievements[];
  experiences: TExperiences[];
  visibility: TVisibility[];
  profileUrls: string[];
  socialLinks: TSocialLink[];
  isVerified: boolean;
}
