import { GroupModel } from "@/core/models/chatMessage/messageModel";
import { PencilLine, Trash2 } from "lucide-react";
export const GroupChatListItem: React.FC<{
    item: GroupModel;
    active?: boolean;
    onClick: () => void;
    onDelete?: () => void;
    onEdit?: () => void; // ✅ yeni
}> = ({ item, active, onClick, onDelete, onEdit }) => (
    <div
        className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition",
            "backdrop-blur [box-shadow:inset_0_1px_0_rgba(255,255,255,.04)]",
            active ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5 ring-1 ring-white/5",
        ].join(" ")}
    >
        {/* Sol aksiyonlar */}
        <div className="flex items-center gap-2">
            {onDelete && (
                <button
                    title="Grubu sil"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1 text-red-400 hover:text-red-600 rounded"
                >
                    <Trash2 size={16} />
                </button>
            )}

            {onEdit && (
                <button
                    title="Grubu düzenle"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="p-1 text-indigo-300 hover:text-indigo-400 rounded"
                >
                    <PencilLine size={16} />
                </button>
            )}
        </div>

        {/* Ana içerik */}
        <div className="flex flex-col text-left min-w-0 flex-1" onClick={onClick}>
            <span className="text-sm font-medium text-white truncate">
                {item.groupName}
            </span>
        </div>
    </div>
);