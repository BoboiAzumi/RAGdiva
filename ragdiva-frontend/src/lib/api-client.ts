import { ApiError } from "./api-error";
import { getSession } from "./session";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        cache: "no-store",
        headers: {
            ...(options.body instanceof FormData
                ? {
                      "Content-Type": "multipart/form-data",
                  }
                : { "Content-Type": "application/json" }),
            Authorization: getSession() === "" ? "" : `Bearer ${getSession()}`,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);

        throw new ApiError(
            res.status,
            body?.message ?? `Request Failed: ${res.status}`,
        );
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json();
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: "DELETE",
            body: body ? JSON.stringify(body) : undefined,
        }),
    multipart: <T>(path: string, body: FormData) =>
        request<T>(path, { method: "POST", body }),
};
