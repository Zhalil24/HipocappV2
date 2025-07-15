import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseResponse, lastEntriesInitialState, LastEntryModel } from '../../core/models';
import { BaseService } from '../../core/services/baseService';

const baseService = new BaseService();

// Random (stream) entries
export const fetchRandomEntries = createAsyncThunk<
  BaseResponse<LastEntryModel[]>
>('randomEntries/fetchRandomEntries', async () => {
  const response = await baseService.get<LastEntryModel[]>('/Entry/GetRandomEntries');
  return response;
});

const randomEntrySlice = createSlice({
  name: 'randomEntries',
  initialState: lastEntriesInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data ?? [];
      })
      .addCase(fetchRandomEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu.';
      });
  },
});

export default randomEntrySlice.reducer;
