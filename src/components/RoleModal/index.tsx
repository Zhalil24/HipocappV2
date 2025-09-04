import { RoleDTO } from "@/core/models/role/roleModel";
import React, { useState, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface RoleModalProps {
  role?: RoleDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: RoleDTO) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ role, isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  useEffect(() => {
    if (role) {
      setName(role.name);
    } else {
      setName("");
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRole: RoleDTO = {
      id: role ? role.id : 0,
      name,
    };

    onSave(newRole);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Trigger />
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-40 z-50" />
      <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-blue-100 border-2 border-blue-500 ring-2 ring-blue-300 rounded-lg shadow-xl w-full max-w-lg p-6">
          <DialogPrimitive.Title className="text-lg font-semibold mb-4">
            {role ? "Rolü Güncelle" : "Yeni Rol Ekle"}
          </DialogPrimitive.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol Adı
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Rol adını giriniz"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
              >
                Kaydet
              </button>
            </div>
          </form>

        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );

};

export default RoleModal;
