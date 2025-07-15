import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseResponseModel, lastEntriesInitialState, LastEntryModel } from '../../core/models';
import { BaseService } from '../../core/services/baseService';

const baseService = new BaseService();

// Daily entries
export const fetchLastEntries = createAsyncThunk<
  BaseResponseModel<LastEntryModel[]>
>('entries/fetchLastEntries', async () => {
  const response = await baseService.get<LastEntryModel[]>('/Entry/GetLastEntries');
  return response;
});

const entrySlice = createSlice({
  name: 'entries',
  initialState: lastEntriesInitialState,
  reducers: {},
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
  },
});

export default entrySlice.reducer;
