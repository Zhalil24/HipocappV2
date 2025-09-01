import React, { useState, useEffect } from "react";
import { ContentModel } from "@/core/models/content/contentModel";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ContentModalProps {
    content?: ContentModel; 
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: ContentModel) => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
    isOpen,
    onClose,
    content,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<ContentModel>({
        id: content?.id || 0,
        title: content?.title || "",
        description: content?.description || "",
        link: content?.link || "",
        imageURL: content?.imageURL || "",
        image: null,
    });

    useEffect(() => {
        setFormData({
            id: content?.id || 0,
            title: content?.title || "",
            description: content?.description || "",
            link: content?.link || "",
            imageURL: content?.imageURL || "",
            image: null,
        });
    }, [content]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = () => {
        onSubmit({ ...formData }); 
        onClose();
    };

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Trigger />
            <DialogPrimitive.Overlay className="fixed inset-0 bg-transparent" />
            <DialogPrimitive.Content className="fixed top-1/2 left-1/2 w-[min(95%,32rem)] max-w-full max-h-[90vh] overflow-auto -translate-x-1/2 -translate-y-1/2 bg-blue-100 p-6 rounded-lg shadow-xl border-2 border-blue-500 ring-2 ring-blue-300">
                <DialogPrimitive.Title className="text-lg font-semibold mb-4">
                    {content ? "İçerik Güncelle" : "Yeni İçerik Ekle"}
                </DialogPrimitive.Title>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label>Başlık</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="border p-2 rounded-md w-full" />
                    </div>
                    <div className="grid gap-2">
                        <label>Link</label>
                        <input name="link" value={formData.link} onChange={handleChange} className="border p-2 rounded-md w-full" />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <label>Açıklama</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 rounded-md w-full h-32 resize-none" />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <label>Görsel</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {formData.imageURL && (
                            <img src={`https://hipocapp.com/${formData.imageURL}`} alt="Preview" className="h-24 mt-2 rounded-md object-cover" />
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                        İptal
                    </button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        {content ? "Güncelle" : "Ekle"}
                    </button>
                </div>
            </DialogPrimitive.Content>
        </DialogPrimitive.Root>
    );
};
