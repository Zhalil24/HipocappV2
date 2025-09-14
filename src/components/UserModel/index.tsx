import { UserDataModel } from "@/core/models/user/userDataModel";
import React, { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
interface UserModalProps {
    user?: UserDataModel | null;
    onUpdate?: (updatedFields: Partial<UserDataModel>) => void;
    onCreate?: (newUser: Partial<UserDataModel>) => void;
    onClose: () => void;
    isEdit?: boolean;
}
const UserModal: React.FC<UserModalProps> = ({ user, onUpdate, onCreate, onClose, isEdit }) => {

    const [formData, setFormData] = useState({
        rolId: user?.rolId ?? 2,
        userName: user?.userName ?? "",
        name: user?.name ?? "",
        surname: user?.surname ?? "",
        identityNumber: user?.identityNumber ?? "",
        email: user?.email ?? "",
        password: user?.password ?? "",
        passwordRe: user?.passwordRe ?? "",
        phoneNumber: user ? (user as any).phoneNumber ?? "" : "",
        degreeId: user?.degreeId ?? 0,
        image: user?.image ?? null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (isEdit) {
            onUpdate?.(formData);
        } else {
            onCreate?.(formData);
        }
        onClose();
    };



    return (
        <DialogPrimitive.Root open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Trigger />
            <DialogPrimitive.Overlay className="fixed inset-0 bg-transparent" />
            <DialogPrimitive.Content className="fixed top-1/2 left-1/2 w-[min(95%,32rem)] max-w-full max-h-[80vh] overflow-auto -translate-x-1/2 -translate-y-1/2 bg-blue-100 p-6 rounded-lg shadow-xl border-2 border-blue-500 ring-2 ring-blue-300">
                <DialogPrimitive.Title className="text-lg font-semibold mb-4">
                    {isEdit ? "Kullanıcı Güncelle" : "Yeni Kullanıcı Ekle"}
                </DialogPrimitive.Title>

                <div className="grid grid-cols-2 gap-4">

                    <div className="grid gap-2">
                        <label>Kullanıcı Adı</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label>Ad</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label>Soyad</label>
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div className="col-span-2 grid gap-2">
                        <label>TC Kimlik No</label>
                        <input
                            type="text"
                            name="identityNumber"
                            value={formData.identityNumber}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    <div className="col-span-2 grid gap-2">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    {!isEdit && (
                        <>
                            <div className="grid gap-2">
                                <label>Telefon</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label>Derece</label>
                                <select
                                    name="degreeId"
                                    value={formData.degreeId}
                                    onChange={handleChange}
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value={1}>Doktor</option>
                                    <option value={2}>Diş Hekimi</option>
                                    <option value={3}>Akademisyen</option>
                                    <option value={4}>Sosyal Bilimci</option>
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <label>Şifre</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label>Şifre (Tekrar)</label>
                                <input
                                    type="password"
                                    name="passwordRe"
                                    value={formData.passwordRe}
                                    onChange={handleChange}
                                    className="border p-2 rounded-md w-full"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label>Resim</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, image: e.target.files?.[0] ?? null }));
                                    }}
                                />
                            </div>
                        </>
                    )}

                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        İptal
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {isEdit ? "Güncelle" : "Ekle"}
                    </button>
                </div>
            </DialogPrimitive.Content>
        </DialogPrimitive.Root>
    );

};

export default UserModal;