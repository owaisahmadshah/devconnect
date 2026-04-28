import { z } from 'zod';
import { createSkillSchema, skillWithIdSchema } from './skill.js';
import { createEducationSchema, educationWithIdSchema } from './education.js';
import { certificationWithIdSchema, createCertificationSchema } from './certification.js';
import { achievementWithIdSchema, createAchievementSchema } from './achievement.js';
import { createExperienceSchema, experienceWithIdSchema } from './experience.js';
import { createSocialMediaLinkSchema, socialMediaLinkWithIdSchema } from './socialMediaLink.js';
import { profileUrlsWithIdSchema } from './profileUrls.js';

// For API request (update) - requires _id, we'll get it from req.user
export const addProfileArrayFieldSchema = z
  .discriminatedUnion('fieldName', [
    z.object({
      fieldName: z.literal('skills'),
      fieldData: createSkillSchema,
    }),
    z.object({
      fieldName: z.literal('educations'),
      fieldData: createEducationSchema,
    }),
    z.object({
      fieldName: z.literal('certifications'),
      fieldData: createCertificationSchema,
    }),
    z.object({
      fieldName: z.literal('achievements'),
      fieldData: createAchievementSchema,
    }),
    z.object({
      fieldName: z.literal('experiences'),
      fieldData: createExperienceSchema,
    }),
    z.object({
      fieldName: z.literal('socialMediaLinks'),
      fieldData: createSocialMediaLinkSchema,
    }),
    z.object({
      fieldName: z.literal('profileUrls'),
      fieldData: z.string().min(1, 'Profile url is required'),
    }),
  ])
  .refine(data => !!data.fieldName, {
    message: 'At least one field must be provided for update',
  });

export const deleteProfileArrayItemSchema = z
  .discriminatedUnion('fieldName', [
    z.object({
      fieldName: z.literal('skills'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
    z.object({
      fieldName: z.literal('educations'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
    z.object({
      fieldName: z.literal('certifications'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
    z.object({
      fieldName: z.literal('achievements'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
    z.object({
      fieldName: z.literal('experiences'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
    z.object({
      fieldName: z.literal('socialMediaLinks'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
    z.object({
      fieldName: z.literal('profileUrls'),
      deleteObjectId: z.string().min(1, '_id is required'),
    }),
  ])
  .refine(data => !!data.fieldName, {
    message: 'At least one field must be provided for delete',
  });

export const updateProfileArrayFieldWithIdSchema = z
  .discriminatedUnion('fieldName', [
    z.object({
      fieldName: z.literal('skills'),
      fieldData: skillWithIdSchema,
    }),
    z.object({
      fieldName: z.literal('educations'),
      fieldData: educationWithIdSchema,
    }),
    z.object({
      fieldName: z.literal('certifications'),
      fieldData: certificationWithIdSchema,
    }),
    z.object({
      fieldName: z.literal('achievements'),
      fieldData: achievementWithIdSchema,
    }),
    z.object({
      fieldName: z.literal('experiences'),
      fieldData: experienceWithIdSchema,
    }),
    z.object({
      fieldName: z.literal('socialMediaLinks'),
      fieldData: socialMediaLinkWithIdSchema,
    }),
    z.object({
      fieldName: z.literal('profileUrls'),
      fieldData: profileUrlsWithIdSchema,
    }),
  ])
  .refine(data => !!data.fieldName, {
    message: 'At least one field must be provided for update',
  });

export type TAddProfileArrayField = z.infer<typeof addProfileArrayFieldSchema>;
export type TDeleteProfileArrayItem = z.infer<typeof deleteProfileArrayItemSchema>;
export type TAddNewItemToProfileArrayFieldWithId = z.infer<
  typeof updateProfileArrayFieldWithIdSchema
>;

// For API response
export type TAddNewItemToProfileWithIdResponse = TAddNewItemToProfileArrayFieldWithId;
