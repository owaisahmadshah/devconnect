import { z } from 'zod';
import { createSkillSchema } from './skill';
import { createEducationSchema } from './education';
import { createCertificationSchema } from './certification';
import { createAchievementSchema } from './achievement';
import { createExperienceSchema } from './experience';
import { createVisibilitySchema } from './visibility';
import { createSocialMediaLinkSchema } from './socialMediaLink';

// Main profile schema combining all pieces together
export const baseProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string(),
  phoneNumber: z.string(),
  profilePictureUrl: z.string(),
  bio: z.string(),
  skills: z.array(createSkillSchema),
  educations: z.array(createEducationSchema),
  certifications: z.array(createCertificationSchema),
  achievements: z.array(createAchievementSchema),
  experiences: z.array(createExperienceSchema),
  visibility: createVisibilitySchema,
  profileUrls: z.array(z.string()),
  socialMediaLinks: z.array(createSocialMediaLinkSchema),
  isVerified: z.boolean(),
});

// Export typescript types from schemas
export type TBaseProfile = z.infer<typeof baseProfileSchema>;
