import { RoleDTO } from "@/core/models/role/roleModel";
import React, { useState } from "react";
import RoleModal from "../RoleModal";
import { RoleModelResponse } from "@/core/models/RoleModel/roleModulModel";
import { RoleModuleModal } from "../RoleModuleModal";

interface RoleListProps {
    roles: RoleDTO[];
    onDelete: (roleId: number) => void;
    onAuthorize: (role: RoleDTO, selectedModuleIds: number[]) => void;
    roleModelResponse: RoleModelResponse;
    onAdd: (role: RoleDTO) => void;
    onSelectionChange: (selectedIds: number[]) => void;
    onAuthorizeClick?: (roleId: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, onDelete, onAuthorize, onAdd, roleModelResponse, onAuthorizeClick }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDTO | null>(null);
    const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);
    const [authorizeModalOpen, setAuthorizeModalOpen] = useState(false); // yetkilendirme
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleDTO | null>(null);
    const [selectedRoleForAuthorize, setSelectedRoleForAuthorize] = useState<RoleDTO | null>(null);


    const handleAdd = () => {
        setSelectedRole(null);
        setModalOpen(true);
    };

    const handleSave = (role: RoleDTO) => {
        if (role.id === 0) {
            onAdd(role);
        }
        setModalOpen(false);
    };

    const handleAuthorize = (role: RoleDTO) => {
        setSelectedRoleForAuthorize(role);
        setSelectedModuleIds([]);
        if (onAuthorizeClick) {
            onAuthorizeClick(role.id);
        }
        setAuthorizeModalOpen(true);
        onAuthorizeClick?.(role.id);

    };

    const handleSaveModules = (selectedIds: number[]) => {
        setSelectedModuleIds(selectedIds);
        if (selectedRole) {
            onAuthorize(selectedRole, selectedIds);
        }
        setModalOpen(false);
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end items-center mb-2">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600"
                >
                    + Ekle
                </button>
            </div>
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Adı</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {roles.map((role) => (
                        <tr key={role.id}>

                            <td className="px-4 py-2 text-sm text-gray-800">{role.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 space-x-2">
                                <button
                                    onClick={() => onDelete(role.id)}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                >
                                    Sil
                                </button>
                                <button
                                    onClick={() => handleAuthorize(role)}
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                >
                                    Yetkilendir
                                </button>
                            </td>
                        </tr>
                    ))}
                    {roles.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                                Kayıt bulunamadı
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {modalOpen && (
                <RoleModal
                    role={selectedRole}
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {authorizeModalOpen && selectedRoleForAuthorize && (
                <RoleModuleModal
                    isOpen={authorizeModalOpen}
                    onClose={() => setAuthorizeModalOpen(false)}
                    roleModelResponse={roleModelResponse}
                    onSelectionChange={handleSaveModules}
                />
            )}
        </div>
    );
};

export default RoleList;