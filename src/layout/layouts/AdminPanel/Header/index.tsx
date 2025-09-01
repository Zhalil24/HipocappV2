import { UserDataModel } from "@/core/models/user/userDataModel";

type Props = {
    user: UserDataModel;
};

export default function AdminHeader({ user }: Props) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-neutral-900/70">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black">A</div>
                    <div className="font-semibold tracking-tight text-gray-900 dark:text-white">Admin Panel</div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-neutral-900 dark:text-gray-100 dark:hover:bg-neutral-800">{user.name} {user.surname}</button>
                    <button className="rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 p-0.5 dark:from-white dark:to-gray-200">
                        <span className="block rounded-full bg-white p-1 dark:bg-neutral-900">
                            <img className="h-8 w-8 rounded-full object-cover" src={`https://hipocapp.com/${user.photoURL}`} alt="user" />
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}