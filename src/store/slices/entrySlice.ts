import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseResponseModel, lastEntriesInitialState, LastEntryModel } from '../../core/models';
import { BaseService } from '../../core/services/baseService';
import { RandomEntryModel } from '@/core/models/entries/randomEntryModel';
import { EntryModel } from '@/core/models/entries/entryModel';

const baseService = new BaseService();

// Daily entries
export const fetchLastEntries = createAsyncThunk<
  BaseResponseModel<LastEntryModel[]>
>('entries/fetchLastEntries', async () => {
  const response = await baseService.get<LastEntryModel[]>('/Entry/GetLastEntries');
  return response;
});

export const createEntry = createAsyncThunk<
  BaseResponseModel<RandomEntryModel>,
  EntryModel
>(
  'entry/create',
  async (entryData) => {
    const formData = new FormData();
    Object.entries(entryData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    const response = await baseService.post<FormData, RandomEntryModel>(
      'api/entry/create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  }
);

const entrySlice = createSlice({
  name: 'entries',
  initialState: lastEntriesInitialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data ?? [];
      })
      .addCase(fetchLastEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu.';
      });

    builder
      .addCase(createEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message!;
        if (action.payload.data) {
          state.data = [action.payload.data as unknown as LastEntryModel, ...state.data];
        }
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu.';
      });


  },

});
export const { clearMessage } = entrySlice.actions;
export default entrySlice.reducer;
