import React, { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { PaginationModel } from "@/core/models/pagination/paginationModel";
import { UserDataModel } from "@/core/models/user/userDataModel";
import UserModal from "../UserModel";


type UserListVariant = "all" | "unapproved";

export const UserList = ({
  pagination,
  onDelete,
  onEdit,
  onPageChange,
  onApprove,
  onReject,
  onCreate,
  variant = "all",
}: {
  pagination: PaginationModel<UserDataModel>;
  onDelete?: (id: number) => void;
  onEdit?: (user: UserDataModel) => void;
  onPageChange: (page: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onCreate?: (user: Partial<UserDataModel>) => void;
  variant?: UserListVariant;
}) => {
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject';
    userId: number;
  } | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserDataModel | null>(null);

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditingUser({} as any)}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          + Kullanıcı Ekle
        </button>
      </div>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Kullanıcı Adı</th>
            <th className="p-2 border">Ad Soyad</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Telefon</th>
            <th className="p-2 border">Kimlik No</th>
            <th className="p-2 border">Fotoğraf</th>
            <th className="p-2 border">Rol ID</th>
            <th className="p-2 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {pagination.items.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500 italic">
                Gösterilecek kullanıcı yok
              </td>
            </tr>
          ) : (
            pagination.items.map((user) => (
              <tr key={user.id} className="text-center align-middle">
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.userName}</td>
                <td className="p-2 border">{user.name} {user.surname}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{(user as any).phoneNumber || "-"}</td>
                <td className="p-2 border">{user.identityNumber}</td>
                <td className="p-2 border">
                  {(variant === "all" ? user.photoURL : user.imageURL) ? (
                    <img
                      src={`https://hipocapp.com/${variant === "all" ? user.photoURL : user.imageURL ?? ''}`}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover mx-auto cursor-pointer"
                      onClick={() =>
                        setPreviewImage(`https://hipocapp.com/${variant === "all" ? user.photoURL : user.imageURL ?? ''}`)
                      }
                    />
                  ) : (
                    <span className="text-gray-400 italic">Yok</span>
                  )}
                </td>


                <td className="p-2 border">
                  {{
                    1: 'Süper Admin',
                    2: 'Kullanıcı',
                    3: 'Admin'
                  }[user.rolId] ?? 'Bilinmiyor'}
                </td>

                <td className="p-2 border space-x-2">
                  {variant === "all" ? (
                    <>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Güncelle
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(user.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Sil
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmAction({ type: 'approve', userId: user.id })}
                        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'reject', userId: user.id })}
                        className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        Reddet
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      <Pagination
        index={pagination.index}
        size={pagination.size}
        count={pagination.count}
        pages={pagination.pages}
        onPageChange={onPageChange}
      />

      {previewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90%] max-w-[90%] rounded shadow-lg"
          />
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-4 rounded shadow-md w-80 text-center">
            <p className="mb-4 text-gray-800">
              {confirmAction.type === 'approve' ? 'Bu kullanıcıyı onaylamak istediğinize emin misiniz?' : 'Bu kullanıcıyı reddetmek istediğinize emin misiniz?'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (confirmAction.type === 'approve') onApprove && onApprove(confirmAction.userId);
                  else if (confirmAction.type === 'reject') onReject && onReject(confirmAction.userId);
                  setConfirmAction(null);
                }}
                className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Evet
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}
      {editingUser && (
        <UserModal
          user={editingUser}
          isEdit={!!editingUser?.id}
          onClose={() => setEditingUser(null)}
          onUpdate={(updatedFields) => {
            if (editingUser?.id) {
              onEdit?.({ ...editingUser, ...updatedFields });
            }
          }}
          onCreate={(createdFields) => {
            onCreate?.(createdFields);
            setEditingUser(null);
          }}
        />
      )}

    </div>
  );

};
