import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { UserProfileModel } from '../../core/models/user/userDataModel';
import { BaseServiceInstance } from '../../core/services/baseService';

interface ProfileState {
  data: UserProfileModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

  activeComponent: 'profile' | 'edit' | 'password' | 'entries';
}

const initialState: ProfileState = {
  data: null,
  status: 'idle',
  error: null,
  activeComponent: 'profile',
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await BaseServiceInstance.getUserProfile(Number(userId));
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profil bilgileri alınamadı.');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveComponent: (
      state,
      action: PayloadAction<'profile' | 'edit' | 'password' | 'entries'>
    ) => {
      state.activeComponent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfileModel>) => {
          state.status = 'succeeded';
          state.data = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setActiveComponent } = profileSlice.actions;
export default profileSlice.reducer;
