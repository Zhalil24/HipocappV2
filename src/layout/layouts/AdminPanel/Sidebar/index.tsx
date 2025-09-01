import React from "react";
import {
    Home, Users, BarChart3, Settings,
    FolderKanban, Shield, ChevronDown
} from "lucide-react";
import type { Item } from "../../../../Utilities/constants/panelItems"

export default function AdminSidebar({
    open,
    setOpen,
    items,
    onItemSelected,
}: {
    open: boolean;
    items: Item[];
    setOpen: (v: boolean) => void;
    onItemSelected: (item: Item | null) => void;
}) {
    const [openKey, setOpenKey] = React.useState<string | null>("Kullanıcılar");
    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        onItemSelected(item);
        setOpen(false);
    };

    const handleSubItemClick = (subItem: Item) => {
        setSelectedItem(subItem);
        onItemSelected(subItem);
        setOpen(false);
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden ${open ? "block" : "hidden"}`}
                onClick={() => setOpen(false)}
            />
            <aside className={`fixed z-50 h-dvh w-72 border-r border-gray-200 bg-white transition-transform duration-300
        dark:border-gray-800 dark:bg-neutral-950 md:static md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}>

                <nav className="flex flex-col gap-1 p-3">
                    {items.map((it) => {
                        const hasChildren = Boolean(it.children?.length);
                        const Icon = it.icon;
                        const isSelected = selectedItem?.label === it.label;

                        if (!hasChildren) {
                            return (
                                <button
                                    key={it.label}
                                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium
                                        border border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-900
                                        ${isSelected
                                            ? "bg-gray-100 text-gray-900 dark:bg-neutral-900 dark:text-gray-100"
                                            : "text-gray-700 dark:text-gray-300"}`}
                                    onClick={() => handleItemClick(it)}
                                >
                                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                                    <span className="truncate">{it.label}</span>
                                </button>
                            );
                        }

                        const key = it.label;
                        const isOpen = openKey === key;

                        return (
                            <div key={key} className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
                                <button
                                    className="flex w-full items-center justify-between bg-gray-50 px-3 py-2 text-left text-sm font-semibold
                                hover:bg-gray-100 dark:bg-neutral-900 dark:text-gray-100 dark:hover:bg-neutral-800"
                                    onClick={() => setOpenKey((prev) => (prev === key ? null : key))}
                                >
                                    <span className="flex items-center gap-3 text-gray-800 dark:text-gray-100">
                                        {Icon && <Icon className="h-4 w-4" />}
                                        {it.label}
                                    </span>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                </button>

                                <div className={`${isOpen ? "block" : "hidden"} bg-white dark:bg-neutral-950`}>
                                    {it.children!.map((child) => (
                                        <div key={child.label}>
                                            {child.endpoints
                                                .filter((e) => e.hasPage)
                                                .map((endpoint) => (
                                                    <div
                                                        key={endpoint.operation}
                                                        className={`block px-4 py-2 text-sm cursor-pointer
            ${selectedItem?.label === endpoint.label
                                                                ? "text-gray-900 dark:text-gray-100"
                                                                : "text-gray-700 dark:text-gray-300"}
            hover:bg-gray-50 dark:hover:bg-neutral-900`}
                                                        onClick={() => handleSubItemClick({
                                                            ...it,
                                                            label: endpoint.label!,
                                                        })}
                                                    >
                                                        {endpoint.label}
                                                    </div>
                                                ))}
                                        </div>
                                    ))}

                                </div>
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}