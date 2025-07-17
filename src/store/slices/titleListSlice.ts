// src/store/slices/titleListSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Title {
  id: number;
  titleName: string;
}

interface TitleListState {
  titles: Title[];
  loading: boolean;
  error: string | null;
}

const initialState: TitleListState = {
  titles: [],
  loading: false,
  error: null,
};

// HeaderName'den ID al ve o ID ile Title verilerini getir
export const fetchTitlesByHeaderName = createAsyncThunk(
  "titles/fetchByHeaderName",
  async (headerName: string, { rejectWithValue }) => {
    try {
      const headerRes = await axios.get(
        `https://hipocapp.com/Header/GetHeaderIdByHeaderName?name=${headerName}`
      );
      const headerId = headerRes.data?.id ?? headerRes.data;

      if (!headerId) throw new Error("Header ID alınamadı.");

      const titlesRes = await axios.get(
        `https://hipocapp.com/Title/GetAllTitles?id=${headerId}`
      );

      console.log("GetAllTitles API cevabı:", titlesRes.data);

      return {
        titles: titlesRes.data.data ?? [],
        message: titlesRes.data.message,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Başlıklar getirilemedi.");
    }
  }
);

const titleListSlice = createSlice({
  name: "titleList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTitlesByHeaderName.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.titles = [];
      })
      .addCase(fetchTitlesByHeaderName.fulfilled, (state, action) => {
        state.loading = false;
        state.titles = action.payload.titles;
        if (action.payload.titles.length === 0) {
          state.error = action.payload.message || "Başlık bulunamadı.";
        } else {
          state.error = null;
        }
      })
      .addCase(fetchTitlesByHeaderName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Başlıklar yüklenemedi.";
      });
  },
});

export default titleListSlice.reducer;
