import { GroupMessageModel } from "@/core/models/chatMessage/messageModel";
import { formatTime } from "@/Utilities/helpers/formatDateHelper";
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";

export type Peer = { userId: number; userName?: string };

type Props = {
  currentUserId: number;
  groupId: number;
  messages: GroupMessageModel[];
  onSend: (text: string) => void | Promise<void>;
  backgroundUrl?: string;
  peers?: Peer[];
};

const PALETTE = [
  "#BAE6FD", // sky-200
  "#FBCFE8", // pink-200
  "#DDD6FE", // violet-200
  "#BBF7D0", // green-200
  "#FECDD3", // rose-200
  "#FDE68A", // amber-200
  "#E2E8F0", // slate-200
  "#C7D2FE", // indigo-200
  "#99F6E4", // teal-200
  "#FED7AA", // orange-200
] as const;

const colorForUser = (userId: number) => {
  const idx = ((userId * 2654435761) >>> 0) % PALETTE.length;
  return PALETTE[idx];
};

// Güvenli timestamp parse (NaN ise 0 döner)
const ts = (v: unknown) => {
  const t = Date.parse(String(v ?? ""));
  return Number.isNaN(t) ? 0 : t;
};

const GroupChatWindow: React.FC<Props> = ({
  currentUserId,
  groupId,
  messages,
  onSend,
  peers,
  backgroundUrl = "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=2400&auto=format&fit=crop",
}) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // İsim aramasını hızlandır (O(1))
  const peerNameById = useMemo(() => {
    const map = new Map<number, string>();
    peers?.forEach((p) => map.set(p.userId, p.userName ?? `Kullanıcı #${p.userId}`));
    return map;
  }, [peers]);

  // Sırala (tarihe göre)
  const sorted = useMemo(
    () => [...messages].sort((a, b) => ts(a.sentAt) - ts(b.sentAt)),
    [messages]
  );

  // Boş mesajları gösterme
  const visible = useMemo(
    () => sorted.filter((m) => String(m.messageText ?? "").trim().length > 0),
    [sorted]
  );

  // Kaydırma yardımcı
  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  // İlk açılış / grup değişimi → en alta
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => scrollToBottom("auto"));
    return () => cancelAnimationFrame(id);
  }, [groupId]);

  // Yeni mesaj geldikçe → en alta
  useEffect(() => {
    scrollToBottom("smooth");
  }, [visible.length]);

  const handleSend = async () => {
    const val = text.trim();
    if (!val || sending) return;
    try {
      setSending(true);
      await onSend(val);
      setText("");
      scrollToBottom("smooth"); // gönderince de en alta
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
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* Mevcut yüksekliği koruyorum; istersen flex-1 düzenine çevirebiliriz */}
      <div
        ref={scrollRef}
        className="relative h-[calc(80vh-56px-72px)] overflow-y-auto p-4 space-y-3"
      >
        {visible.map((m, idx) => {
          const mine = m.fromUserId === currentUserId;
          const key = m.groupId ? `msg-${m.groupId}` : `${m.groupId}-${m.fromUserId}-${m.sentAt}-${idx}`;

          if (mine) {
            return (
              <div key={key} className="w-full flex justify-end">
                <div
                  className="max-w-[70%] rounded-2xl rounded-tr-none p-3 shadow-md"
                  style={{ backgroundColor: "#FDE68A", color: "#111827" }}
                >
                  <div className="text-right text-sm font-medium mb-1 whitespace-pre-wrap">
                    {m.messageText}
                  </div>
                  <div className="text-[11px] opacity-80 text-right">
                    {formatTime(m.sentAt)}
                  </div>
                </div>
              </div>
            );
          }

          const bubbleColor = colorForUser(m.fromUserId);
          const name =
            m.fromUserName ??
            peerNameById.get(m.fromUserId) ??
            `Kullanıcı #${m.fromUserId}`;

          return (
            <div key={key} className="w-full flex items-start gap-2">
              <div
                className="max-w-[70%] rounded-2xl rounded-tl-none p-3 shadow-md"
                style={{ backgroundColor: bubbleColor, color: "#111827" }}
              >
                <div className="text-xs font-semibold mb-1">{name}</div>
                <div className="text-sm mb-1 whitespace-pre-wrap">{m.messageText}</div>
                <div className="text-[11px] opacity-80">{formatTime(m.sentAt)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow ring-1 ring-black/5 px-2">
          <input
            className="flex-1 px-3 py-3 outline-none text-gray-800 placeholder:text-gray-400 bg-transparent"
            placeholder="Mesajınızı yazınız..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Mesaj yaz"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="px-3 py-2 rounded-md bg-yellow-300 disabled:opacity-60 hover:bg-yellow-400 transition"
            title="Gönder"
            aria-label="Gönder"
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatWindow;
