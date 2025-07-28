import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { InitialStateProfileState, UserProfileModel, } from '../../core/models/user/userProfileModel';
import { BaseService } from '../../core/services/baseService';

const baseService = new BaseService();

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {

    const response = await baseService.get<UserProfileModel>(
      'api/user/GetProfile',
      { id: userId }
    );
    if (response.data) {
      console.log("response", response)
      return response.data;
    } else {
      return rejectWithValue(response.message || 'Kullanıcı profili alınamadı.');
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (
    payload: PasswordChangeDto,
    { rejectWithValue }
  ) => {
    const response = await baseService.post<PasswordChangeDto, UserProfileModel>(
      'api/user/PasswordChange',
      payload
    );

    if (response.success && response.data) {
      return response.data;
    } else {
      return rejectWithValue(response.message || 'Şifre değiştirilemedi.');
    }
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState: InitialStateProfileState,
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

    builder
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.message = state.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setActiveComponent } = profileSlice.actions;
export default profileSlice.reducer;
