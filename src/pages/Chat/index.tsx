import { ChatListItem } from "@/components/ChatListItem";
import ChatWindow from "@/components/ChatWindow";
import LoadingWidget from "@/components/Loading/loadingWidget";
import { UserDataModel } from "@/core/models/user/userDataModel";
import { fetchConversationMessages, fetchUsers, getOnlineUsers, saveMessage, sendPrivateMessage, startConnection } from "@/store/slices/chatSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from '../../layout/layouts/Header/logo.png'
import { MessageModel } from "@/core/models/chatMessage/messageModel";

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
    const chatState = useSelector((state: RootState) => state.chat);
    const [section, setSection] = useState<"chats" | "people" | "groups">("chats");
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        if (!userId || !activeId) return;
        dispatch(fetchConversationMessages({ fromUserId: userId, toUserId: activeId }));
    }, [userId, activeId, dispatch]);
    
    const messages = useSelector((s: RootState) =>
        s.chat.messagesByUser[activeId ?? -1] ?? []
    );

    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (!userString) return;
        const parsed = JSON.parse(userString) || {};
        const uid = Number(parsed.id);
        if (Number.isInteger(uid) && uid > 0) {
            setUserId(uid);
        }
    }, []);

    useEffect(() => {
        if (userId == null) return;

        dispatch(startConnection(userId))
            .unwrap()
            .then(() => {
                dispatch(getOnlineUsers());
            })
            .catch((e) => {
                console.error("startConnection hata:", e);
            });
    }, [userId, dispatch]);

    const onlineSet = useMemo(() => {
        return new Set((chatState.onlineUsers ?? []).map((x) => Number(x)));
    }, [chatState.onlineUsers]);

    const isOnlineUser = (u: UserDataModel) => onlineSet.has(Number(u.id));


    useEffect(() => {
        console.log("online user listesi", chatState.onlineUsers);
    }, [chatState.onlineUsers]);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();

        const base: UserDataModel[] =
            section === "people" ? (chatState.users ?? [])
                : section === "groups" ? (chatState.groups ?? [])
                    : (chatState.chats ?? []);

        const textOf = (u: UserDataModel) =>
            (u.username ?? u.name ?? "").toLowerCase();

        if (!s) return base;
        return base.filter(x => textOf(x).includes(s));
    }, [
        search,
        section,
        chatState.users,
        chatState.groups,
        chatState.chats,
    ]);

    const activeConv = filtered.find((x) => x.id === activeId);
    const headerUser = activeConv ?? null;
    const peer = activeConv
        ? {
            id: activeConv.id,
            username: activeConv.username ?? activeConv.name ?? "—",
        }
        : undefined;


    const filterUser =
        filtered.find((x) => isOnlineUser(x)) ?? null;


    const handleSend = (text: string) => {
        if (!activeConv || !userId) return;

        const newMsg: MessageModel = {
            id: 0,
            fromUserId: userId,
            toUserId: activeConv.id,
            messageText: text,
            sentAt: new Date().toISOString(),
            isRead: false
        };
        dispatch(saveMessage({ message: newMsg }));
        dispatch(sendPrivateMessage({ toUserId: activeConv.id, message: newMsg }));
    };


    return (
        <div className="pt-[80.5px]">
            <div className="max-w-[1600px] mx-auto p-6">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0E183B]
                        h-[calc(100vh-120.5px)]">
                    <div className="grid grid-cols-12 h-full">
                        {/* LEFT RAIL (ikonlar) */}
                        <div className="col-span-1 bg-[#0A122B] px-2 py-4 flex flex-col items-center justify-center gap-4 h-full min-h-0">
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
                                const isActive = section === (it.key as any);
                                return (
                                    <button
                                        key={it.key}
                                        title={it.title}
                                        onClick={() => {
                                            setSection(it.key as any);
                                            if (it.key === "people") dispatch(fetchUsers());
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
                        <aside className="col-span-3 bg-gradient-to-b from-[#0E1B3D] to-[#0B1530] p-4 flex flex-col h-full min-h-0">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-white/90 tracking-wide">
                                    {section === "chats" ? "Sohbetler" : section === "people" ? "Kişiler" : "Gruplar"}
                                </h2>
                                <span className="text-xs text-white/60">{filtered.length}</span>
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

                            {/* Liste: yalnızca burası scroll */}
                            <div className="flex-1 pr-1 overflow-y-auto thin-scroll space-y-2">
                                {chatState.loading ? (
                                    <LoadingWidget />
                                ) : (
                                    <>
                                        {filtered.map((c: any) => (
                                            <ChatListItem
                                                key={c.id}
                                                isOnline={isOnlineUser(c)}
                                                item={c}
                                                active={activeId === c.id}
                                                onClick={() => setActiveId(c.id)}
                                            />
                                        ))}
                                        {filtered.length === 0 && !chatState.loading && (
                                            <div className="text-xs text-gray-400/90 px-1 py-6 text-center">Sonuç bulunamadı.</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </aside>

                        {/* RIGHT: içerik */}
                        <section className="col-span-8 bg-[#0A0F1F] flex flex-col h-full min-h-0">
                            {/* Header sabit */}
                            <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-[#0C1226]/70 backdrop-blur">
                                <div className="flex items-center gap-3 min-w-0">
                                    {headerUser ? (
                                        <>
                                            <img
                                                src={headerUser.photoURL
                                                    ? `https://hipocapp.com/${headerUser.photoURL}`
                                                    : logo}
                                                alt={headerUser.username ?? headerUser.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
                                            />

                                            <div className="min-w-0">
                                                <div className="text-white/90 text-sm font-medium truncate">
                                                    {headerUser.username ?? headerUser.name}
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

                            {/* Chat gövdesi: yalnızca burası scroll */}
                            <div className="flex-1 overflow-y-auto">
                                {activeId ? (
                                    <ChatWindow currentUserId={userId!} messages={messages} onSend={handleSend} peer={peer} />
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* İnce scroll bar */}
            <style>{`
        .thin-scroll::-webkit-scrollbar { width: 8px; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 9999px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
        </div>
    );
};
export default ChatPage;
