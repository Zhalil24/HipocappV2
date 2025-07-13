import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLastEntries = createAsyncThunk(
  'entries/fetchLastEntries',
  async () => {
    const response = await axios.get(
      'https://hipocapp.com/Entry/GetLastEntries'
    );
    return response.data;
  }
);

const entrySlice = createSlice({
  name: 'entries',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLastEntries.fulfilled, (state, action) => {
  state.loading = false;

  // action.payload: API cevabı objesi
  // İhtiyacımız olan entries, action.payload.data içinde (dizi)
  state.data = Array.isArray(action.payload.data) ? action.payload.data : [];
})
      .addCase(fetchLastEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default entrySlice.reducer;
