import { useEffect } from "react";
import { useStockStore } from "../store/useStockStore";

export const useStockAdministration = () => {
    const { stock, paginationStock, loading, fetchStock } = useStockStore();

    useEffect(() => {
        if (stock.length === 0) fetchStock();
    }, [fetchStock, stock.length]);

    return { stock, paginationStock, loading, fetchStock };
};
