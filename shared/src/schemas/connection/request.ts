import * as z from 'zod';
import { baseConnectionSchema, connectionPendingState } from './connection.js';

// Do not requires _id
export const createConnectionSchema = baseConnectionSchema;

// Requires _id
export const updateConnectionSchema = z.object({
  connectionId: z.string().min(1, 'Connection id is required.'),
  state: connectionPendingState,
});

// requires _id
export const deleteConnectionSchema = z.object({
  connectionId: z.string().min(1, 'Connection id is required.'),
});

export type TCreateConnection = z.infer<typeof createConnectionSchema>;
export type TUpdateConnection = z.infer<typeof updateConnectionSchema>;
export type TDeleteConnection = z.infer<typeof deleteConnectionSchema>;
