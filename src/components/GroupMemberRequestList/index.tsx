import { GetGroupsMemberRequest } from "@/core/models/groupMemberRequest/groupMemberRequestModel";
import { PaginationModel } from "@/core/models/pagination/paginationModel";
import { Pagination } from "../Pagination";
import { useEffect, useState } from "react";

interface Props {
  data: GetGroupsMemberRequest[] | null;
  onApprove: (request: GetGroupsMemberRequest) => void;
  onReject: (request: GetGroupsMemberRequest) => void;
  onPageChange: (page: number) => void;
  pagination: PaginationModel<GetGroupsMemberRequest> | null;
}

const GroupMemberRequestsTable: React.FC<Props> = ({
  data,
  onApprove,
  onReject,
  onPageChange,
  pagination,
}) => {
  const [localData, setLocalData] = useState<GetGroupsMemberRequest[]>(data ?? []);

  useEffect(() => {
    setLocalData(data ?? []);
  }, [data]);


  const handleApprove = (req: GetGroupsMemberRequest) => {
    const updatedReq = { ...req, status: 2 };
    setLocalData(prev =>
      prev.map(item =>
        item.userId === req.userId && item.groupId === req.groupId
          ? updatedReq
          : item
      )
    );
    onApprove(updatedReq);
  };

  const handleReject = (req: GetGroupsMemberRequest) => {
    const updatedReq = { ...req, status: 3 };
    setLocalData(prev =>
      prev.map(item =>
        item.userId === req.userId && item.groupId === req.groupId
          ? updatedReq
          : item
      )
    );
    onReject(updatedReq);
  };


  const [confirm, setConfirm] = useState<{
    visible: boolean;
    action: (() => void) | null;
    message: string;
  }>({ visible: false, action: null, message: "" });

  const handleConfirm = () => {
    if (confirm.action) confirm.action();
    setConfirm({ visible: false, action: null, message: "" });
  };

  const handleCancel = () => {
    setConfirm({ visible: false, action: null, message: "" });
  };
  const safePagination = pagination ?? { index: 0, size: 10, count: 0, pages: 0 };


  return (
    <div className="w-full">
      <table className="w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Grup Adı</th>
            <th className="border px-3 py-2">Kullanıcı Adı</th>
            <th className="border px-3 py-2">İstek Oluşturma Tarih</th>
            <th className="border px-3 py-2">İstek Durumu</th>
            <th className="border px-3 py-2">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {localData.length > 0 ? (
            localData.map((req) => (
              <tr key={`${req.groupId}-${req.userId}`}>
                <td className="border px-3 py-2">{req.groupName}</td>
                <td className="border px-3 py-2">{req.userName}</td>
                <td className="border px-3 py-2">
                  {new Date(req.requestedOn).toLocaleString()}
                </td>
                <td className="border px-3 py-2">
                  {req.status === 1
                    ? "İstek Bekliyor"
                    : req.status === 2
                      ? "İstek Kabul Edilmiş"
                      : req.status === 3
                        ? "İstek Reddedilmiş"
                        : "İstek Atmamış"}
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() =>
                      setConfirm({
                        visible: true,
                        action: () => handleApprove(req),
                        message: "Bu kullanıcıyı onaylamak istediğinizden emin misiniz?",
                      })
                    }
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Onayla
                  </button>

                  <button
                    onClick={() =>
                      setConfirm({
                        visible: true,
                        action: () => handleReject(req),
                        message: "Bu kullanıcıyı reddetmek istediğinizden emin misiniz?",
                      })
                    }
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reddet
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500 bg-gray-50 italic"
              >
                Veri bulunamadı
              </td>
            </tr>
          )}
        </tbody>


      </table>

      <div className="mt-4 flex justify-center">
        <Pagination
          index={safePagination.index}
          size={safePagination.size}
          count={safePagination.count}
          pages={safePagination.pages}
          onPageChange={onPageChange}
        />
      </div>
      {confirm.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <p className="mb-4">{confirm.message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Evet
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default GroupMemberRequestsTable;