import { GroupModel } from "@/core/models/chatMessage/messageModel";
export const GroupChatListItem: React.FC<{
    item: GroupModel;
    active?: boolean;
    onClick: () => void;
}> = ({ item, active, onClick }) => (
    <button
        onClick={onClick}
        className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition",
            "backdrop-blur [box-shadow:inset_0_1px_0_rgba(255,255,255,.04)]",
            active ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5 ring-1 ring-white/5"
        ].join(" ")}
    >

        <div className="flex flex-col text-left min-w-0 flex-1">
            <span className="text-sm font-medium text-white truncate">
                {item.groupName}
            </span>
        </div>

    </button>

);
