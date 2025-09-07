import { BaseResponseModel } from "@/core/models/base/baseResponseModel";
import { BaseService } from "@/core/services/baseService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  isSuccess: boolean | null;

}

const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  message: '',
  isSuccess:null,
};

const baseService = new BaseService();

export const registerUser = createAsyncThunk<
  BaseResponseModel<null>,
  FormData,               
  { rejectValue: string } 
>(
  "register/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await baseService.post<FormData, null>(
        "api/user/Register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kayıt sırasında hata oluştu."
      );
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message!;
        setTimeout(() => { state.message = null }, 20);
        state.isSuccess = action.payload.isSuccess ?? null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registerSlice.reducer;
