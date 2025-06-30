import { z } from 'zod';

// Single image schema for frontend
export const singleImageSchema = z.object({
  image: z
    .instanceof(File)
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'Only JPEG and PNG images are allowed',
    }),
});

// Single image schema for frontend with id
export const singleImageWithIdSchema = z.object({ url: z.string(), _id: z.string() });

// For API requests (upload)
export const singleBackendImageSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/png']),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
});

// Multiple images schema for frontend
export const multipleImagesSchema = z.array(singleImageSchema);

// Single image schema for frontend with id
export const multipleImagesWithIdSchema = z.array(singleImageWithIdSchema);

// For API requests for multiple images (upload)
export const multipleBackendImagesSchema = z.array(singleBackendImageSchema);

// Types for typescript
export type TSingleImage = z.infer<typeof singleImageSchema>;
export type TSingleImageWithId = z.infer<typeof singleImageWithIdSchema>;
export type TSingleImageBackend = z.infer<typeof singleBackendImageSchema>;
export type TMultipleImages = z.infer<typeof multipleImagesSchema>;
export type TMultipleImagesWithId = z.infer<typeof multipleImagesWithIdSchema>;
export type TMultipleBackendImages = z.infer<typeof multipleBackendImagesSchema>;
