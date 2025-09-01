// File: ListComponent.tsx
import React, { useState } from "react";
import { Pagination } from "../Pagination";
import { PaginationModel } from "@/core/models/pagination/paginationModel";
import { AllEntryModel } from "@/core/models/entries/allEntriesModel";

export const EntryList = ({
    pagination,
    onDelete,
    onPageChange,
}: {
    pagination: PaginationModel<AllEntryModel>;
    onDelete?: (id: number) => void;
    onPageChange: (page: number) => void;
}) => {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    const toggleExpand = (id: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (
        <div>
            <table className="w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Başlık</th>
                        <th className="p-2 border">Yorum</th>
                        <th className="p-2 border">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {pagination.items.map((item) => {
                        const isExpanded = expandedItems[item.id] || false;
                        const showToggle = item.description.length > 200;

                        return (
                            <tr key={item.id} className="text-center align-top">
                                <td className="p-2 border">{item.id}</td>
                                <td className="p-2 border">{item.titleName}</td>
                                <td className="p-2 border text-left">
                                    <div className="inline-block">
                                        {isExpanded
                                            ? item.description
                                            : `${item.description.slice(0, 200)}${showToggle ? "..." : ""}`}
                                        {showToggle && (
                                            <button
                                                className="ml-1 text-blue-500 hover:underline"
                                                onClick={() => toggleExpand(item.id)}
                                            >
                                                {isExpanded ? "Daha az göster" : "Devamını oku"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() => onDelete!(item.id)}
                                        className="px-3 py-1 rounded bg-red-500 text-white"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination
                index={pagination.index}
                size={pagination.size}
                count={pagination.count}
                pages={pagination.pages}
                onPageChange={onPageChange}
            />
        </div>
    );
};
