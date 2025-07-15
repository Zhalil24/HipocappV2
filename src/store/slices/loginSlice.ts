import { BaseResponseModel, UserLoginModel, userLoginModelState } from "@/core/models";
import { BaseService } from "@/core/services/baseService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const baseService = new BaseService();

export const fetchLogin = createAsyncThunk<
    BaseResponseModel<UserLoginModel>,
    UserLoginModel
>(
    'api/user/Login',
    async (loginData) => {
        const response = await baseService.post<UserLoginModel, UserLoginModel>(
            'api/user/Login',
            loginData
        );
        return response;
    }
);


const loginSlice = createSlice({
    name: 'login',
    initialState: userLoginModelState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isLogin = false;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? null;
                state.isLogin = true;
                // state.userRole = action.payload.data.roleDTO.name
                // _localStorgeSaveItem(state.data.token)
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
                state.isLogin = false;
            });
    },
})

export default loginSlice.reducer;