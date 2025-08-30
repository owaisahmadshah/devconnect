import { z } from 'zod';

import { TBaseProfile } from './profile';
import { profileUrlsWithIdSchema } from './profileUrls';

// User profile summary light weight response
export const userProfileSummarySchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  profilePictureUrl: z.string(),
  bio: z.string(),
  profileUrls: z.array(profileUrlsWithIdSchema),
  isVerified: z.boolean(),
});

// Export typescript types for responses
export type TUserProfileResponse = Omit<TBaseProfile, 'user'> & {
  _id: string;
  username: string;
  email: string;
  role: string;
};
export type TUserProfileSummaryResponse = z.infer<typeof userProfileSummarySchema>;
export type TUserProfileSummary = TUserProfileSummaryResponse;
export type TUserProfileSummaryresponseWithPagination = {
  profiles: TUserProfileSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
