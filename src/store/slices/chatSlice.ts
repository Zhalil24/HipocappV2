import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BaseService } from '../../core/services/baseService';
import { UserDataModel } from '@/core/models/user/userDataModel';
import { chatModelInitialState, InitialChatModel } from '@/core/models/chat/chatModel';
import { SignalRService } from '@/core/hubService/hubService';
import { GroupMessageModel, GroupModel, MarkMessageModel, MessageModel, UnreadCountItem } from '@/core/models/chatMessage/messageModel';
import { decryptMessage, encryptMessage } from '@/Utilities/helpers/cryptoHelper';

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
        await hubService.invoke("RegisterUser", userId);
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
        hubService.on("ReceivePrivateMessage", (msg: MessageModel) => {
            const decryptedText = decryptMessage(msg.messageText);
            dispatch(addIncomingMessage({
                ...msg,
                messageText: decryptedText
            }));
        });
        hubService.off("ReceiveMessageForGroupClients");
        hubService.on("ReceiveMessageForGroupClients", (payload: any) => {
            const raw = typeof payload === "string" ? JSON.parse(payload) : payload;
            const candidate = raw?.sentAt ?? raw?.sentOn ?? null;
            const parsed = (typeof candidate === "string" || typeof candidate === "number")
                ? Date.parse(candidate as any) : NaN;
            const safeSentAt = Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
            const decryptedText = decryptMessage(raw?.messageText ?? "");
            const normalized = {
                ...raw,
                messageText: decryptedText,
                sentAt: safeSentAt,
            };
            dispatch(addIncomingMessageGroup(normalized));
        });
        hubService.on?.("reconnected", async () => {
            const res = await hubService.invoke("GetOnlineUsers");
            if (Array.isArray(res)) dispatch(setOnlineUsers(res.map(Number)));
        });
    }
);

export const joinGroupMobil = createAsyncThunk<
    void,
    { groupName: string },
    ThunkConfig
>(
    "chat/joinGroupMobil",
    async ({ groupName }, { dispatch, rejectWithValue }) => {
        try {
            await hubService.startConnection();
            await hubService.invoke("JoinGroupMobil", groupName);
        } catch (err) {
            console.error("[SR] JoinGroupMobil failed:", err);
            return rejectWithValue("JoinGroupMobil failed");
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
        if (users.length > 0) {
            console.log("Online kullanıcı id'leri:", users);
        } else {
            console.log("Şu anda online kullanıcı yok.");
        }
        return users;
    }
);

export const sendPrivateMessage = createAsyncThunk<
    void,
    { toUserId: number; message: MessageModel }
>(
    "chat/sendPrivateMessage",
    async ({ toUserId, message }, { dispatch, rejectWithValue }) => {
        const fromId = Number(message.fromUserId);
        const toIdInMsg = Number(message.toUserId ?? toUserId);
        if (!fromId || !toIdInMsg || !toUserId) {
            return rejectWithValue("Geçersiz kullanıcı bilgisi (from/to).");
        }
        const encryptedText = encryptMessage(String(message.messageText ?? ""));

        const serverMessage = {
            Id: message.id ?? 0,
            FromUserId: fromId,
            ToUserId: toIdInMsg,
            MessageText: encryptedText,
            SentAt: new Date(message.sentAt).toISOString(),
            IsRead: Boolean(message.isRead ?? false),
        };

        dispatch(addOutgoingMessage(message));
        await hubService.invoke("SendPrivateMessage", Number(toUserId), serverMessage);
    }
);

export const sendGroupMessageSave = createAsyncThunk<
    GroupMessageModel,
    GroupMessageModel,
    { rejectValue: string }
>(
    "chat/sendGroupMessage",
    async (payload, { rejectWithValue }) => {
        // Gönderirken şifrele
        const body: GroupMessageModel = {
            ...payload,
            messageText: encryptMessage(String(payload.messageText ?? "")),
        };
        const res = await baseService.post<GroupMessageModel, GroupMessageModel>(
            "/api/chat/GroupMessageSave",
            body
        );
        if (!res?.success || !res.data) {
            return rejectWithValue(res?.message || "Grup mesajı kaydedilemedi.");
        }
        const saved = res.data;
        return {
            ...saved,
            messageText: decryptMessage(String(saved.messageText ?? "")),
        } as GroupMessageModel;
    }
);

export const sendGroupMessage = createAsyncThunk<
    void,
    { groupName: string; model: GroupMessageModel },
    { rejectValue: string }
>(
    "chat/sendGroupMessage",
    async ({ groupName, model }, { dispatch, rejectWithValue }) => {
        if (!groupName) {
            return rejectWithValue("Geçersiz grup ismi!");
        }
        const jsonString = JSON.stringify({
            fromUserId: model.fromUserId,
            groupId: model.groupId,
            messageText: model.messageText,
            fromUserName: model.fromUserName,
            sentAt: model.sentAt,
        });
        dispatch(addOutgoingMessageGroup(model));
        await hubService.invoke("SendGroupMessage", groupName, jsonString);
        await dispatch(sendGroupMessageSave(model)).unwrap();
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
        if (!res?.success || !res?.data) {
            return rejectWithValue(res?.message || "Grup mesajları alınamadı.");
        }
        const items: GroupMessageModel[] = res.data.map(m => ({
            ...m,
            messageText: decryptMessage(String(m.messageText ?? "")),
            sentAt: typeof m.sentOn === "string"
                ? m.sentOn
                : new Date(m.sentOn ?? "").toISOString(),
        }));
        return { groupId, items };
    }
);



export const saveMessage = createAsyncThunk<
    MessageModel,
    { message: MessageModel },
    { rejectValue: string }
>(
    "chat/saveMessage",
    async ({ message }, { rejectWithValue }) => {
        const iso = message.sentAt
            ? new Date(message.sentAt).toISOString()
            : new Date().toISOString();

        const bodyCamel = {
            ...message,
            messageText: encryptMessage(String(message.messageText ?? "")),
            sentAt: iso,
        };

        const res = await baseService.post<any, typeof bodyCamel>(
            "/api/chat/MessageSave",
            bodyCamel
        );
        if (!res?.success || !res.data) {
            return rejectWithValue(res?.message || "Mesaj kaydedilemedi");
        }
        const saved = res.data;
        const cipherOrPlain =
            saved.messageText ?? saved.messageText ?? "";

        const normalized: MessageModel = {
            id: saved.id ?? saved.id ?? null,
            fromUserId: saved.fromUserId ?? saved.fromUserId ?? null,
            toUserId: saved.toUserId ?? saved.toUserId,
            messageText: decryptMessage(String(cipherOrPlain)),
            sentAt:
                typeof (saved.sentAt ?? saved.sentAt) === "string"
                    ? (saved.sentAt ?? saved.sentAt)
                    : new Date(saved.sentAt ?? saved.sentAt ?? iso).toISOString(),
            isRead: saved.isRead ?? saved.isRead ?? null,
        };
        return normalized;
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
            container.success === true ||
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
            messageText: decryptMessage(m.MessageText ?? m.messageText ?? m.Text ?? "BOŞŞ"),
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

        if (!res?.success || !Array.isArray(res.data)) {
            return rejectWithValue(res?.message || "Son mesajlar alınamadı");
        }
        const list: MessageModel[] = res.data.map((m: any) => ({
            id: m.id ?? m.Id ?? null,
            fromUserId: Number(m.fromUserId ?? m.FromUserId ?? null),
            toUserId: Number(m.toUserId ?? m.ToUserId ?? null),
            messageText: decryptMessage(String(m.messageText ?? m.MessageText ?? "")),
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

        if (!res?.success || !res.data) {
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
        if (!res?.success) {
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

export const { clearMessage, userConnected, userDisconnected, addOutgoingMessageGroup, addIncomingMessageGroup, clearUnreadForUser, markPartnerMsgsReadLocal, setOnlineUsers, addIncomingMessage, addOutgoingMessage } = chatSlice.actions;
export default chatSlice.reducer;
