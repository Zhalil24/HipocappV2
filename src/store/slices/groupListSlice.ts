import { BaseResponseModel } from '@/core/models';
import { GroupModel } from '@/core/models/chatMessage/messageModel';
import { GetGroupsMemberRequest } from '@/core/models/groupMemberRequest/groupMemberRequestModel';
import { BaseService } from '@/core/services/baseService';
import { Endpoints } from '@/Utilities/enums/Endpoints';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
interface GroupState {
    groups: GroupModel[];
    loading: boolean;
    error: string | null;
    message: string | null | undefined;
}
const initialState: GroupState = {
    groups: [] as GroupModel[],
    loading: false,
    error: null,
    message: null
};
const baseService = new BaseService();
export const fetchGetGroups = createAsyncThunk<
    BaseResponseModel<GroupModel[]>>
    ("get/groups", async () => {
        const resp = await baseService.get<GroupModel[]>('api/chat/GetAllGroups')
        return resp;
    });

export const sendToGroupRequest = createAsyncThunk<
    BaseResponseModel<GetGroupsMemberRequest>,
    GetGroupsMemberRequest
>(
    "send/toGroupRequest",
    async (data) => {
        const url = `${Endpoints.sendToGroupRequest}`;
        const resp = await baseService.post<GetGroupsMemberRequest,GetGroupsMemberRequest>(url, data);
        return resp;
    }
);


const groupListSlice = createSlice({
    name: 'Group List',
    initialState,
    reducers: {
        clearTitles: (state) => {
            state.groups = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload.data ?? [];
                state.message = action.payload.message;
            })
            .addCase(fetchGetGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Başlıklar yüklenemedi.';
            })
            .addCase(sendToGroupRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendToGroupRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(sendToGroupRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Başlıklar yüklenemedi.';
            });
    },
});

export const { clearTitles } = groupListSlice.actions;
export default groupListSlice.reducer;
