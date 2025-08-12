import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BaseService } from '../../core/services/baseService';

import { UserDataModel } from '@/core/models/user/userDataModel';
import { chatModelInitialState, InitialChatModel } from '@/core/models/chat/chatModel';

const baseService = new BaseService();


type ThunkConfig = { rejectValue: string };

export const fetchUsers = createAsyncThunk<UserDataModel[], void, ThunkConfig>(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        const res = await baseService.get<UserDataModel[]>('/api/user/all');
        if (!res.success || !res.data) {
            return rejectWithValue(res.message ?? 'Kullanıcılar alınamadı');
        }
        return res.data;
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: chatModelInitialState as InitialChatModel,
    reducers: {
        clearMessage: (state) => {
            state.message = null;
        },

        setUsers: (state, action: PayloadAction<UserDataModel[]>) => {
            state.users = action.payload;
        },
        setGroups: (state, action: PayloadAction<UserDataModel[]>) => {
            state.groups = action.payload;
        },
        setChats: (state, action: PayloadAction<UserDataModel[]>) => {
            state.chats = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserDataModel[]>) => {
                state.loading = false;
                state.users = action.payload;
            })


            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            });

    },
});

export const { clearMessage } = chatSlice.actions;
export default chatSlice.reducer;
