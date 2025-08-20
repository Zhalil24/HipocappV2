import { BaseResponseModel } from '@/core/models';
import { ContentModel } from '@/core/models/content/contentModel';
import { BaseService } from '@/core/services/baseService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const baseService = new BaseService();

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

export const fetchGetJobAdvertisements = createAsyncThunk<
  BaseResponseModel<ContentModel[]>
>('draw/GetJobAdvertisements', async () => {
  const response = await baseService.get<ContentModel[]>('api/draw/GetJobAdvertisements');
  return response;
});


const initialState = {
  entries: [] as any[],
  loading: false,
  error: null as string | null,
  jobs: [] as any[],
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
      })

      .addCase(fetchGetJobAdvertisements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetJobAdvertisements.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data ?? [];
      })
      .addCase(fetchGetJobAdvertisements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu.';
      });
  },
});

export default titleEntrySlice.reducer;
