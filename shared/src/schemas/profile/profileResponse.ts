import { z } from 'zod';

import { TBaseProfile } from './profile';
import { profileUrlsWithIdSchema } from './profileUrls';
import { connectionPendingState } from '../connection/connection';

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
  connection: z
    .object({
      _id: z.string(),
      sender: z.string(),
      receiver: z.string(),
      state: connectionPendingState,
    })
    .optional(),
});

// Export typescript types for responses
export type TUserProfileResponse = Omit<TBaseProfile, 'user'> & {
  _id: string;
  username: string;
  email: string;
  role: string;
  connection: {
    _id: string;
    sender: string;
    receiver: string;
    state: z.infer<typeof connectionPendingState>;
  };
};
export type TUserProfileSummaryResponse = z.infer<typeof userProfileSummarySchema>;
export type TUserProfileSummary = TUserProfileSummaryResponse;
export type TUserProfileSummaryresponseWithPagination = {
  profiles: TUserProfileSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
