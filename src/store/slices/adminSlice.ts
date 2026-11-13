import hubService from "@/core/hubService/hubService";
import { BaseResponseModel, LastEntryModel, UserLoginModel, userLoginModelState } from "@/core/models";
import { GroupModel } from "@/core/models/chatMessage/messageModel";
import { ContentModel } from "@/core/models/content/contentModel";
import { AllEntryModel } from "@/core/models/entries/allEntriesModel";
import { GetGroupsMemberRequest } from "@/core/models/groupMemberRequest/groupMemberRequestModel";
import { ModuleRoleModel } from "@/core/models/ModuleRole/modulRoleModel";
import { PaginationModel } from "@/core/models/pagination/paginationModel";
import { adminPanelModelState } from "@/core/models/panel/initialPanelModel";
import { RequestModel } from "@/core/models/request/requestModel";
import { RoleDTO } from "@/core/models/role/roleModel";
import { RoleModelResponse } from "@/core/models/RoleModel/roleModulModel";
import { UserDataModel } from "@/core/models/user/userDataModel";
import { BaseService } from "@/core/services/baseService";
import { Endpoints } from "@/Utilities/enums/Endpoints";
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
        const response = await baseService.get<number>("api/user/GetUserCount");
        return Number(response);
    }
);

export const fetchUsersCountByDegreeId = createAsyncThunk<number[]>(
    "api/users/fetchUsersCountByDegreeId",
    async () => {
        const res = await baseService.get<number[]>("api/user/GetUsersCountByDegreeId");
        return res as unknown as number[];
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
    Partial<UserDataModel>
>(
    'user/update',
    async (userModel) => {
        const formData = new FormData();
        const fieldsToSend: (keyof UserDataModel)[] = [
            'id',
            'userName',
            'name',
            'surname',
            'email',
            'identityNumber'
        ];

        fieldsToSend.forEach((key) => {
            const value = userModel[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        });

        formData.append("Password", "a");
        formData.append("PasswordRe", "a");

        const response = await baseService.post<FormData, UserDataModel>(
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

export const registerUser = createAsyncThunk<
    BaseResponseModel<UserDataModel>,
    FormData,
    { rejectValue: string }
>(
    "register/registerUser",
    async (formData) => {
        const response = await baseService.post<FormData, UserDataModel>(
            "api/user/Register",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response;
    }
);


export const fetchRoles = createAsyncThunk<
    BaseResponseModel<RoleDTO[]>
>(
    "roles/fetchRoles",
    async () => {
        const url = Endpoints.GetRoles;
        const response = await baseService.get<RoleDTO[]>(url);
        return response;
    }
);

export const createRole = createAsyncThunk<
    BaseResponseModel<RoleDTO>,
    RoleDTO
>(
    "roles/createRole",
    async (role) => {
        const url = `${Endpoints.CreateRole}`;
        const response = await baseService.post<RoleDTO, RoleDTO>(url, role);
        return response;

    }
);

export const editRole = createAsyncThunk<
    BaseResponseModel<RoleDTO>,
    RoleDTO
>(
    "roles/editRole",
    async (role) => {
        const url = Endpoints.UpdateRole;
        const response = await baseService.put<RoleDTO, RoleDTO>(url, role);
        return response;
    }
);

export const deleteRole = createAsyncThunk(
    'role/Delete',
    async (model: RequestModel) => {
        const url = Endpoints.DeleteRole;
        const response = await baseService.delete<BaseResponseModel<null>>(
            url,
            { params: { id: model.id } }
        );
        return response;
    }
);

export const fetchModuleRole = createAsyncThunk<
    RoleModelResponse,
    number
>(
    "moduleRole/fetchModuleRole",
    async (roleId: number) => {
        const response = await baseService.get<RoleModelResponse>(Endpoints.RolAuthentication, { id: roleId });
        return response as unknown as RoleModelResponse;
    }
);

export const fetchGroupsMemberRequest = createAsyncThunk<
    BaseResponseModel<PaginationModel<GetGroupsMemberRequest>>,
    { data: RequestModel }
>(
    "chat/groupMemberRequests",
    async ({ data }) => {
        const url = `${Endpoints.GetGroupsMemberRequest}?id=${data.id}&page=${data.page}`;
        const response = await baseService.get<PaginationModel<GetGroupsMemberRequest>>(url);
        return response;
    }
);

export const fetchApprovedGroupsMemberRequest = createAsyncThunk<
    BaseResponseModel<PaginationModel<GetGroupsMemberRequest>>,
    { data: RequestModel }
>(
    "chat/groupApprovedMemberRequests",
    async ({ data }) => {
        const url = `${Endpoints.GetGroupsApprovedMemberRequest}?id=${data.id}&page=${data.page}`;
        const response = await baseService.get<PaginationModel<GetGroupsMemberRequest>>(url);
        return response;
    }
);

export const updateRquestState = createAsyncThunk<
    BaseResponseModel<GetGroupsMemberRequest>,
    GetGroupsMemberRequest
>(
    "chat/updateRquestState",
    async (data) => {
        const url = `${Endpoints.UpdateRquestState}`;
        const response = await baseService.put<GetGroupsMemberRequest, GetGroupsMemberRequest>(url, data);
        return response;
    }
);

export const createGroup = createAsyncThunk<
    BaseResponseModel<GroupModel>,
    GroupModel
>(
    "chat/createGroup",
    async (data) => {
        const url = `${Endpoints.CreateGroup}`;
        await hubService.startConnection();
        await hubService.invoke("CreateGroup", data.groupName);
        const response = await baseService.post<GroupModel, GroupModel>(url, data);
        return response;
    }
);

export const fetchGetGroups = createAsyncThunk<
    BaseResponseModel<GroupModel[]>>
    ("get/groups", async () => {
        const resp = await baseService.get<GroupModel[]>(`${Endpoints.GetGroups}`)
        return resp;
    });

export const deleteMemberFromGroup = createAsyncThunk<
    { groupId: number; userId: number },
    { groupId: number; userId: number },
    { rejectValue: string }
>(
    "chat/deleteMemberFromGroup",
    async ({ groupId, userId }, { rejectWithValue }) => {
        if (!groupId || !userId) {
            return rejectWithValue("Geçersiz grup veya kullanıcı ID.");
        }
        const res = await baseService.delete<{ isSuccess: boolean; message?: string }>(
            "/api/chat/DeleteMemberFromGroup",
            { params: { groupId, userId } }
        );
        if (!res || !res.isSuccess) {
            return rejectWithValue(res?.message || "Kullanıcı gruptan çıkarılamadı.");
        }

        return { groupId, userId };
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
                state.message = action.payload.message ?? "Bir hata gerçekleşti.";
                if (!action.payload) {
                    return;
                }
                if (!action.payload.data) {
                    return;
                }
                const updatedUser = action.payload.data;
                if (!state.allUsers) {
                    return;
                }
                const index = state.allUsers.items.findIndex(u => Number(u.id) === Number(updatedUser.id));
                if (index === -1) {
                    return;
                }
                const newItems = [
                    ...state.allUsers.items.slice(0, index),
                    { ...state.allUsers.items[index], ...updatedUser },
                    ...state.allUsers.items.slice(index + 1)
                ];
                state.allUsers = { ...state.allUsers, items: newItems };
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
                if (action.payload.isSuccess && action.payload.data && state.allUsers?.items) {
                    const updatedUser = action.payload.data;
                    state.allUsers.items = state.allUsers.items.filter(user => user.id !== updatedUser.id);
                }
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Kullanıcı durumu güncellenemedi';
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message ?? "Bir hata oluştu!";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Kayıt başarısız oldu.";
            })

            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.data ?? null;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(createRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message ?? "Bir hata oluştu.";
                if (action.payload.data && state.roles) {
                    state.roles.push(action.payload.data);
                }
            })
            .addCase(createRole.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? "Bir hata oluştu";
            })

            .addCase(editRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editRole.fulfilled, (state, action) => {
                state.loading = false;
                const updatedRole = action.payload.data;
                if (updatedRole) {
                    const index = state.roles!.findIndex((r) => r.id === updatedRole.id);
                    if (index !== -1) {
                        state.roles![index] = updatedRole;
                    }
                }
            })
            .addCase(editRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                const roleId = action.meta.arg.id;
                if (state.roles) {
                    state.roles = state.roles.filter(
                        role => role.id !== roleId
                    );
                }
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Silme işlemi başarısız';
            })

            .addCase(fetchModuleRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModuleRole.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleRoles = action.payload ?? null;
            })
            .addCase(fetchModuleRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(fetchGroupsMemberRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroupsMemberRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingGroupMemberRequest = action.payload.data;
            })
            .addCase(fetchGroupsMemberRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(fetchApprovedGroupsMemberRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApprovedGroupsMemberRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.approvedGroupMemberRequest = action.payload.data;

            })
            .addCase(fetchApprovedGroupsMemberRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(updateRquestState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRquestState.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message ?? "İşlem Başarısız";

                const updatedItem = action.payload.data;

                if (updatedItem && state.pendingGroupMemberRequest?.items) {
                    state.pendingGroupMemberRequest.items = state.pendingGroupMemberRequest.items.filter(
                        item => item.id !== updatedItem.id
                    );
                }
            })

            .addCase(updateRquestState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })


            .addCase(fetchGetGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGetGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload.data;

            })
            .addCase(fetchGetGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(createGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false;
                const newGroup = action.meta.arg;

                if (newGroup) {
                    state.groups = [...(state.groups ?? []), newGroup];
                }
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

            .addCase(deleteMemberFromGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMemberFromGroup.fulfilled, (state, action) => {
                state.loading = false;

                const { groupId, userId } = action.payload;

                if (state.approvedGroupMemberRequest?.items) {
                    state.approvedGroupMemberRequest.items = state.approvedGroupMemberRequest.items.filter(
                        (item: GetGroupsMemberRequest) => !(item.groupId === groupId && item.userId === userId)
                    );
                }

            })
            .addCase(deleteMemberFromGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Bir hata oluştu.";
            })

    }
})

export const { clearMessage, setContent } = adminSlice.actions;
export default adminSlice.reducer; 
