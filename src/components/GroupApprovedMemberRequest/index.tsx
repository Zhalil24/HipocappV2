import { GetGroupsMemberRequest } from "@/core/models/groupMemberRequest/groupMemberRequestModel";
import { PaginationModel } from "@/core/models/pagination/paginationModel";
import { Pagination } from "../Pagination";

interface Props {
  data: GetGroupsMemberRequest[];
  onDelete: (payload: { groupId: number; userId: number }) => void;
  onPageChange: (page: number) => void;
  pagination: PaginationModel<GetGroupsMemberRequest>;
}

const GroupApprovedMemberRequestsTable: React.FC<Props> = ({
  data,
  onDelete,
  onPageChange,
  pagination,
}) => {
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
          {data.map((req) => (
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
                  onClick={() => onDelete({ groupId: req.groupId, userId: req.userId })}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Gruptan Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        <Pagination
          index={pagination.index}
          size={pagination.size}
          count={pagination.count}
          pages={pagination.pages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default GroupApprovedMemberRequestsTable;