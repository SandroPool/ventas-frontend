import { create } from "zustand";
import { toast } from "react-hot-toast";
import { getSales, createSale, updateSale, Sale, SalesPagination } from "../services/sales.service";

interface SalesState {
    sales: Sale[];
    loadingSale: boolean;
    paginationSales: Omit<SalesPagination, "data"> | null;
    currentPage: number;
    currentLimit: number;
    searchTerm: string;
    fetchSales: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    registerSale: (sale: Sale) => Promise<Sale | null>;
    editSale: (id_sale: number, sale: Sale) => Promise<boolean>;
}

export const useSalesStore = create<SalesState>((set) => ({
    sales: [],
    paginationSales: null,
    loadingSale: false,
    currentPage: 1,
    currentLimit: 10,
    searchTerm: "",

    // Obtener todas las ventas con paginación y búsqueda
    fetchSales: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loadingSale: true, currentPage: page, currentLimit: limit, searchTerm });
        const response: SalesPagination | null = await getSales(page, limit, searchTerm);

        if (response) {
            set({
                sales: response.data,
                paginationSales: {
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                    totalPages: response.totalPages,
                },
            });
        } else {
            toast.error("Error al obtener las ventas");
        }
        set({ loadingSale: false });
    },

    // Registrar una nueva venta
    registerSale: async (sale: Sale) => {
        const { fetchSales, currentPage, currentLimit, searchTerm } = useSalesStore.getState();
        set({ loadingSale: true });
        const response = await createSale(sale);

        if (response) {
            toast.success("Venta registrada con éxito");
            fetchSales(currentPage, currentLimit, searchTerm);
            set({ loadingSale: false });
            return response;
        } else {
            toast.error("Error al registrar la venta");
            set({ loadingSale: false });
            return null;
        }
    },

    // Editar una venta existente
    editSale: async (id_sale: number, sale: Sale) => {
        const { fetchSales, currentPage, currentLimit, searchTerm } = useSalesStore.getState();
        set({ loadingSale: true });
        const response = await updateSale(id_sale, sale);
        if (response) {
            toast.success("Venta actualizada con éxito");
            fetchSales(currentPage, currentLimit, searchTerm);
            set({ loadingSale: false });
            return true;
        } else {
            toast.error("Error al actualizar la venta");
            set({ loadingSale: false });
            return false;
        }
    },
}));
