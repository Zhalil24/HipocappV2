import { ChatListItem } from "@/components/ChatListItem";
import ChatWindow from "@/components/ChatWindow";
import LoadingWidget from "@/components/Loading/loadingWidget";
import { UserDataModel } from "@/core/models/user/userDataModel";
import { addMembersToGroup, clearUnreadForUser, deleteGroup, deleteMemberFromGroup, disconnectUser, fetchConversationMessages, fetchGroupMembers, fetchGroupMessages, fetchGroups, fetchLastMessages, fetchUnreadCounts, fetchUsers, getOnlineUsers, joinGroup, markMessagesAsRead, markPartnerMsgsReadLocal, removeGroupLocal, sendGroupMessage, sendPrivateMessage, startConnection, updateGroup } from "@/store/slices/chatSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from '../../../layout/layouts/UserHome/Header/logo.png';
import { GroupMessageModel, GroupModel, MessageModel } from "@/core/models/chatMessage/messageModel";
import { GroupChatListItem } from "@/components/GroupChatListItem";
import { formatDateTR } from "@/Utilities/helpers/formatDateHelper";
import GroupChatWindow from "@/components/GroupChatWindow";
import type { Peer as GroupPeer } from "@/components/GroupChatWindow";
import { toast, ToastContainer } from "react-toastify";
import { GroupManageModal } from "@/components/GroupManageModal";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { mediaUrl } from "@/core/services/apiConfig";

const EmptyState: React.FC = () => (
    <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <p className="mt-6 text-gray-300/90 max-w-md leading-relaxed">
            Devam etmek için sol taraftan bir seçenek seçin.
            <br />
            <span className="text-gray-400">Arayın, kişi/grup bulun veya yeni sohbet başlatın.</span>
        </p>
    </div>
);

const ChatPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [search, setSearch] = useState("");
    const [activeId, setActiveId] = useState<number | null>(null);
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
    const chatState = useSelector((state: RootState) => state.chat);
    const [section, setSection] = useState<"chats" | "people" | "groups">("chats");
    const [userId, setUserId] = useState<number | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [groupName, setGroupName] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [manageGroupId, setManageGroupId] = useState<number | null>(null);
    const [manageName, setManageName] = useState<string>("");
    const navigate = useNavigate();
    const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
    const { username } = useParams<{ username?: string }>();
    const usernameFromUrl = username ?? "";
    const didInitFromUrl = useRef(false);

    useEffect(() => {
        if (!didInitFromUrl.current && usernameFromUrl) {
            setSearch(usernameFromUrl);
            setSection("people");
            didInitFromUrl.current = true;
        }
    }, [usernameFromUrl]);

    const goToProfile = () => {
        if (headerUser?.id) {
            const encodedId = btoa(headerUser.id.toString());
            navigate(`/profile/${encodedId}`);
        }
    };

    useEffect(() => {
        if (!userId) return;
        const handleBeforeUnload = async () => {
            await disconnectUser(userId)();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            handleBeforeUnload();
        };
    }, [userId]);

    const members = useSelector((s: RootState) =>
        s.chat.groupMembersByGroup[manageGroupId ?? -1] ?? []
    );
    const membersLoading = useSelector((s: RootState) =>
        s.chat.groupMembersLoadingByGroup[manageGroupId ?? -1] ?? false
    );

    const openManage = (groupId: number, groupName: string) => {
        setManageGroupId(groupId);
        setManageName(groupName);
        setManageOpen(true);
        dispatch(fetchGroupMembers({ groupId }));
        dispatch(fetchUsers());
    };

    const closeManage = () => setManageOpen(false);

    const handleSaveName = () => {
        if (!manageGroupId || !manageName?.trim()) {
            toast.error("Geçersiz grup adı.");
            return;
        }

        dispatch(updateGroup({ groupId: manageGroupId, groupName: manageName }))
            .unwrap()
            .then(() => {
                toast.success("Grup adı başarıyla güncellendi.");
            })
            .catch((err) => {
                toast.error(err || "Grup güncellenemedi.");
            });
    };
    const handleRemoveMember = (userId: number) => {
        if (!manageGroupId) return;

        dispatch(deleteMemberFromGroup({ groupId: manageGroupId, userId }))
            .unwrap()
            .then((res) => {
                toast.success("Üye başarıyla gruptan çıkarıldı.");
            })
            .catch((err) => {
                toast.error(err || "Üye çıkarılamadı.");
            });
    };
    const handleAddUser = (userId: number) => {
        if (!manageGroupId) return;
        const currentMembers = chatState.groupMembersByGroup[manageGroupId] ?? [];
        const alreadyExists = currentMembers.some(m => Number(m.userId) === Number(userId));
        if (alreadyExists) {
            toast.warning("Bu kullanıcı zaten grupta.");
            return;
        }
        dispatch(addMembersToGroup({ groupId: manageGroupId, userIds: [userId] }))
            .unwrap()
            .then((res) => {
                toast.success(res.message || "Üye başarıyla eklendi.");
            })
            .catch((err) => {
                toast.error(err || "Üye eklenemedi.");
            });
    };


    useEffect(() => {
        if (!userId || !activeId) return;
        dispatch(fetchConversationMessages({ fromUserId: userId, toUserId: activeId }));
    }, [userId, activeId, dispatch]);

    const messages = useSelector((s: RootState) =>
        s.chat.messagesByUser[activeId ?? -1] ?? []
    );

    useEffect(() => {
        if (activeGroupId) dispatch(fetchGroupMessages(activeGroupId));
    }, [activeGroupId])

    useEffect(() => {
        if (activeGroupId) dispatch(joinGroup({ groupId: activeGroupId }));
    }, [activeGroupId])


    const groupMessagesById = useSelector(
        (s: RootState) => s.chat.messageByGroup ?? {}
    );

    const allGroupMessages = useMemo<GroupMessageModel[]>(() => {
        const gid = Number(activeGroupId);
        if (!gid) return [];
        return groupMessagesById[gid] ?? [];
    }, [groupMessagesById, activeGroupId]);

    const uniqueGroupMessages = useMemo<GroupMessageModel[]>(() => {
        const seen = new Set<string>();
        return allGroupMessages.filter((m) => {
            const key = `${m.fromUserId}|${m.sentAt}|${m.messageText ?? ""}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [allGroupMessages]);


    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (!userString) return;
        const parsed = JSON.parse(userString) || {};
        const uid = Number(parsed.id);
        const uname = parsed.username || "";
        const roleId = Number(parsed.rolId ?? parsed.roleId);
        if (Number.isInteger(uid) && uid > 0) {
            setUserId(uid);
        }
        if (uname) {
            setUserName(uname);
        }
        if (roleId === 1) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);


    useEffect(() => {
        if (userId == null) return;

        dispatch(startConnection(userId))
            .unwrap()
            .then(() => {
                dispatch(getOnlineUsers());
                dispatch(fetchUsers());
                dispatch(fetchLastMessages({ userId }));
                dispatch(fetchUnreadCounts({ userId }));
            })
            .catch((e) => {
                console.error("startConnection hata:", e);
            });
    }, [userId, dispatch]);

    const onlineSet = useMemo(() => {
        return new Set((chatState.onlineUsers ?? []).map((x) => Number(x)));
    }, [chatState.onlineUsers]);

    const isOnlineUser = (u: UserDataModel) => onlineSet.has(Number(u.id));


    const peopleFiltered = useMemo(() => {
        const s = search.trim().toLowerCase();
        const list = chatState.users ?? [];
        if (!s) return list;
        return list.filter(u => (u.username ?? u.name ?? "").toLowerCase().includes(s));
    }, [search, chatState.users]);

    const groupsFiltered = useMemo(() => {
        const s = search.trim().toLowerCase();
        const list = chatState.groups ?? [];
        if (!s) return list;
        return list.filter(g => (g.groupName ?? "").toLowerCase().includes(s));
    }, [search, chatState.groups]);


    const handleSend = (text: string) => {
        if (!userId || !activeId) return;
        const newMsg: MessageModel = {
            id: 0,
            fromUserId: userId,
            toUserId: activeId,
            messageText: text,
            sentAt: new Date().toISOString(),
            isRead: false
        };
        dispatch(sendPrivateMessage({ toUserId: activeId, message: newMsg }));
    };


    const handleGroupMessageSend = (text: string) => {
        if (!userId || !activeGroupId) return;
        dispatch(sendGroupMessage({ groupId: activeGroupId, messageText: text }))
    }

    const uniqueMessages = useMemo(() => {
        const seen = new Set<string>();
        return messages.filter((m) => {
            const key = `${m.id}|${m.fromUserId}|${m.toUserId}|${m.sentAt}|${m.messageText}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [messages])

    const meId = Number(userId);
    const { lastMessages = [], users = [] } = useSelector((s: RootState) => ({
        lastMessages: s.chat.lastMessages ?? [],
        users: s.chat.users ?? [],
    }));


    const conversations = useMemo(() => {
        const byPartner = new Map<number, {
            partnerId: number;
            userName: string;
            photoUrl?: string | null;
            lastMessageText: string;
            sentAt: string;
            isRead: boolean;
        }>();

        for (const m of lastMessages) {
            const partnerId =
                Number(m.fromUserId) === meId
                    ? Number(m.toUserId)
                    : Number(m.fromUserId ?? m.toUserId);

            if (!partnerId) continue;

            const u: any = users.find((x: any) => Number(x.id) === partnerId);
            const name =
                u?.userName ?? u?.username ?? `Kullanıcı #${partnerId}`;
            const photo =
                u?.photoUrl ?? u?.avatarUrl ?? null;

            const item = {
                partnerId,
                userName: name,
                photoUrl: photo,
                lastMessageText: m.messageText ?? "",
                sentAt: typeof m.sentAt === "string" ? m.sentAt : m.sentAt.toISOString(),
                isRead: !!m.isRead,
            };

            const prev = byPartner.get(partnerId);
            if (!prev || new Date(item.sentAt).getTime() > new Date(prev.sentAt).getTime()) {
                byPartner.set(partnerId, item);
            }
        }

        return Array.from(byPartner.values()).sort(
            (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
    }, [lastMessages, users, meId]);

    const headerUser = React.useMemo(() => {
        if (!activeId) return null;

        const findIn = (arr?: UserDataModel[]) =>
            arr?.find(u => Number(u.id) === activeId) ?? null;

        const u = findIn(chatState.users ?? []) || findIn(chatState.chats ?? []);
        if (u) return u;

        const c = conversations.find(x => x.partnerId === activeId);
        if (c) {
            return {
                id: c.partnerId,
                username: c.userName,
                photoURL: c.photoUrl ?? null,
            } as unknown as UserDataModel;
        }
        return null;
    }, [activeId, chatState.users, chatState.chats, conversations]);

    const peer = headerUser
        ? {
            id: Number(headerUser.id),
            username: (headerUser as any).username ?? (headerUser as any).name ?? "—",
        }
        : undefined;

    const headerGroup = React.useMemo(() => {
        if (section !== "groups" || !activeGroupId) return null;
        return (chatState.groups ?? []).find(g => Number(g.id) === Number(activeGroupId)) ?? null;
    }, [section, activeGroupId, chatState.groups]);



    const { unreadCounts = {} } = useSelector((s: RootState) => ({
        unreadCounts: s.chat.unreadCounts ?? {},
    }));

    const convWithUnread = useMemo(() => {
        return conversations.map(c => ({
            ...c,
            unread: unreadCounts[c.partnerId] ?? 0,
        }));
    }, [conversations, unreadCounts]);

    const convFiltered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return convWithUnread;
        return convWithUnread.filter(c => c.userName.toLowerCase().includes(q));
    }, [convWithUnread, search]);

    useEffect(() => {
        if (!activeId || !userId) return;

        dispatch(clearUnreadForUser(activeId));
        dispatch(markPartnerMsgsReadLocal(activeId));

        dispatch(markMessagesAsRead({ fromUserId: activeId, toUserId: userId }))
            .unwrap()
            .catch(() => {
                dispatch(fetchUnreadCounts({ userId }));
            });
    }, [activeId, userId, dispatch]);

    const activeGroup: GroupModel | null = useMemo(() => {
        if (!activeGroupId) return null;
        return (chatState.groups ?? []).find(g => Number(g.id) === Number(activeGroupId)) ?? null;
    }, [chatState.groups, activeGroupId]);

    const peers: GroupPeer[] = useMemo(() => {
        const ms = activeGroup?.members ?? [];
        return ms.map((m: any) => ({
            userId: Number(m.id),
            userName: m.username ?? m.userName ?? m.name ?? `Kullanıcı #${m.id}`,
        }));
    }, [activeGroup]);

    type SectionKey = 'chats' | 'people' | 'groups';
    type NavItem = { key: SectionKey; title: string; icon: React.ReactNode };

    const navItems: NavItem[] = [
        {
            key: 'chats',
            title: 'Sohbetler',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
                </svg>
            ),
        },
        {
            key: 'people',
            title: 'Kişiler',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.94 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
                </svg>
            ),
        },
        {
            key: 'groups',
            title: 'Gruplar',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-12 0c1.66 0 3-1.34 3-3S7.66 6 6 6 3 7.34 3 9s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h8v-2c0-.69.14-1.35.39-1.95C7.09 14.42 6.57 14 6 14zm6 0c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6 0c-.57 0-1.09.42-1.39 1.05.25.6.39 1.26.39 1.95v2h8v-2c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            ),
        },
    ];



    return (
        <div className="pt-[120px] md:pt-[60.5px] overflow-x-hidden">

            <ToastContainer position="top-right" autoClose={3000} theme="dark" newestOnTop />
            <div className="max-w-[1600px] mx-auto p-3 sm:p-6">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0E183B]
         h-[calc(100dvh-100px)] md:h-[calc(100vh-120.5px)]">

                    <div className="md:hidden sticky top-0 z-10 bg-[#0A122B] px-3 py-2 border-b border-white/10">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {[
                                {
                                    key: "chats", title: "Sohbetler", icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
                                        </svg>
                                    )
                                },
                                {
                                    key: "people", title: "Kişiler", icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.94 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
                                        </svg>
                                    )
                                },
                                {
                                    key: "groups", title: "Gruplar", icon: (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 0c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-12 0c1.66 0 3-1.34 3-3S7.66 6 6 6 3 7.34 3 9s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h8v-2c0-.69.14-1.35.39-1.95C7.09 14.42 6.57 14 6 14zm6 0c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6 0c-.57 0-1.09.42-1.39 1.05.25.6.39 1.26.39 1.95v2h8v-2c0-2.33-4.67-3.5-7-3.5z" />
                                        </svg>
                                    )
                                }
                            ].map((it) => {
                                const active = section === (it.key as any);
                                return (
                                    <button
                                        key={it.key}
                                        title={it.title}
                                        onClick={() => {
                                            setSection(it.key as any);
                                            setMobileDetailOpen(false);
                                            if (it.key === "people") {
                                                dispatch(fetchUsers());
                                            }
                                            if (it.key === "groups" && userId) {
                                                setActiveId(null);
                                                dispatch(fetchGroups({ userId }));
                                            }
                                        }}
                                        className={[
                                            "px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2",
                                            "bg-white/5 ring-1 ring-white/10 text-white/85",
                                            active ? "bg-indigo-600/80 text-white" : "hover:bg-white/10",
                                        ].join(" ")}
                                    >
                                        {it.icon}
                                        <span className="hidden sm:inline">{it.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                        <div className="hidden md:flex col-span-1 bg-[#0A122B] px-2 py-4 flex-col items-center justify-center gap-4 h-full min-h-0">
                            {navItems.map((it) => {
                                const isActive = section === it.key;
                                return (
                                    <button
                                        key={it.key}
                                        title={it.title}
                                        onClick={() => {
                                            setSection(it.key);
                                            if (it.key === 'people') dispatch(fetchUsers());
                                            if (it.key === 'groups' && userId) {
                                                setActiveId(null);
                                                dispatch(fetchGroups({ userId }));
                                            }
                                        }}
                                        className={[
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            "transition text-white/80",
                                            isActive ? "bg-[#2563eb] text-white shadow" : "hover:bg-white/10"
                                        ].join(" ")}
                                    >
                                        {it.icon}
                                    </button>
                                );
                            })}
                        </div>


                        {/* MIDDLE: başlık + arama + liste */}
                        <aside
                            className={`col-span-12 md:col-span-3 bg-gradient-to-b from-[#0E1B3D] to-[#0B1530] p-4
                        ${mobileDetailOpen ? "hidden md:flex" : "flex"} flex-col h-full min-h-0
                        rounded-2xl md:rounded-none mb-3 md:mb-0`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-white/90 tracking-wide">
                                    {section === "chats" ? "Sohbetler" : section === "people" ? "Kişiler" : "Gruplar"}
                                </h2>
                                <span className="text-xs text-white/60">
                                    {section === "chats"
                                        ? convFiltered.length
                                        : section === "people"
                                            ? peopleFiltered.length
                                            : groupsFiltered.length}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 ring-1 ring-white/10 focus-within:ring-indigo-500/50">
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-300">
                                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
                                    </svg>
                                    <input
                                        className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
                                        placeholder={section === "chats" ? "Sohbet ara…" : section === "people" ? "Kişi ara…" : "Grup ara…"}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 pr-1 overflow-y-auto thin-scroll space-y-2">
                                {chatState.loading ? (
                                    <LoadingWidget />
                                ) : section === "chats" ? (
                                    convFiltered.length === 0 ? (
                                        <div className="text-white/60 text-sm px-3 py-6 text-center">Henüz sohbet yok.</div>
                                    ) : (
                                        <>
                                            {convFiltered.map((c) => (
                                                <ChatListItem
                                                    key={c.partnerId}
                                                    active={activeId === c.partnerId}
                                                    isOnline={onlineSet.has(Number(c.partnerId))}
                                                    unread={c.unread}
                                                    onClick={() => {
                                                        setActiveId(c.partnerId);
                                                        if (userId) {
                                                            dispatch(clearUnreadForUser(c.partnerId));
                                                            dispatch(markPartnerMsgsReadLocal(c.partnerId));
                                                            dispatch(markMessagesAsRead({ fromUserId: c.partnerId, toUserId: userId }))
                                                                .unwrap()
                                                                .catch(() => dispatch(fetchUnreadCounts({ userId })));
                                                        }
                                                        if (window.innerWidth < 768) setMobileDetailOpen(true);
                                                    }}
                                                    item={{
                                                        id: c.partnerId,
                                                        username: c.userName,
                                                        photoURL: c.photoUrl ?? null,
                                                    } as unknown as UserDataModel}
                                                />
                                            ))}
                                        </>
                                    )
                                ) : section === "people" ? (
                                    <>
                                        {peopleFiltered.map((u) => {
                                            const isSelf = Number(u.id) === Number(userId);
                                            return (
                                                <ChatListItem
                                                    key={u.id}
                                                    isOnline={isOnlineUser(u)}
                                                    item={u}
                                                    active={activeId === u.id}
                                                    onClick={() => {
                                                        if (isSelf) {
                                                            toast.warning("Kendinize mesaj gönderemezsiniz.");
                                                            return;
                                                        }
                                                        setActiveId(u.id);
                                                        if (window.innerWidth < 768) setMobileDetailOpen(true);
                                                    }}
                                                />
                                            );
                                        })}
                                        {peopleFiltered.length === 0 && (
                                            <div className="text-xs text-gray-400/90 px-1 py-6 text-center">Sonuç bulunamadı.</div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {groupsFiltered.map((g) => (
                                            <GroupChatListItem
                                                key={g.id}
                                                item={{ id: g.id, groupName: g.groupName } as unknown as GroupModel}
                                                active={activeGroupId === g.id}
                                                onClick={() => {
                                                    setActiveGroupId(g.id!);
                                                    setGroupName(g.groupName);
                                                    if (window.innerWidth < 768) setMobileDetailOpen(true);
                                                }}

                                                {...(isAdmin && {
                                                    onEdit: () => openManage(g.id!, g.groupName),
                                                    onDelete: () => {
                                                        dispatch(deleteGroup({ groupId: g.id! }))
                                                            .unwrap()
                                                            .then((res) => {
                                                                toast.success(res?.message || "Grup başarıyla silindi.");
                                                            })
                                                            .catch((err) => {
                                                                toast.error(err || "Silme başarısız");
                                                            });
                                                        dispatch(removeGroupLocal(g.id));
                                                    }
                                                })}
                                            />
                                        ))}
                                        {groupsFiltered.length === 0 && (
                                            <div className="text-xs text-gray-400/90 px-1 py-6 text-center">Sonuç bulunamadı.</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </aside>

                        <section
                            className={`col-span-12 md:col-span-8 bg-[#0A0F1F] flex flex-col h-full min-h-0
                        rounded-2xl md:rounded-none border-t border-white/10 md:border-t-0
                        ${mobileDetailOpen ? "block" : "hidden md:flex"}`}
                        >
                            {/* Header sabit */}
                            <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-[#0C1226]/70 backdrop-blur rounded-t-2xl md:rounded-none">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* MOBİL GERİ BUTONU */}
                                    {mobileDetailOpen && (
                                        <button
                                            className="md:hidden -ml-2 mr-1 p-2 rounded-lg hover:bg-white/10"
                                            aria-label="Geri"
                                            onClick={() => setMobileDetailOpen(false)}
                                        >
                                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                            </svg>
                                        </button>
                                    )}

                                    {section === "groups" && headerGroup ? (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 ring-2 ring-white/10 grid place-items-center">
                                                <img src={logo} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-white/90 text-sm font-medium truncate">{headerGroup.groupName}</div>
                                                <div className="text-[11px] text-gray-400">Oluşturulma Tarihi: {formatDateTR(headerGroup.createdOn)}</div>
                                            </div>
                                        </>
                                    ) : headerUser ? (
                                        <>
                                            <img
                                                src={headerUser.photoURL ? mediaUrl(headerUser.photoURL) : logo}
                                                alt={headerUser.userName ?? headerUser.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-white/90 text-sm font-medium truncate cursor-pointer hover:underline" onClick={goToProfile}>
                                                    {headerUser.userName ?? headerUser.name}
                                                </div>
                                                <div className="text-[11px] text-gray-400">
                                                    {isOnlineUser(headerUser) ? "Çevrimiçi" : "Çevrimdışı"}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-white/80 text-sm font-medium">Sohbet</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden pb-14 md:pb-0">
                                {section === "groups" ? (
                                    activeGroupId ? (
                                        <GroupChatWindow
                                            currentUserId={userId!}
                                            groupId={activeGroupId}
                                            messages={uniqueGroupMessages}
                                            onSend={handleGroupMessageSend}
                                            peers={peers}
                                        />
                                    ) : (
                                        <EmptyState />
                                    )
                                ) : activeId ? (
                                    <ChatWindow
                                        key={activeId ?? "none"}
                                        currentUserId={userId!}
                                        messages={uniqueMessages}
                                        onSend={handleSend}
                                        peer={peer}
                                    />
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <GroupManageModal
                open={manageOpen}
                onClose={closeManage}
                groupName={manageName}
                onChangeGroupName={setManageName}
                onSaveGroupName={handleSaveName}
                savingName={false}
                members={members}
                onRemoveMember={handleRemoveMember}
                membersLoading={membersLoading}
                users={users}
                onChangeUserSearch={setSearch}
                onAddUser={handleAddUser}
                usersLoading={chatState.loading}
            />

            <style>{`
      .thin-scroll::-webkit-scrollbar { width: 8px; }
      .thin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 9999px; }
      .thin-scroll::-webkit-scrollbar-track { background: transparent; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
        </div>
    );


};
export default ChatPage;
