import { UserDataModel } from "@/core/models/user/userDataModel";
import logo from '../../layout/layouts/UserHome/Header/logo.png';
export const ChatListItem: React.FC<{
    item: UserDataModel;
    active?: boolean;
    isOnline?: boolean;
    unread?: number;
    onClick: () => void;
}> = ({ item, active, onClick, isOnline = false, unread }) => (
    <button
        onClick={onClick}
        className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition",
            "backdrop-blur [box-shadow:inset_0_1px_0_rgba(255,255,255,.04)]",
            active ? "bg-white/10 ring-1 ring-white/15" : "hover:bg-white/5 ring-1 ring-white/5"
        ].join(" ")}
    >
        <span className="relative">
            <img
                src={item.photoURL ? `https://hipocapp.com/${item.photoURL}` : logo}
                alt={item.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
            />
            <span
                className={[
                    "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-[#0B1530]",
                    isOnline ? "bg-emerald-500" : "bg-red-500"
                ].join(" ")}
            />
        </span>

        <div className="flex flex-col text-left min-w-0 flex-1">
            <span className="text-sm font-medium text-white truncate">
                {item.username}
            </span>
        </div>

        {unread! > 0 && (
            <span className="ml-auto shrink-0 min-w-[22px] h-5 px-1.5 text-[11px] rounded-full bg-red-500 text-white text-center leading-5">
                {unread! > 99 ? "99+" : unread}
            </span>
        )}
    </button>

);
