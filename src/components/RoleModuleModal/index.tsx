import { ModuleModel } from "@/core/models/modul/modulModel";
import { RoleModelResponse } from "@/core/models/RoleModel/roleModulModel";
import { useState } from "react";

interface RoleModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleModelResponse: RoleModelResponse;
  onSelectionChange: (selectedIds: number[]) => void;
}

export const RoleModuleModal: React.FC<RoleModuleModalProps> = ({
  isOpen,
  onClose,
  roleModelResponse,
  onSelectionChange,
}) => {
  const { moduleList, authModuleList } = roleModelResponse;

  const initialSelectedIds = authModuleList.map((m) => m.moduleId);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);

  const toggleSelect = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    setSelectedIds(updated);
    onSelectionChange(updated);
  };

  const renderModules = (items: ModuleModel[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ marginLeft: level * 20, padding: "5px 0" }}>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => toggleSelect(item.id)}
          />
          {item.name}
        </label>
        {item.subModules.length > 0 && renderModules(item.subModules, level + 1)}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Modül Listesi</h2>
        <div>{renderModules(moduleList)}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Kapat
          </button>
          <button
            onClick={() => onClose()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};
