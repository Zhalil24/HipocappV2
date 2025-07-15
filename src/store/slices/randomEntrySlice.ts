import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseResponseModel, lastEntriesInitialState } from '../../core/models'
import { randomEntriesInitialState, RandomEntryModel } from '@/core/models/entries/randomEntryModel';
import { BaseService } from '../../core/services/baseService';

const baseService = new BaseService();

export const fetchRandomEntries = createAsyncThunk<
  BaseResponseModel<RandomEntryModel[]>
>('randomEntries/fetchRandomEntries', async () => {
  const response = await baseService.get<RandomEntryModel[]>('/Entry/GetRandomEntries');
  return response;
});

const randomEntrySlice = createSlice({
  name: 'randomEntries',
  initialState: randomEntriesInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.halil = "halil bekle"
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
