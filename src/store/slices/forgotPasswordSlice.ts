import { BaseResponseModel, UserLoginModel, userLoginModelState } from "@/core/models";
import { LoginResponseModel } from "@/core/models/user/loginResponseModel";
import { BaseService } from "@/core/services/baseService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const baseService = new BaseService();

export const fetchForgotPassword = createAsyncThunk<
  BaseResponseModel<any>, 
  string                  
>(
  "api/user/ForgotPasswordApi",
  async (email) => {
    const response = await baseService.post<any, BaseResponseModel<any>>(
      `api/user/ForgotPasswordApi?email=${encodeURIComponent(email)}`,
      {} 
    );
    return response;
  }
);

const forgotPasswordSlice = createSlice({
    name: 'login',
    initialState: userLoginModelState,
    reducers: {
        clearMessage(state) {
            state.message = "";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchForgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? null;
                state.userRole = action.payload.data?.roleDTO?.name ?? '';
                state.message = action.payload.message ?? 'Tekrar Deneyiniz';
                localStorage.setItem("user", JSON.stringify(action.payload.data));
            })
            .addCase(fetchForgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
            });
    },
})

export default forgotPasswordSlice.reducer;