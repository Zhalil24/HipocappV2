import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
};

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (
    userData: { userName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("https://hipocapp.com/Auth/Register", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Kayıt sırasında hata oluştu.");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registerSlice.reducer;
