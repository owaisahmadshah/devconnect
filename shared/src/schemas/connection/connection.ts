import * as z from 'zod';

export const connectionPendingState = z.enum(['pending', 'accepted', 'rejected']);

export const baseConnectionSchema = z
  .object({
    receiver: z.string().min(1, 'Receiver is required.'),
    sender: z.string().optional(),
    state: connectionPendingState.default('pending').optional(),
  })
  .refine(data => data.sender !== data.receiver, {
    message: 'Cannot send connection request to yourself.',
  });

export type TConnectionPendingState = z.infer<typeof connectionPendingState>;
export type TBaseConnection = z.infer<typeof baseConnectionSchema>;
