import { BaseResponseModel, LastEntryModel, UserLoginModel, userLoginModelState } from "@/core/models";
import { ContentModel } from "@/core/models/content/contentModel";
import { AllEntryModel } from "@/core/models/entries/allEntriesModel";
import { PaginationModel } from "@/core/models/pagination/paginationModel";
import { adminPanelModelState } from "@/core/models/panel/initialPanelModel";
import { RequestModel } from "@/core/models/request/requestModel";
import { UserDataModel } from "@/core/models/user/userDataModel";
import { BaseService } from "@/core/services/baseService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const baseService = new BaseService();

export const fetchLastEntries = createAsyncThunk<
    BaseResponseModel<LastEntryModel[]>
>('entries/fetchLastEntries', async () => {
    const response = await baseService.get<LastEntryModel[]>('/Entry/GetLastEntries');
    return response;
});

export const fetchUserCount = createAsyncThunk<number | null>(
    "users/fetchUserCount",
    async () => {
        const response = await fetch("https://hipocapp.com/api/user/GetUserCount");
        const text = await response.text();
        const count = Number(text);
        return count;
    }
);

export const fetchUsersCountByDegreeId = createAsyncThunk<number[]>(
    "api/users/fetchUsersCountByDegreeId",
    async () => {
        const res = await fetch("https://hipocapp.com/api/user/GetUsersCountByDegreeId");
        const data: number[] = await res.json();
        return data;
    }
);


export const deleteEntry = createAsyncThunk(
    'entries/deleteEntry',
    async (entryId: number) => {

        const response = await baseService.delete<BaseResponseModel<null>>(
            'api/entry/DeleteEntry',
            { params: { id: entryId } }
        );
        return response;
    }
);

export const fetchContent = createAsyncThunk<
    BaseResponseModel<ContentModel[]>,
    string
>(
    "content/fetchContent",
    async (apiUrl) => {
        const response = await baseService.get<ContentModel[]>(apiUrl);
        return response;
    }
);

export const updateContent = createAsyncThunk<
    BaseResponseModel<ContentModel>,
    { url: string; data: ContentModel },
    { rejectValue: string }
>(
    "content/updateContent",
    async ({ url, data }) => {
        const formData = new FormData();
        formData.append("id", data.id.toString());
        formData.append("title", data.title);
        formData.append("link", data.link);
        formData.append("description", data.description);
        formData.append("imageURL", data.imageURL ?? "");
        if (data.image) {
            formData.append("image", data.image);
        }
        const response = await baseService.put(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const typedResponse = response as BaseResponseModel<ContentModel>;
        return typedResponse;
    }
);

export const deleteContent = createAsyncThunk<
    BaseResponseModel<ContentModel>,
    { apiUrl: string; id: number }
>(
    "content/deleteContent",
    async ({ apiUrl, id }) => {
        const response = await baseService.delete<ContentModel>(
            `${apiUrl}/Delete?id=${id}`
        );
        return response;
    }
);


export const addContent = createAsyncThunk<
    BaseResponseModel<ContentModel>,
    { apiUrl: string; data: ContentModel }
>(
    "content/add",
    async ({ apiUrl, data }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("link", data.link);
        formData.append("imageURL", "ImageURL");
        formData.append("image", data.image!);
        const response = await baseService.post<FormData, ContentModel>(apiUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
    }
);

export const fetchEntries = createAsyncThunk<
    BaseResponseModel<PaginationModel<AllEntryModel>>,
    RequestModel
>(
    "entries/fetchList",
    async ({ id, page }) => {
        const url = `/api/entry/GetList?id=${id}&page=${page}`;
        const response = await baseService.get<PaginationModel<AllEntryModel>>(url);
        return response;
    }
);

export const deleteAllEntry = createAsyncThunk(
    'entry/deleteAllEntry',
    async (entryId: number) => {

        const response = await baseService.delete<BaseResponseModel<null>>(
            'api/entry/DeleteEntry',
            { params: { id: entryId } }
        );
        return response;
    }
);

export const fetchUserList = createAsyncThunk<
    BaseResponseModel<PaginationModel<UserDataModel>>,
    { apiUrl: string, data: RequestModel }
>(
    "users/fetchList",
    async ({ apiUrl, data }) => {
        const url = `${apiUrl}?id=${data.id}&page=${data.page}`;
        const response = await baseService.get<PaginationModel<UserDataModel>>(url);
        return response;
    }
);

export const deleteUser = createAsyncThunk(
    'api/user/Delete',
    async (model: RequestModel) => {
        const response = await baseService.delete<BaseResponseModel<null>>(
            'api/user/Delete',
            { params: { id: model.id } }
        );
        return response;
    }
);

export const updateUser = createAsyncThunk<
    BaseResponseModel<UserDataModel>,
    UserDataModel
>(
    'user/update',
    async (userModel) => {
        const formData = new FormData();
        for (const key in userModel) {
            const value = userModel[key as keyof UserDataModel];
            if (value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        }
        const response = await baseService.put<FormData, UserDataModel>(
            '/api/user/Edit',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response;
    }
);

export const updateUserStatus = createAsyncThunk<
    BaseResponseModel<UserDataModel>,
    number
>(
    'user/updateStatus',
    async (userId) => {
        const response = await baseService.post<null, UserDataModel>(
            `/api/user/UserUpdateStatus?userId=${userId}`,
            null
        );
        return response;
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: adminPanelModelState,
    reducers: {
        clearMessage(state) {
            state.message = "";
        },
        setContent(state, action: PayloadAction<ContentModel[]>) {
            state.content = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchLastEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLastEntries.fulfilled, (state, action) => {
                state.loading = false;
                state.lastEntries = action.payload.data ?? null;
            })
            .addCase(fetchLastEntries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(fetchUserCount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserCount.fulfilled, (state, action) => {
                state.loading = false;
                state.userCount = action.payload ?? 0;
            })
            .addCase(fetchUserCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(fetchUsersCountByDegreeId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersCountByDegreeId.fulfilled, (state, action) => {
                state.loading = false;
                state.degrees = action.payload ?? null;
            })
            .addCase(fetchUsersCountByDegreeId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(deleteEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message!;
                if (state.lastEntries) {
                    const deletedEntryId = action.meta.arg;
                    state.lastEntries = state.lastEntries.filter(
                        (entry) => entry.id !== deletedEntryId
                    );
                }
            })
            .addCase(deleteEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.loading = false;
                state.content = action.payload.data ?? [];
            })
            .addCase(fetchContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string ?? "Bir hata oluştu.";
            })

            .addCase(updateContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateContent.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message!;
                const updatedContent = action.payload.data;
                if (!updatedContent) return;
                state.content = state.content!.map(c =>
                    c.id === updatedContent.id ? { ...c, ...updatedContent } : c
                );
            })
            .addCase(updateContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Güncelleme başarısız";
            })

            .addCase(deleteContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteContent.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message!;

                const deletedContentId = action.meta.arg.id;
                if (state.content) {
                    state.content = state.content.filter(
                        (c) => c.id !== deletedContentId
                    );
                }
            })
            .addCase(deleteContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string ?? "Bir hata oluştu.";
            })
            .addCase(addContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addContent.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.content.push(action.payload.data);
                }
            })
            .addCase(addContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEntries.fulfilled, (state, action) => {
                state.loading = false;
                state.allEntries = action.payload.data;
            })
            .addCase(fetchEntries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Veri alınamadı";
            })

            .addCase(deleteAllEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAllEntry.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.meta.arg;
                if (state.allEntries?.items) {
                    state.allEntries.items = state.allEntries.items.filter(
                        entry => entry.id !== deletedId
                    );
                }
            })
            .addCase(deleteAllEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Silme işlemi başarısız';
            })

            .addCase(fetchUserList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload.data;
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Beklenmeyen bir hata oluştu.";
            })

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                const userId = action.meta.arg.id;
                if (state.allUsers?.items) {
                    state.allUsers.items = state.allUsers.items.filter(
                        user => user.id !== userId
                    );
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Silme işlemi başarısız';
            })

            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<BaseResponseModel<UserDataModel>>) => {
                state.loading = false;
                if (action.payload.success && action.payload.data) {
                    const updatedUser = action.payload.data;
                    if (state.allUsers?.items) {
                        state.allUsers.items = state.allUsers.items.map((user) =>
                            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
                        );
                    }
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Kullanıcı güncellenemedi';
            })

            .addCase(updateUserStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserStatus.fulfilled, (state, action: PayloadAction<BaseResponseModel<UserDataModel>>) => {
                state.loading = false;
                if (action.payload.success && action.payload.data && state.allUsers?.items) {
                    const updatedUser = action.payload.data;
                    state.allUsers.items = state.allUsers.items.filter(user => user.id !== updatedUser.id);
                }
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Kullanıcı durumu güncellenemedi';
            });
    }
})

export const { clearMessage, setContent } = adminSlice.actions;
export default adminSlice.reducer; 
