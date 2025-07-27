import { z } from 'zod';

// Paramater used to get user profile data
export const userProfileParamsSchema = z.object({
  url: z.string(),
});

export type TUserProfileParams = z.infer<typeof userProfileParamsSchema>;
