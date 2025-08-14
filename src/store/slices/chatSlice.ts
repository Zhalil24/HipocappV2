import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BaseService } from '../../core/services/baseService';

import { UserDataModel } from '@/core/models/user/userDataModel';
import { chatModelInitialState, InitialChatModel } from '@/core/models/chat/chatModel';
import { SignalRService } from '@/core/hubService/hubService';
import { MessageModel } from '@/core/models/chatMessage/messageModel';
import { RootState } from '../store';

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
            dispatch(addIncomingMessage(msg));
        });
        hubService.on?.("reconnected", async () => {
            const res = await hubService.invoke("GetOnlineUsers");
            if (Array.isArray(res)) dispatch(setOnlineUsers(res.map(Number)));
        });
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
  { toUserId: number; message: MessageModel },
  { rejectValue: string }
>(
  "chat/sendPrivateMessage",
  async ({ toUserId, message }, { dispatch, rejectWithValue }) => {
      const fromId = Number(message.fromUserId);
      const toIdInMsg = Number(message.toUserId ?? toUserId);
      if (!fromId || !toIdInMsg || !toUserId) {
        return rejectWithValue("Geçersiz kullanıcı bilgisi (from/to).");
      }
      const serverMessage = {
        Id: message.id ?? 0, 
        FromUserId: fromId,
        ToUserId: toIdInMsg,
        MessageText: String(message.messageText ?? ""),
        SentAt: new Date(message.sentAt).toISOString(), 
        IsRead: Boolean(message.isRead ?? false),
      };
      dispatch(addOutgoingMessage(message));
      await hubService.invoke("SendPrivateMessage", Number(toUserId), serverMessage);
  }
);

export const saveMessage = createAsyncThunk<
    MessageModel,
    { message: MessageModel },
    { rejectValue: string }
>(
    "chat/saveMessage",
    async ({ message }, { rejectWithValue }) => {
        const res = await baseService.post<MessageModel, MessageModel>(
            "/api/chat/MessageSave",
            message
        );
        if (!res?.success || !res.data) {
            return rejectWithValue(res?.message || "Mesaj kaydedilemedi");
        }
        return res.data;
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
            messageText: m.MessageText ?? m.messageText ?? m.Text ?? "",
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
            });
    },
});

export const { clearMessage, userConnected, userDisconnected, setOnlineUsers, addIncomingMessage, addOutgoingMessage } = chatSlice.actions;
export default chatSlice.reducer;
