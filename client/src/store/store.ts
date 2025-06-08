import { configureStore } from '@reduxjs/toolkit';
import profileSummaryReducer from '@/store/user/profileSlice';
import profileReducer from '@/store/profile/profileSlice';

export const store = configureStore({
  reducer: {
    profileSummary: profileSummaryReducer,
    profile: profileReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
