import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseResponseModel } from '../../core/models';
import { BaseService } from '../../core/services/baseService';
import { ContentModel, contentModelInitialState } from '@/core/models/content/contentModel';

const baseService = new BaseService();

export const fetchGetCampains = createAsyncThunk<
    BaseResponseModel<ContentModel[]>
>('draw/GetCampains', async () => {
    const response = await baseService.get<ContentModel[]>('api/draw/GetCampains');
    return response;
});

export const fetchGetJobAdvertisements = createAsyncThunk<
    BaseResponseModel<ContentModel[]>
>('draw/GetJobAdvertisements', async () => {
    const response = await baseService.get<ContentModel[]>('api/draw/GetJobAdvertisements');
    return response;
});


export const fetchGetThesisConsultation = createAsyncThunk<
    BaseResponseModel<ContentModel[]>
>('draw/GetThesisConsultation', async () => {
    const response = await baseService.get<ContentModel[]>('api/draw/GetThesisConsultation');
    return response;
});


export const fetchGetDraws = createAsyncThunk<
    BaseResponseModel<ContentModel[]>
>('draw/GetDraws', async () => {
    const response = await baseService.get<ContentModel[]>('api/draw/GetDraws');
    return response;
});


const contentSlice = createSlice({
    name: 'content',
    initialState: contentModelInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetCampains.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetCampains.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? [];
            })
            .addCase(fetchGetCampains.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
            });

        builder
            .addCase(fetchGetJobAdvertisements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetJobAdvertisements.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? [];
            })
            .addCase(fetchGetJobAdvertisements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
            });

        builder
            .addCase(fetchGetThesisConsultation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetThesisConsultation.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? [];
            })
            .addCase(fetchGetThesisConsultation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
            });

        builder
            .addCase(fetchGetDraws.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetDraws.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data ?? [];
            })
            .addCase(fetchGetDraws.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Bir hata oluştu.';
            });
    },
});

export default contentSlice.reducer;
