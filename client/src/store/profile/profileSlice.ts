import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getProfileDefaultValues } from '@/lib/getProfileDefaultValues';
import {
  type TDeleteProfileArrayItem,
  type TUpdateProfileField,
  type TUserProfileResponse,
  type TAddNewItemToProfileArrayFieldWithId,
  type TConnectionPendingState,
} from 'shared';

export interface IProfileState {
  profile: TUserProfileResponse;
  isLoaded: boolean;
  isCurrentUser: boolean;
}

const initialState: IProfileState = {
  profile: getProfileDefaultValues(),
  isLoaded: false,
  isCurrentUser: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (
      state,
      action: PayloadAction<{ profile: TUserProfileResponse; isCurrentUser: boolean }>,
    ) => {
      state.profile = action.payload.profile;
      state.isCurrentUser = action.payload.isCurrentUser;
      state.isLoaded = true;
    },
    addArrayItemToProfile: (state, action: PayloadAction<TAddNewItemToProfileArrayFieldWithId>) => {
      const { fieldName, fieldData } = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.profile[fieldName] = [fieldData as any, ...state.profile[fieldName]];
    },
    deleteArrayItemProfile: (state, action: PayloadAction<TDeleteProfileArrayItem>) => {
      const { fieldName, deleteObjectId } = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.profile[fieldName] = (state.profile[fieldName] as any).filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item._id !== deleteObjectId,
      );
    },
    updateField: (state, action: PayloadAction<TUpdateProfileField>) => {
      const { fieldName, fieldData } = action.payload;
      // TODO: Undo comments if isVerified is added
      // if (fieldName === 'isVerified') {
      //   state.profile[fieldName] = fieldData;
      // } else {
      state.profile[fieldName] = fieldData;
      // }
    },
    updateConnection: (
      state,
      action: PayloadAction<{
        _id: string;
        sender: string;
        receiver: string;
        state: TConnectionPendingState;
      }>,
    ) => {
      if (action.payload.state === 'accepted') {
        state.profile['connection'] = action.payload;
        state.profile['connections'] = state.profile['connections']
          ? state.profile['connections'] + 1
          : 1;
      }
      if (action.payload.state === 'pending') {
        state.profile['connection'] = action.payload;
      }
      if (action.payload.state === 'rejected') {
        state.profile['connection'] = {};
      }
    },
    deleteConnection: (state, _: PayloadAction<{ connectionId: string }>) => {
      state.profile['connection'] = {};
      state.profile['connections'] =
        state.profile['connections'] && state.profile['connections'] - 1;
    },
    clearProfile: state => {
      state.profile = getProfileDefaultValues();
      state.isCurrentUser = false;
    },
  },
});

export const {
  setProfile,
  addArrayItemToProfile,
  deleteArrayItemProfile,
  updateField,
  updateConnection,
  deleteConnection,
  clearProfile,
} = profileSlice.actions;
export default profileSlice.reducer;
