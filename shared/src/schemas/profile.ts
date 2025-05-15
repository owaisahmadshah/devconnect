import { z } from 'zod';

// Skill schema: represents a skill with name, proficiency level, and endorsements
export const skillSchema = z.object({
  skillName: z.string(),
  skillProficiency: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  endorsements: z.array(
    z.object({
      endorsedBy: z.string(),
      endorsedAt: z.date(),
    }),
  ),
});

// Education schema: details about educational background
export const educationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  started: z.date(),
  ended: z.union([z.date(), z.literal('Present')]),
});

// Certification schema: information about certifications
export const certificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  issuedDate: z.date(),
  credentials: z.string(),
  credentialsUrl: z.string(),
});

// Achievement schema: details about achievements or awards
export const achievementSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  awardedBy: z.string(),
});

// Experience schema: work or project experience details
export const experienceSchema = z.object({
  companyOrProject: z.string(),
  role: z.string(),
  description: z.string(),
  type: z.enum(['Job', 'Internship', 'Freelance', 'Project']),
  location: z.string().or(z.literal('Remote')),
  started: z.date(),
  ended: z.union([z.date(), z.literal('Present')]),
  technologies: z.array(z.string()),
});

// Social media link schema: social platform and corresponding link
export const socialMediaLinkSchema = z.object({
  platform: z.string(),
  link: z.string(),
});

// Enum for visibility settings in the profile
export const visibilityEnum = z.enum(['Private', 'Public', 'connections-only']);

// Visibility schema: defines visibility settings for various profile sections
export const visibilitySchema = z.object({
  education: visibilityEnum,
  skills: visibilityEnum,
  experience: visibilityEnum,
  certifications: visibilityEnum,
});

// Main profile schema combining all pieces together
export const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  profilePictureUrl: z.string(),
  bio: z.string(),
  skills: z.array(skillSchema),
  educations: z.array(educationSchema),
  certifications: z.array(certificationSchema),
  achievements: z.array(achievementSchema),
  experiences: z.array(experienceSchema),
  visibility: visibilitySchema,
  profileUrls: z.array(z.string()),
  socialMediaLinks: z.array(socialMediaLinkSchema),
  isVerified: z.boolean(),
});

// Export typescript types from schemas
export type TSkill = z.infer<typeof skillSchema>;
export type TEducation = z.infer<typeof educationSchema>;
export type TCertification = z.infer<typeof certificationSchema>;
export type TAchievement = z.infer<typeof achievementSchema>;
export type TExperience = z.infer<typeof experienceSchema>;
export type TSocialMediaLink = z.infer<typeof socialMediaLinkSchema>;
export type TVisibiltyEnum = z.infer<typeof visibilityEnum>;
export type TVisibilty = z.infer<typeof visibilitySchema>;
export type TProfile = z.infer<typeof profileSchema>;
