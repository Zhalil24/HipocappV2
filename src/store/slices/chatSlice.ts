import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BaseService } from '../../core/services/baseService';
import { UserDataModel } from '@/core/models/user/userDataModel';
import { chatModelInitialState, InitialChatModel } from '@/core/models/chat/chatModel';
import { SignalRService } from '@/core/hubService/hubService';
import { AddGroupMemberDto, GroupMemberDto, GroupMessageModel, GroupModel, MarkMessageModel, MessageModel, UnreadCountItem } from '@/core/models/chatMessage/messageModel';

const baseService = new BaseService();
const hubService = new SignalRService();

type ThunkConfig = { rejectValue: string };

export const fetchUsers = createAsyncThunk<UserDataModel[], void, ThunkConfig>(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        const res = await baseService.get<UserDataModel[]>('/api/user/all');
        if (!Array.isArray(res)) {
            return rejectWithValue('Kullanıcılar alınamadı');
        }
        return res;
    }
);

export const startConnection = createAsyncThunk<void, number, ThunkConfig>(
    "chat/startConnection",
    async (userId, { dispatch, rejectWithValue }) => {
        await hubService.startConnection();
        const initial = await hubService.invoke("GetOnlineUsers");
        if (Array.isArray(initial)) {
            dispatch(setOnlineUsers(initial.map((e: any) => Number(e)).filter((n: number) => !isNaN(n))));
        }
        hubService.off?.("UserConnected");
        hubService.off?.("UserDisconnected");
        hubService.on("UserConnected", (connectedUserId: number) => {
            dispatch(userConnected(Number(connectedUserId)));
        });
        hubService.on("UserDisconnected", (disconnectedUserId: number) => {
            dispatch(userDisconnected(Number(disconnectedUserId)));
        });
        hubService.off("ReceivePrivateMessage");
        hubService.on("ReceivePrivateMessage", (msg: MessageModel) => {
            dispatch(addIncomingMessage(msg));
        });
        hubService.off("ReceiveGroupMessage");
        hubService.on("ReceiveGroupMessage", (raw: any) => {
            dispatch(addIncomingMessageGroup({ ...raw, sentAt: raw?.sentOn ?? new Date().toISOString() }));
        });
        hubService.onReconnected(async () => {
            const res = await hubService.invoke("GetOnlineUsers");
            if (Array.isArray(res)) dispatch(setOnlineUsers(res.map(Number)));
        });
    }
);

export const disconnectUser =
    (_userId: number) => async () => {
        await hubService.stopConnection();
    };


export const joinGroup = createAsyncThunk<void, { groupId: number }, ThunkConfig>(
    "chat/joinGroup",
    async ({ groupId }, { rejectWithValue }) => {
        try {
            await hubService.joinGroup(groupId);
        } catch (err) {
            return rejectWithValue("JoinGroup failed");
        }
    }
);

export const getOnlineUsers = createAsyncThunk<number[], void, ThunkConfig>(
    "chat/getOnlineUsers",
    async (_, { rejectWithValue }) => {
        const result = await hubService.invoke("GetOnlineUsers");
        const users = Array.isArray(result)
            ? result.map((e) => Number(e)).filter((e) => !isNaN(e))
            : [];
        return users;
    }
);

export const sendPrivateMessage = createAsyncThunk<
    void,
    { toUserId: number; message: MessageModel },
    { rejectValue: string }
>(
    "chat/sendPrivateMessage",
    async ({ toUserId, message }, { dispatch, rejectWithValue }) => {
        // The server saves the message before delivering it and answers with the saved copy.
        const saved = await hubService.invoke<MessageModel>("SendPrivateMessage", Number(toUserId), String(message.messageText ?? ""));
        if (!saved) {
            return rejectWithValue("Mesaj gönderilemedi.");
        }
        dispatch(addOutgoingMessage(saved));
    }
);

export const sendGroupMessage = createAsyncThunk<
    void,
    { groupId: number; messageText: string },
    { rejectValue: string }
>(
    "chat/sendGroupMessage",
    async ({ groupId, messageText }, { rejectWithValue }) => {
        // The server sends the saved message back to every member, this device included.
        const saved = await hubService.invoke("SendGroupMessage", groupId, messageText);
        if (!saved) {
            return rejectWithValue("Mesaj gönderilemedi.");
        }
    }
);
export const fetchGroupMessages = createAsyncThunk<
    { groupId: number; items: GroupMessageModel[] },
    number,
    { rejectValue: string }
>(
    "chat/fetchGroupMessages",
    async (groupId, { rejectWithValue }) => {
        const res = await baseService.get<any[]>(
            `api/chat/GroupMessagesList?groupId=${groupId}`
        );
        if (!res?.isSuccess || !res?.data) {
            return rejectWithValue(res?.message || "Grup mesajları alınamadı.");
        }
        const items: GroupMessageModel[] = res.data.map(m => ({
            ...m,
            messageText: String(m.messageText ?? ""),
            sentAt: typeof m.sentOn === "string"
                ? m.sentOn
                : new Date(m.sentOn ?? "").toISOString(),
        }));
        return { groupId, items };
    }
);



export const fetchConversationMessages = createAsyncThunk<
    MessageModel[],
    { fromUserId: number; toUserId: number },
    { rejectValue: string }
>(
    "chat/fetchConversationMessages",
    async ({ fromUserId, toUserId }, { rejectWithValue }) => {
        const res = await baseService.get<MessageModel[] | string>(
            "/api/chat/MessageList",
            { fromUserId, toUserId }
        );
        const container: any = res ?? {};
        const ok =
            container.isSuccess === true ||
            container.IsSuccess === true ||
            container.resultType === 0 ||
            typeof container.data !== "undefined" ||
            typeof container.Data !== "undefined";

        const rawPayload = container.data ?? container.Data;
        const arr = typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
        const list: MessageModel[] = arr.map((m: any) => ({
            id: m.Id ?? m.id ?? null,
            fromUserId: (m.FromUserId ?? m.fromUserId ?? null) as number | null,
            toUserId: (m.ToUserId ?? m.toUserId) as number,
            messageText: m.MessageText ?? m.messageText ?? m.Text ?? "BOŞŞ",
            sentAt:
                typeof (m.SentAt ?? m.sentAt) === "string"
                    ? (m.SentAt ?? m.sentAt)
                    : new Date(m.SentAt ?? m.sentAt).toISOString(),
            isRead: (m.IsRead ?? m.isRead ?? null) as boolean | null,
        }));
        list.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
        return list;
    }
);


export const fetchLastMessages = createAsyncThunk<
    MessageModel[],
    { userId: number },
    { rejectValue: string }
>(
    "chat/fetchLastMessages",
    async ({ userId }, { rejectWithValue }) => {
        const res = await baseService.get<MessageModel[]>("/api/chat/LastMessages", { userId });

        if (!res?.isSuccess || !Array.isArray(res.data)) {
            return rejectWithValue(res?.message || "Son mesajlar alınamadı");
        }
        const list: MessageModel[] = res.data.map((m: any) => ({
            id: m.id ?? m.Id ?? null,
            fromUserId: Number(m.fromUserId ?? m.FromUserId ?? null),
            toUserId: Number(m.toUserId ?? m.ToUserId ?? null),
            messageText: String(m.messageText ?? m.MessageText ?? ""),
            sentAt:
                typeof (m.sentAt ?? m.SentAt) === "string"
                    ? (m.sentAt ?? m.SentAt)
                    : new Date(m.sentAt ?? m.SentAt ?? Date.now()).toISOString(),
            isRead: Boolean(m.isRead ?? m.IsRead ?? false),
        }));
        list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        return list;
    }
);


export const fetchUnreadCounts = createAsyncThunk<
    Record<number, number>,
    { userId: number },
    { rejectValue: string }
>(
    "chat/fetchUnreadCounts",
    async ({ userId }, { rejectWithValue }) => {
        const res = await baseService.get<UnreadCountItem[]>(
            "/api/chat/GetUnreadMessagesForUser",
            { userId }
        );

        if (!res?.isSuccess || !res.data) {
            return rejectWithValue(res?.message || "Okunmamış sayıları alınamadı");
        }
        const arr = Array.isArray(res.data) ? res.data : [res.data];
        const map: Record<number, number> = {};
        for (const it of arr) {
            const id = Number((it as any).fromUserId ?? (it as any).FromUserId);
            const cnt = Number((it as any).count ?? (it as any).Count ?? 0);
            if (!Number.isNaN(id) && id > 0) map[id] = cnt;
        }
        return map;
    }
);

export const markMessagesAsRead = createAsyncThunk<
    MarkMessageModel,
    MarkMessageModel,
    { rejectValue: string }
>(
    "chat/markMessagesAsRead",
    async ({ fromUserId, toUserId }, { rejectWithValue }) => {
        const res = await baseService.put<MarkMessageModel, void>(
            "/api/chat/MarkMessagesAsRead",
            { fromUserId, toUserId }
        );
        if (!res?.isSuccess) {
            return rejectWithValue(res?.message ?? "Mesajlar okundu olarak işaretlenemedi");
        }
        return { fromUserId, toUserId };
    }
);

export const fetchGroups = createAsyncThunk<
    GroupModel[],
    { userId: number },
    { rejectValue: string }
>(
    "chat/fetchGroups",
    async ({ userId }, { rejectWithValue }) => {
        const res = await baseService.get<any>("/api/chat/GetGroups", { userId });

        const data = Array.isArray(res) ? res : (res?.data ?? null);
        if (!data) {
            return rejectWithValue(res?.message ?? "Gruplar alınamadı");
        }

        const arr = Array.isArray(data) ? data : [data];
        return arr.map((g: any) => ({
            id: Number(g.id ?? g.Id),
            groupName: g.groupName ?? g.GroupName ?? "",
            createdOn: String(g.createdOn ?? g.CreatedOn ?? ""),
            members: ((g.members ?? g.Members) ?? []).map((m: any) => ({
                groupId: Number(m.groupId ?? m.GroupId),
                userId: Number(m.userId ?? m.UserId),
                userName: m.userName ?? m.UserName ?? undefined,
                joinedOn: String(m.joinedOn ?? m.JoinedOn ?? ""),
            })),
        })) as GroupModel[];
    }
);

export const deleteGroup = createAsyncThunk<
    { groupId: number; message: string },
    { groupId: number },
    { rejectValue: string }
>(
    "chat/deleteGroup",
    async ({ groupId }, { rejectWithValue }) => {
        if (!groupId || groupId <= 0) {
            return rejectWithValue("Geçersiz grup ID.");
        }
        const res = await baseService.delete<any>(`/api/chat/DeleteGroup?groupId=${groupId}`);
        const ok = res?.isSuccess ?? false;
        if (!ok) {
            return rejectWithValue(res?.message || "Grup silinemedi.");
        }
        return { groupId, message: res.message! };
    }
);

export const fetchGroupMembers = createAsyncThunk<
    { groupId: number; members: GroupMemberDto[] },
    { groupId: number },
    { rejectValue: string }
>(
    "chat/fetchGroupMembers",
    async ({ groupId }, { rejectWithValue }) => {
        if (!groupId || groupId <= 0) {
            return rejectWithValue("Geçersiz grup ID.");
        }
        const res = await baseService.get<GroupMemberDto[]>(
            "/api/chat/GetGroupMembers",
            { groupId }
        );

        const ok = res?.isSuccess ?? false;
        if (!ok || !res.data) {
            return rejectWithValue(res?.message || "Grup üyeleri alınamadı.");
        }

        return { groupId, members: res.data };
    }
);

export const addMembersToGroup = createAsyncThunk<
    { groupId: number; userIds: number[]; message: string },
    { groupId: number; userIds: number[] },
    { rejectValue: string }
>(
    "chat/addMembersToGroup",
    async ({ groupId, userIds }, { rejectWithValue }) => {
        if (!groupId || groupId <= 0 || !userIds?.length) {
            return rejectWithValue("Geçersiz grup veya kullanıcı bilgileri.");
        }
        const payload = { groupId, userId: userIds };
        const res = await baseService.post<AddGroupMemberDto, AddGroupMemberDto>("/api/chat/AddMembersToGroup", payload);
        const ok = res?.isSuccess ?? false;
        if (!ok) {
            return rejectWithValue(res?.message || "Üyeler eklenemedi.");
        }
        return { groupId, userIds, message: res?.message || "Üyeler başarıyla eklendi." };
    }
);

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
        if (!res || !(res as any).isSuccess) {
            return rejectWithValue(res?.message || "Kullanıcı gruptan çıkarılamadı.");
        }

        return { groupId, userId };
    }
);

export const updateGroup = createAsyncThunk<
    { groupId: number; groupName: string },
    { groupId: number; groupName: string },
    { rejectValue: string }
>(
    "chat/updateGroup",
    async ({ groupId, groupName }, { rejectWithValue }) => {
        if (!groupId || !groupName?.trim()) {
            return rejectWithValue("Geçersiz grup ID veya isim.");
        }

        const res = await baseService.post<
            { groupId: number; groupName: string; userIds: number[] },
            { isSuccess: boolean; message?: string }
        >(
            "/api/chat/UpdateGroup",
            {
                groupId,
                groupName,
                userIds: []
            }
        );

        if (!res || !(res as any).isSuccess) {
            return rejectWithValue(res?.message || "Grup güncellenemedi.");
        }

        return { groupId, groupName };
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
        setGroups: (state, action: PayloadAction<GroupModel[]>) => {
            state.groups = action.payload;
        },
        setChats: (state, action: PayloadAction<UserDataModel[]>) => {
            state.chats = action.payload;
        },

        userConnected: (state, action: PayloadAction<number>) => {
            const id = Number(action.payload);
            if (!state.onlineUsers.includes(id)) state.onlineUsers.push(id);
        },
        userDisconnected: (state, action: PayloadAction<number>) => {
            const id = Number(action.payload);
            state.onlineUsers = state.onlineUsers.filter(x => x !== id);
        },
        setOnlineUsers: (state, action: PayloadAction<number[]>) => {
            state.onlineUsers = action.payload.map(Number);
        },

        addIncomingMessage: (state, action: PayloadAction<MessageModel>) => {
            const m = action.payload;
            const peerId = Number(m.fromUserId ?? m.toUserId);
            if (!state.messagesByUser[peerId]) state.messagesByUser[peerId] = [];
            state.messagesByUser[peerId].push(m);
        },
        addOutgoingMessage: (state, action: PayloadAction<MessageModel>) => {
            const m = action.payload;
            const peerId = Number(m.toUserId);
            if (!state.messagesByUser[peerId]) state.messagesByUser[peerId] = [];
            state.messagesByUser[peerId].push(m);
        },

        addIncomingMessageGroup: (state, action: PayloadAction<GroupMessageModel>) => {
            const m = action.payload;
            if (!state.messageByGroup[m.groupId]) state.messageByGroup[m.groupId] = [];
            state.messageByGroup[m.groupId].push(m);
        },
        addOutgoingMessageGroup: (state, action: PayloadAction<GroupMessageModel>) => {
            const m = action.payload;
            if (!state.messageByGroup[m.groupId]) state.messageByGroup[m.groupId] = [];
            state.messageByGroup[m.groupId].push(m);
        },


        clearUnreadForUser(state, action: PayloadAction<number>) {
            const id = action.payload;
            const curr = state.unreadCounts ?? {};
            state.unreadCounts = { ...curr, [id]: 0 };
        },
        markPartnerMsgsReadLocal(state, action: PayloadAction<number>) {
            const fromId = action.payload;
            const list = state.messagesByUser?.[fromId] ?? [];
            for (const m of list) {
                if (Number(m.fromUserId) === fromId) m.isRead = true;
            }
        },
        removeGroupLocal: (state, action) => {
            const gid = action.payload as number;
            state.groups = (state.groups ?? []).filter(g => Number(g.id) !== gid);
            if (state.messageByGroup && gid in state.messageByGroup) {
                delete state.messageByGroup[gid];
            }
        },
        clearGroupMembers(state, action) {
            const gid = Number(action.payload);
            delete state.groupMembersByGroup[gid];
            delete state.groupMembersLoadingByGroup[gid];
            delete state.groupMembersErrorByGroup[gid];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteGroup.fulfilled, (state, action) => {
                const { groupId } = action.payload;
                state.groups = (state.groups ?? []).filter(g => Number(g.id) !== Number(groupId));
                if (state.messageByGroup && groupId in state.messageByGroup) {
                    delete state.messageByGroup[groupId];
                }
            })

            .addCase(deleteMemberFromGroup.fulfilled, (state, action) => {
                const { groupId, userId } = action.payload;
                const members = state.groupMembersByGroup[groupId] ?? [];
                state.groupMembersByGroup[groupId] = members.filter(m => Number(m.userId) !== Number(userId));
            })
            .addCase(fetchGroupMembers.pending, (state, action) => {
                const gid = action.meta.arg.groupId;
                state.groupMembersLoadingByGroup[gid] = true;
                state.groupMembersErrorByGroup[gid] = null;
            })
            .addCase(fetchGroupMembers.fulfilled, (state, action) => {
                const { groupId, members } = action.payload;
                state.groupMembersLoadingByGroup[groupId] = false;
                state.groupMembersByGroup[groupId] = members;
                state.groupMembersErrorByGroup[groupId] = null;
            })
            .addCase(fetchGroupMembers.rejected, (state, action) => {
                const gid = action.meta.arg.groupId;
                state.groupMembersLoadingByGroup[gid] = false;
                state.groupMembersErrorByGroup[gid] = action.payload || "Grup üyeleri alınamadı.";
            })

            .addCase(addMembersToGroup.pending, (state, action) => {
                const gid = action.meta.arg.groupId;
                state.addMembersLoadingByGroup![gid] = true;
                state.addMembersErrorByGroup![gid] = null;
            })
            .addCase(addMembersToGroup.fulfilled, (state, action) => {
                const { groupId, userIds } = action.payload;
                state.addMembersLoadingByGroup![groupId] = false;
                state.addMembersErrorByGroup![groupId] = null;

                const now = new Date().toISOString();
                const current = state.groupMembersByGroup[groupId] ?? [];

                const users = state.users ?? [];
                const getName = (id: number) => {
                    const u: any = users.find((x: any) => Number(x.id) === Number(id));
                    return u?.username ?? u?.userName ?? u?.name ?? null;
                };

                const existingIds = new Set(current.map((m) => Number(m.userId)));
                const toAdd: GroupMemberDto[] = userIds
                    .filter((uid) => !existingIds.has(Number(uid)))
                    .map((uid) => ({
                        groupId,
                        userId: Number(uid),
                        userName: getName(Number(uid)),
                        joinedOn: now,
                    }));

                state.groupMembersByGroup[groupId] = [...current, ...toAdd];
            })
            .addCase(addMembersToGroup.rejected, (state, action) => {
                const gid = action.meta.arg.groupId;
                state.addMembersLoadingByGroup![gid] = false;
                state.addMembersErrorByGroup![gid] =
                    action.payload || "Üyeler eklenemedi.";
            })

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
            })

            .addCase(startConnection.pending, (state) => {
                state.connecting = true;
                state.connected = false;
            })
            .addCase(startConnection.fulfilled, (state) => {
                state.connecting = false;
                state.connected = true;
            })
            .addCase(startConnection.rejected, (state, action) => {
                state.connecting = false;
                state.connected = false;
                state.error = action.payload ?? "Bağlantı başarısız";
            })

            .addCase(getOnlineUsers.fulfilled, (state, action: PayloadAction<number[] | undefined>) => {
                state.onlineUsers = action.payload ?? [];
            })

            .addCase(getOnlineUsers.rejected, (state, action) => {
                state.error = action.payload ?? "Online kullanıcı listesi alınamadı";
            })

            .addCase(fetchConversationMessages.fulfilled, (state, action) => {
                const peerId = Number(action.meta.arg.toUserId);
                if (!state.messagesByUser) state.messagesByUser = {};
                state.messagesByUser[peerId] = action.payload;
            })

            .addCase(fetchLastMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLastMessages.fulfilled, (state, action: PayloadAction<MessageModel[]>) => {
                state.loading = false;
                state.lastMessages = action.payload;
            })
            .addCase(fetchLastMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? action.error.message ?? "Son mesajlar alınamadı";
            })


            .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
                state.unreadCounts = action.payload;
            })
            .addCase(fetchUnreadCounts.rejected, (state, action) => {
                state.error = (action.payload as string) ?? action.error.message ?? "Okunmamış sayıları alınamadı";
            })

            .addCase(markMessagesAsRead.fulfilled, (state, action) => {
                const { fromUserId } = action.payload;
                if (state.unreadCounts) {
                    state.unreadCounts[fromUserId] = 0;
                }
            })
            .addCase(markMessagesAsRead.rejected, (state, action) => {
                state.error = action.payload ?? action.error.message ?? "Mesajlar okundu olarak işaretlenemedi";
            })

            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Gruplar alınamadı";
            })

            .addCase(fetchGroupMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroupMessages.fulfilled, (state, action) => {
                state.loading = false;
                const { groupId, items } = action.payload;
                if (!state.messageByGroup) state.messageByGroup = {};
                state.messageByGroup[groupId] = items;
            })
            .addCase(fetchGroupMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Grup mesajları alınamadı";
            });


    },
});

export const { clearMessage, userConnected, clearGroupMembers, userDisconnected, removeGroupLocal, addOutgoingMessageGroup, addIncomingMessageGroup, clearUnreadForUser, markPartnerMsgsReadLocal, setOnlineUsers, addIncomingMessage, addOutgoingMessage } = chatSlice.actions;
export default chatSlice.reducer;
