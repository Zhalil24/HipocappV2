import React from "react";

import type { UserDataModel } from "@/core/models/user/userDataModel";
import { GroupMemberDto } from "@/core/models/chatMessage/messageModel";

type Props = {
    open: boolean;
    onClose: () => void;
    groupName: string;
    onChangeGroupName: (v: string) => void;
    onSaveGroupName: () => void;
    savingName?: boolean;
    members: GroupMemberDto[];
    onRemoveMember: (userId: number) => void;
    membersLoading?: boolean;
    users: Pick<UserDataModel, "id" | "username">[];
    onChangeUserSearch: (v: string) => void;
    onAddUser: (userId: number) => void;
    usersLoading?: boolean;
};

export const GroupManageModal: React.FC<Props> = ({
    open,
    onClose,
    groupName,
    onChangeGroupName,
    onSaveGroupName,
    savingName = false,
    members,
    onRemoveMember,
    membersLoading = false,
    users,
    onChangeUserSearch,
    onAddUser,
    usersLoading = false,
}) => {
    if (!open) return null;
    const [userSearch, setUserSearch] = React.useState("");

    const filteredUsers = React.useMemo(() => {
        const q = userSearch.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            (u.username ?? "").toLowerCase().includes(q)
        );
    }, [userSearch, users]);



    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden
            />
            {/* modal card */}
            <div className="relative w-full max-w-5xl bg-[#0F1831] text-white rounded-2xl shadow-xl ring-1 ring-white/10 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Grup Ayarları</h3>
                    <button
                        onClick={onClose}
                        className="px-2 py-1 text-white/70 hover:text-white rounded"
                        title="Kapat"
                    >
                        ✕
                    </button>
                </div>

                {/* Grup adı düzenleme */}
                <div className="mb-5">
                    <label className="block text-sm text-white/80 mb-1">Grup Adı</label>
                    <div className="flex gap-2">
                        <input
                            value={groupName}
                            onChange={(e) => onChangeGroupName(e.target.value)}
                            className="flex-1 rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-indigo-500/60"
                            placeholder="Grup adı"
                        />
                        <button
                            onClick={onSaveGroupName}
                            disabled={savingName}
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
                        >
                            {savingName ? "Kaydediliyor…" : "Kaydet"}
                        </button>
                    </div>
                </div>

                {/* İki kolon: Üyeler / Kullanıcılar */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Üyeler */}
                    <section className="col-span-6 rounded-xl bg-white/5 ring-1 ring-white/10 p-3 min-h-[340px]">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Üyeler</h4>
                            {membersLoading && (
                                <span className="text-xs text-white/60">Yükleniyor…</span>
                            )}
                        </div>

                        {members.length === 0 && !membersLoading ? (
                            <div className="text-sm text-white/60">Bu grupta henüz üye yok.</div>
                        ) : (
                            <ul className="space-y-2 max-h-[360px] overflow-y-auto thin-scroll">
                                {members.map((m) => (
                                    <li
                                        key={m.userId}
                                        className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                                    >
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium truncate">
                                                {m.userName ?? `Kullanıcı #${m.userId}`}
                                            </div>
                                            <div className="text-xs text-white/60">
                                                Katılım: {new Date(m.joinedOn).toLocaleDateString("tr-TR")}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRemoveMember(m.userId)}
                                            className="text-red-400 hover:text-red-500 text-sm px-2 py-1 rounded"
                                        >
                                            Kaldır
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Kullanıcılar */}
                    <section className="col-span-6 rounded-xl bg-white/5 ring-1 ring-white/10 p-3 min-h-[340px]">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Kullanıcılar</h4>
                            {usersLoading && (
                                <span className="text-xs text-white/60">Yükleniyor…</span>
                            )}
                        </div>

                        {/* Arama */}
                        <div className="mb-3">
                            <input
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-indigo-500/60"
                                placeholder="Kullanıcı ara…"
                            />

                        </div>

                        {/* Liste */}
                        {users.length === 0 && !usersLoading ? (
                            <div className="text-sm text-white/60">Sonuç yok.</div>
                        ) : (
                            <ul className="space-y-2 max-h-[360px] overflow-y-auto thin-scroll">
                                {filteredUsers.map((u) => (
                                    <li key={u.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                                        <div className="text-sm font-medium truncate">
                                            {u.username ?? `Kullanıcı #${u.id}`}
                                        </div>
                                        <button
                                            onClick={() => onAddUser(u.id)}
                                            className="text-emerald-300 hover:text-emerald-400 text-sm px-2 py-1 rounded"
                                        >
                                            Ekle
                                        </button>
                                    </li>
                                ))}
                            </ul>

                        )}
                    </section>
                </div>
            </div>

            {/* İnce scroll bar */}
            <style>{`
        .thin-scroll::-webkit-scrollbar { width: 8px; }
        .thin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.18); border-radius: 9999px; }
        .thin-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
        </div>
    );
};
