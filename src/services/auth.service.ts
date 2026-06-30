import { useAuthStore, UserProfile } from "../store/useAuthStore";
const API_URL_CUSTOMERS = `${import.meta.env.VITE_BASE_URL}/users`;

export const login = async (email: string, password: string) => {
    try {
        const res = await fetch(`${API_URL_CUSTOMERS}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Credenciales incorrectas");

        const data = await res.json();
        return { accessToken: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
        console.error("Error en login:", error);
        return null;
    }
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const res = await fetch(`${API_URL_CUSTOMERS}/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) throw new Error("No se pudo refrescar el token");

        const data = await res.json();
        return { accessToken: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
        console.error("Error al refrescar el token:", error);
        return null;
    }
};

let refreshPromise: Promise<boolean> | null = null;

async function handleRefresh(): Promise<boolean> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = useAuthStore.getState().refreshSession();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = localStorage.getItem("token");

    if (!token) {
        const refreshed = await handleRefresh();
        if (!refreshed) {
            useAuthStore.getState().logout();
            throw new Error("No autenticado");
        }
        token = localStorage.getItem("token");
    }

    let res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401) {
        const refreshed = await handleRefresh();
        if (!refreshed) {
            useAuthStore.getState().logout();
            throw new Error("No autenticado");
        }

        token = localStorage.getItem("token");
        res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return res;
};

export const getProfile = async () => {
    try {
        const res = await fetchWithAuth(`${API_URL_CUSTOMERS}/profile`, { method: "GET" });

        if (!res.ok) throw new Error("No se pudo obtener el perfil");

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        return null;
    }
};

export const getAllUsers = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const url = new URL(`${API_URL_CUSTOMERS}`);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());

        // Solo agregamos searchTerm si el usuario escribió algo
        if (searchTerm.trim() !== "") {
            url.searchParams.append("searchTerm", searchTerm);
        }
        const res = await fetchWithAuth(url.toString(), { method: "GET" });

        if (!res.ok) throw new Error("No se pudo obtener la lista de usuarios");

        return await res.json();
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return null;
    }
};

export const updateUser = async (id: number, userData: Partial<UserProfile>) => {
    try {
        const res = await fetchWithAuth(`${API_URL_CUSTOMERS}/${id}`, {
            method: "PUT",
            body: JSON.stringify(userData),
        });

        if (!res.ok) throw new Error("No se pudo actualizar el usuario");

        return await res.json();
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return null;
    }
};

export const registerUser = async (userData: Partial<UserProfile>) => {
    try {
        const res = await fetchWithAuth(`${API_URL_CUSTOMERS}/register`, {
            method: "POST",
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "No se pudo registrar el usuario");
        }

        return await res.json();
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return null;
    }
};
