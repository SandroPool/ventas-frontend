import { create } from "zustand";
import { toast } from "react-hot-toast";
import { getStock, StockItem, StockPagination, STOCK_PAGE_SIZE } from "../services/stock.service";

interface StockState {
    stock: StockItem[];
    loading: boolean;
    paginationStock: Omit<StockPagination, "data"> | null;
    fetchStock: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
    stock: [],
    paginationStock: null,
    loading: false,

    fetchStock: async (page = 1, limit = STOCK_PAGE_SIZE, searchTerm = "") => {
        set({ loading: true });
        const response: StockPagination | null = await getStock(page, limit, searchTerm);

        if (response) {
            set({
                stock: response.data,
                paginationStock: {
                    page: response.page,
                    limit: response.limit,
                    total: response.total,
                    totalPages: response.totalPages,
                },
            });
        } else {
            toast.error("Error al obtener el stock");
        }
        set({ loading: false });
    },
}));
