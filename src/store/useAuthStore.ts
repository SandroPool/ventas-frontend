import { create } from "zustand";
import { login, getProfile, getAllUsers, updateUser, deleteUser as deleteUserRequest, registerUser, refreshAccessToken } from "../services/auth.service";
import { toast } from "react-hot-toast";

export enum Role {
    ROOT = "ROOT",
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE"
}

export interface UserProfile {
    id_user: number;
    name: string;
    email: string;
    role: Role;
    status: boolean;
    createdAt: string;
}

export interface UserPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: UserProfile[];
}

interface AuthState {
    token: string | null;
    user: UserProfile | null;
    users: UserProfile[];
    pagination: Omit<UserPagination, "data"> | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    refreshSession: () => Promise<boolean>;
    logout: () => void;
    fetchProfile: () => Promise<void>;
    fetchUsers: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    updateUser: (id: number, userData: Partial<UserProfile>) => Promise<boolean>;
    deleteUser: (id: number) => Promise<boolean>;
    registerUser: (userData: Partial<UserProfile>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("token"),
    user: null,
    users: [],
    pagination: null,
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        const tokens = await login(email, password);

        if (!tokens) {
            toast.error("Credenciales incorrectas");
            set({ loading: false });
            return false;
        }

        localStorage.setItem("token", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        set({ token: tokens.accessToken });

        await useAuthStore.getState().fetchProfile();
        toast.success("Inicio de sesión exitoso");
        set({ loading: false });
        return true;
    },

    refreshSession: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return false;

        try {
            const tokens = await refreshAccessToken(refreshToken);
            if (!tokens) throw new Error("Refresh token inválido");

            localStorage.setItem("token", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            set({ token: tokens.accessToken });

            await useAuthStore.getState().fetchProfile();
            return true;
        } catch (error) {
            console.error("Error refrescando sesión:", error);
            useAuthStore.getState().logout(); // Cerrar sesión si el refresh token falla
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken"); // 🔴 Asegurar que se elimina el refreshToken también
        set({ token: null, user: null });
        toast.success("Sesión cerrada correctamente");
    },

    fetchProfile: async () => {
        set({ loading: true });
        const profile = await getProfile();
        if (profile) {
            set({ user: profile });
        }
        set({ loading: false });
    },

    fetchUsers: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loading: true });
        const response: UserPagination | null = await getAllUsers(page, limit, searchTerm);
        if (response) {
            set({ users: response.data, pagination: { page: response.page, limit: response.limit, total: response.total, totalPages: response.totalPages } });
        } else {
            toast.error("Error al obtener la lista de usuarios");
        }
        set({ loading: false });
    },

    updateUser: async (id, userData) => {
        const { users } = useAuthStore.getState();

        set({ loading: true });
        const updatedUser = await updateUser(id, userData);
        if (updatedUser) {
            set({
                users: users.map((user) =>
                    user.id_user === id ? { ...user, ...updatedUser } : user
                ),
            });
            await useAuthStore.getState().fetchUsers();
            toast.success("Usuario actualizado correctamente");
            set({ loading: false });
            return true;
        } else {
            toast.error("Error al actualizar usuario");
            set({ loading: false });
            return false;
        }
    },

    deleteUser: async (id) => {
        set({ loading: true });
        const result = await deleteUserRequest(id);
        if (result.success) {
            set((state) => ({
                users: state.users.filter((user) => user.id_user !== id),
                pagination: state.pagination ? {
                    ...state.pagination,
                    total: Math.max(0, state.pagination.total - 1),
                    totalPages: Math.max(1, Math.ceil((state.pagination.total - 1) / state.pagination.limit)),
                } : null,
            }));
            toast.success("Usuario eliminado correctamente");
            set({ loading: false });
            return true;
        }

        toast.error(result.error || "No se pudo eliminar el usuario");
        set({ loading: false });
        return false;
    },

    registerUser: async (userData) => {
        set({ loading: true });
        const response = await registerUser(userData);
        if (response) {
            await useAuthStore.getState().fetchUsers();
            toast.success("Usuario registrado con éxito");
            set({ loading: false });
            return true;
        } else {
            toast.error("Error al registrar usuario");
            set({ loading: false });
            return false;
        }
    }
}));
