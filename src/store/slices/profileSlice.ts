import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { InitialStateProfileState, UserProfileModel, } from '../../core/models/user/userProfileModel';
import { BaseService } from '../../core/services/baseService';
import { BaseResponseModel } from '@/core/models/base/baseResponseModel';
import { UserProfileEditModel } from '@/core/models/user/userProfileEditModel';

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

    if (response.data) {
      return response;
    } else {
      return rejectWithValue(response.message || 'Şifre değiştirilemedi.');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'api/user/EditForMobile',
  async (payload: FormData, { rejectWithValue }) => {
      const response = await baseService.post<FormData, UserProfileModel>(
        'api/User/EditForMobile',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      if (response.data) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Profil güncellenemedi.');
      }
  }
);

export const deleteEntry = createAsyncThunk(
  'entries/deleteEntry',
  async (entryId: number, { rejectWithValue }) => {
    try {
      const response = await baseService.delete<BaseResponseModel<null>>(
        'api/entry/DeleteEntry',
        { params: { id: entryId } }
      );

      if (response.success) {
        return entryId;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Silme işlemi başarısız.');
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
    clearServiceMessage: (state) => {
      state.message = null;
      state.error = null;
      state.status = 'idle';
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
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message!;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
        state.message = action.payload.message!;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setActiveComponent,clearServiceMessage  } = profileSlice.actions;
export default profileSlice.reducer;
