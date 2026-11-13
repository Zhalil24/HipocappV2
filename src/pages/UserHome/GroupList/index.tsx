import { GetGroupsMemberRequest } from "@/core/models/groupMemberRequest/groupMemberRequestModel";
import { fetchGetGroups, sendToGroupRequest } from "@/store/slices/groupListSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
export default function GroupList() {
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state.groupList);
    const [userId, setUserId] = useState<number>(0);
    const [search, setSearch] = useState("");
    const filteredGroups = state.groups.filter((g) =>
        g.groupName.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const { id } = JSON.parse(userString);
            if (id) {
                setUserId(id);
            }
        }
    }, []);

    useEffect(() => {
        dispatch(fetchGetGroups());
    }, [dispatch]);

    const handleJoinGroup = async (groupId: number) => {
        try {
            const model: GetGroupsMemberRequest = {
                groupId: groupId,
                userId: userId,
                status: 1,
                requestedOn: new Date().toISOString(),
            }
            const resp = await dispatch(
                sendToGroupRequest(model)
            ).unwrap();
            if (resp.message) {
                toast.success(resp.message);
            } else if (!resp.isSuccess) {
                toast.error(resp.error || "İstek gönderilemedi.");
            }
        } catch (error: any) {
            toast.error(error?.message || "Bir hata oluştu.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-32 px-4">
            <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6 max-h-[700px] overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-6">Kanallar</h1>
                {/* Info/uyarı mesajı */}
                <div className="flex items-start gap-2 bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    <p className="text-sm text-blue-700">
                        Katıldığınız kanallar, onaylandıktan sonra chat tarafında gruplar bölümünde görünecektir.
                    </p>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Kanal ara..."
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map((g) => (
                        <div
                            key={g.id}
                            className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white"
                        >
                            <div className="flex-1">
                                <h2 className="text-lg font-medium text-gray-900">{g.groupName}</h2>
                                <p className="mt-1 text-sm text-gray-500">{g.description}</p>
                            </div>

                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => handleJoinGroup(g.id!)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm 
                             bg-gradient-to-r from-[#7B2FF7] to-[#9D4EDD] text-white 
                             hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-300"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Kanala Katıl
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredGroups.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-gray-500">
                            Henüz hiç grup yok.
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}