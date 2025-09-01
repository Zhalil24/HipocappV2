import React from "react";


export function AdminFooter() {
    return (
        <footer className="border-t border-gray-200 bg-white py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-neutral-950 dark:text-gray-400">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6">
                <div>© {new Date().getFullYear()} Admin Panel • All rights reserved.</div>
            </div>
        </footer>
    );
}