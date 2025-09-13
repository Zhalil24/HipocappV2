import { GroupModel } from "@/core/models/chatMessage/messageModel";
import React, { useState } from "react";

interface Props {
    groups: GroupModel[];
    onAddGroup: (model: GroupModel) => void;
}

const AdminGroupsTable: React.FC<Props> = ({ groups, onAddGroup }) => {
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = () => {
        if (!groupName.trim()) return;

        const newGroup: GroupModel = {
            groupName,
            description,
            createdOn: new Date().toISOString(),
            members: [
                {
                    groupId: 0,
                    userId: 15,
                    userName: "mrt",
                    joinedOn: new Date("2025-09-11T12:00:00Z").toISOString(),
                },
            ],
        };
        onAddGroup(newGroup);
        setGroupName("");
        setDescription("");
        setShowModal(false);
    };

    return (
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            {/* Başlık ve Buton */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Gruplar</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm 
                     bg-gradient-to-r from-[#7B2FF7] to-[#9D4EDD] text-white 
                     hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                    Grup Ekle
                </button>
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grup Adı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Oluşturulma Tarihi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Açıklama
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <tr key={group.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {group.groupName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(group.createdOn).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {group.description ?? "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Henüz hiç grup yok.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Yeni Grup Ekle</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Grup Adı"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Grup Açıklaması"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGroupsTable;