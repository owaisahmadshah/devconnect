import { z } from 'zod';

// Certification schema: information about certifications
export const baseCertificationSchema = z.object({
  title: z.string().min(1, 'Certificate title is required'),
  issuer: z.string().min(1, 'Certificate issuer is required'),
  issuedDate: z.coerce.date(),
  credentials: z.string().optional(),
  credentialsUrl: z.string().optional(),
});

// For API request (create) - no _id
export const createCertificationSchema = baseCertificationSchema;

// For API request (update) - requires _id
export const updateCertificationSchema = baseCertificationSchema
  .pick({ issuedDate: true, credentials: true, credentialsUrl: true })
  .partial()
  .extend({
    _id: z.string().min(1, '_id is required'),
  })
  .refine(
    data =>
      data.credentials !== undefined ||
      data.credentialsUrl !== undefined ||
      data.issuedDate !== undefined,
    {
      message: 'At least one field must be provided for update',
    },
  );

// For frontend and API response
export const certificationWithIdSchema = baseCertificationSchema.extend({
  _id: z.string().min(1, '_id is required'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for typescript
export type TBaseCertification = z.infer<typeof baseCertificationSchema>;
export type TCreateCertification = z.infer<typeof createCertificationSchema>;
export type TUpdateCertification = z.infer<typeof updateCertificationSchema>;
export type TCertificationWithId = z.infer<typeof certificationWithIdSchema>;
