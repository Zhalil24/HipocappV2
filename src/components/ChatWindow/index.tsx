import { MessageModel } from "@/core/models/chatMessage/messageModel";
import { formatTime } from "@/Utilities/helpers/formatDateHelper";
import React, { useEffect, useMemo, useRef, useState } from "react";


type Props = {
    currentUserId: number;
    messages: MessageModel[];
    onSend: (text: string) => void | Promise<void>;
    backgroundUrl?: string;
    peer?: { id: number; username: string; };
};


const ChatWindow: React.FC<Props> = ({
    currentUserId,
    messages,
    onSend,
    peer,
    backgroundUrl = "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=2400&auto=format&fit=crop", // yıldızlı bir görsel
}) => {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const toMs = (d: string | number | Date) => {
        const t = new Date(d).getTime();
        return Number.isNaN(t) ? 0 : t;
    };

    const sorted = useMemo(
        () =>
            [...messages].sort(
                (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            ),
        [messages]
    );

    useEffect(() => {
        // her yeni mesajda aşağıya kaydır
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [sorted.length]);

    const handleSend = async () => {
        const val = text.trim();
        if (!val || sending) return;
        try {
            setSending(true);
            await onSend(val);
            setText("");
        } finally {
            setSending(false);
        }
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative h-full w-full">
            {/* arkaplan */}
            <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* mesajlar */}
            <div
                ref={scrollRef}
                className="relative h-[calc(80vh-56px-72px)] overflow-y-auto p-4 space-y-3"
            >
                {sorted.map((m, idx) => {
                    const mine = m.fromUserId === currentUserId;
                    const key = m.id ?? `${m.fromUserId}-${m.toUserId}-${idx}-${toMs(m.sentAt)}`;

                    if (mine) {
                        // SAĞ: kendi mesajın
                        return (
                            <div key={key} className="w-full flex justify-end">
                                <div className="max-w-[70%] bg-yellow-300/90 text-gray-900 rounded-2xl rounded-tr-none p-3 shadow-md">
                                    <div className="text-right text-sm font-medium mb-1 whitespace-pre-wrap">
                                        {m.messageText}
                                    </div>
                                    <div className="text-[11px] text-gray-700 text-right">
                                        {formatTime(m.sentAt)}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // SOL: karşı taraf (isim dışarıdan peer.name)
                    return (
                        <div key={key} className="w-full flex items-start gap-2">
                            {/* Opsiyonel avatar */}
                            {/* <img
                src={peer?.photoUrl ? `https://hipocapp.com/${peer.photoUrl}` : logo}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10 mt-0.5"
                alt={peer?.name ?? "user"}
              /> */}

                            <div className="max-w-[70%] bg-gray-100/90 text-gray-900 rounded-2xl rounded-tl-none p-3 shadow-md">
                                {peer?.username && (
                                    <div className="text-xs font-semibold text-indigo-600 mb-1">
                                        {peer.username}
                                    </div>
                                )}
                                <div className="text-sm mb-1 whitespace-pre-wrap">{m.messageText}</div>
                                <div className="text-[11px] text-gray-600">{formatTime(m.sentAt)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* giriş alanı */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-2 bg-white rounded-lg shadow ring-1 ring-black/5 px-2">
                    <input
                        className="flex-1 px-3 py-3 outline-none text-gray-800 placeholder:text-gray-400 bg-transparent"
                        placeholder="Mesajınızı yazınız..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !text.trim()}
                        className="px-3 py-2 rounded-md bg-yellow-300 disabled:opacity-60 hover:bg-yellow-400 transition"
                        title="Gönder"
                    >
                        ►
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ChatWindow;
