import { z } from 'zod';
import { skillWithIdSchema } from './skill.js';
import { educationWithIdSchema } from './education.js';
import { certificationWithIdSchema } from './certification.js';
import { achievementWithIdSchema } from './achievement.js';
import { experienceWithIdSchema } from './experience.js';
import { fullVisibilitySchema } from './visibility.js';
import { socialMediaLinkWithIdSchema } from './socialMediaLink.js';
import { profileUrlsWithIdSchema } from './profileUrls.js';

// Main profile schema combining all pieces together
export const baseProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string(),
  phoneNumber: z.string(),
  profilePictureUrl: z.string(),
  bio: z.string(),
  skills: z.array(skillWithIdSchema),
  educations: z.array(educationWithIdSchema),
  certifications: z.array(certificationWithIdSchema),
  achievements: z.array(achievementWithIdSchema),
  experiences: z.array(experienceWithIdSchema),
  visibility: fullVisibilitySchema,
  profileUrls: z.array(profileUrlsWithIdSchema),
  socialMediaLinks: z.array(socialMediaLinkWithIdSchema),
  isVerified: z.boolean(),
  github_avatar_url: z.string().url().or(z.literal('')).optional(),
  github_html_url: z.string().url().or(z.literal('')).optional(),
  github_email: z.string().email().or(z.literal('')).optional(),
});

// Export typescript types from schemas
export type TBaseProfile = z.infer<typeof baseProfileSchema>;
