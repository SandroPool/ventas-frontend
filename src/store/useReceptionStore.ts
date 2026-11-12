import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
    getProductReceptions,
    createProductReception,
    updateProductReception
} from "../services/reception.service";

export interface ProductReceptions {
    id_reception: number;
    id_product: number;
    quantity: number;
    purchase_price: number;
    id_supplier: number;
    id_user: number;
    date: string;
    product_name: string;
    price: number;
    supplier_name: string;
    user_name: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductReceptionsPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: ProductReceptions[];
}

interface ReceptionState {
    productReceptions: ProductReceptions[];
    paginationReception: Omit<ProductReceptionsPagination, "data"> | null;
    currentSearchTerm: string;
    loading: boolean;
    fetchProductReceptions: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    addProductReception: (reception: Omit<ProductReceptions, "id_reception" | "createdAt" | "updatedAt" | "product_name" | "price" | "supplier_name" | "user_name">) => Promise<void>;
    editProductReception: (id: number, reception: Partial<ProductReceptions>) => Promise<void>;
}

export const useReceptionStore = create<ReceptionState>((set) => ({
    productReceptions: [],
    paginationReception: null,
    currentSearchTerm: "",
    loading: false,

    fetchProductReceptions: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loading: true, currentSearchTerm: searchTerm });
        const response: ProductReceptionsPagination | null = await getProductReceptions(page, limit, searchTerm);
        if (response) {
            set({
                productReceptions: response.data,
                paginationReception: {
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                    totalPages: response.totalPages
                }
            });
        } else {
            toast.error("Error al obtener la lista de recepciones");
        }
        set({ loading: false });
    },

    addProductReception: async (reception) => {
        const { fetchProductReceptions, paginationReception, currentSearchTerm } = useReceptionStore.getState();
        set({ loading: true });
        const newReception = await createProductReception(reception);
        if (newReception) {
            toast.success("Recepción creada con éxito");
            // Vuelve a cargar la lista para asegurarte de obtener los datos completos
            await fetchProductReceptions(paginationReception?.page ?? 1, paginationReception?.limit ?? 10, currentSearchTerm);
        } else {
            toast.error("Error al crear recepción");
        }
        set({ loading: false });
    },

    editProductReception: async (id, reception) => {
        set({ loading: true });
        const updatedReception = await updateProductReception(id, reception);
        if (updatedReception) {
            set((state) => ({
                productReceptions: state.productReceptions.map((r) =>
                    r.id_reception === id ? updatedReception : r
                ),
            }));
            toast.success("Recepción actualizada");
        } else {
            toast.error("Error al actualizar recepción");
        }
        set({ loading: false });
    },
}));
