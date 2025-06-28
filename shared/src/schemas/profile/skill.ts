import { z } from 'zod';

// Skill schema: represents a skill with name, proficiency level, and endorsements
export const baseSkillSchema = z.object({
  skillName: z.string().min(1, 'Skill name is required.'),
  skillProficiency: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  endorsements: z.array(
    z.object({
      endorsedBy: z.string(),
      endorsedAt: z.coerce.date(),
    }),
  ),
});

// For API request (create) - no _id
export const createSkillSchema = baseSkillSchema;

// For API request (update) - requires _id
export const updateSkillSchema = baseSkillSchema
  .pick({ endorsements: true, skillProficiency: true })
  .partial()
  .extend({
    _id: z.string().min(1, '_id is required'),
  })
  .refine(
    data => {
      // Ensure atleaset one is being updated
      const { _id, ...updatedFields } = data;
      return Object.keys(updatedFields).length > 0;
    },
    { message: 'At least one field must be provided for update' },
  );

// For frontend and API responses
export const skillWithIdSchema = baseSkillSchema.extend({
  _id: z.string().min(1, '_id is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Union type for flexible validation (when _id might or might not be present)
export const skillSchema = z.union([createSkillSchema, updateSkillSchema]);

// Types for typescript
export type TBaseSkill = z.infer<typeof baseSkillSchema>;
export type TCreateSkill = z.infer<typeof createSkillSchema>;
export type TUpdateSkill = z.infer<typeof updateSkillSchema>;
export type TSkillWithId = z.infer<typeof skillWithIdSchema>;
export type TSkillSchema = z.infer<typeof skillSchema>;
