/// <reference types="vite/client" />
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "https://hipocapp.com").replace(/\/$/, "");

/** The login response is stored whole under "user"; the token is inside it. */
export const getAccessToken = (): string => {
    try {
        return JSON.parse(localStorage.getItem("user") ?? "null")?.accessToken?.token ?? "";
    } catch {
        return "";
    }
};

/** Full address of a file uploaded to the backend (profile photos, content images). */
export const mediaUrl = (path?: string | null): string =>
    path ? `${API_BASE_URL}/${path.replace(/^\/+/, "")}` : "";
