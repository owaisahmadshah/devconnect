import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TUserProfileSummaryResponse } from 'shared';

export interface IUserProfileSummaryState {
  user: TUserProfileSummaryResponse | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: IUserProfileSummaryState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
};

const profileSummarySlice = createSlice({
  name: 'profileSummary',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUserProfileSummaryResponse>) => {
      if (!action.payload) {
        return;
      }
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    clearUser: state => {
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser } = profileSummarySlice.actions;
export default profileSummarySlice.reducer;
