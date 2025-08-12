import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Title {
  id: number;
  name: string;
}

interface TitleListState {
  titles: Title[];
  loading: boolean;
  error: string | null;
  headerId: number | null;
}

const initialState: TitleListState = {
  titles: [],
  loading: false,
  error: null,
  headerId: null,
};

export const fetchTitlesByHeaderName = createAsyncThunk(
  'titles/fetchByHeaderName',
  async (headerName: string, { rejectWithValue }) => {
    try {
      const headerRes = await axios.get(
        `https://hipocapp.com/Header/GetHeaderIdByHeaderName?name=${headerName}`
      );
      const headerId = headerRes.data?.id ?? headerRes.data;

      if (!headerId) throw new Error('Header ID alınamadı.');

      const titlesRes = await axios.get(
        `https://hipocapp.com/Title/GetAllTitles?id=${headerId}`
      );

      return {
        titles: titlesRes.data.data ?? [],
        message: titlesRes.data.message,
        headerId: headerId,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Başlıklar getirilemedi.');
    }
  }
);

const titleListSlice = createSlice({
  name: 'titleList',
  initialState,
  reducers: {
    clearTitles: (state) => {
      state.titles = [];
      state.loading = false;
      state.error = null;
      state.headerId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTitlesByHeaderName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.titles = [];
      })
      .addCase(fetchTitlesByHeaderName.fulfilled, (state, action) => {
        state.loading = false;
        state.headerId = action.payload.headerId;
        state.titles = action.payload.titles;
        if (action.payload.titles.length === 0) {
          state.error = action.payload.message || 'Başlık bulunamadı.';
        } else {
          state.error = null;
        }
      })
      .addCase(fetchTitlesByHeaderName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Başlıklar yüklenemedi.';
      });
  },
});

export const { clearTitles } = titleListSlice.actions;
export default titleListSlice.reducer;
