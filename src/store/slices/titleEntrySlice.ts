import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEntriesByTitleName = createAsyncThunk(
  'titleEntry/fetchEntriesByTitleName',
  async (titleName: string) => {
    const response = await axios.get(
      `https://hipocapp.com/Entry/GetEntriesByTitleName?name=${encodeURIComponent(
        titleName
      )}`
    );

    return response.data;
  }
);

const initialState = {
  entries: [] as any[],
  loading: false,
  error: null as string | null,
};

const titleEntrySlice = createSlice({
  name: 'titleEntry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntriesByTitleName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntriesByTitleName.fulfilled, (state, action) => {
        state.loading = false;

        state.entries = action.payload.data ?? [];
      })
      .addCase(fetchEntriesByTitleName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu';
      });
  },
});

export default titleEntrySlice.reducer;
