import { BaseResponseModel, UserLoginModel, userLoginModelState } from "@/core/models";
import { LoginResponseModel } from "@/core/models/user/loginResponseModel";
import { BaseService } from "@/core/services/baseService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const baseService = new BaseService();

export const fetchLogin = createAsyncThunk<
    BaseResponseModel<LoginResponseModel>,
    UserLoginModel
>(
    'api/user/Login',
    async (loginData) => {
        const response = await baseService.post<UserLoginModel, LoginResponseModel>(
            'api/user/Login',
            loginData
        );
        return response;
    }
);


const loginSlice = createSlice({
    name: 'login',
    initialState: userLoginModelState,
    reducers: {
        clearMessage(state) {
            state.message = "";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? null;
                state.userRole = action.payload.data?.roleDTO?.name ?? '';
                state.message = action.payload.message ?? 'Tekrar Deneyiniz';
                localStorage.setItem("user", JSON.stringify(action.payload.data));
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
            });
    },
})

export default loginSlice.reducer;