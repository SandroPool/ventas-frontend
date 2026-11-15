import { useEffect, useRef } from "react";
import { useStockStore } from "../store/useStockStore";

export const useStockAdministration = () => {
    const { stock, paginationStock, loading, fetchStock } = useStockStore();
    const hasLoadedStock = useRef(false);

    useEffect(() => {
        if (!hasLoadedStock.current && !paginationStock) {
            hasLoadedStock.current = true;
            fetchStock();
        }
    }, [fetchStock, paginationStock]);

    return { stock, paginationStock, loading, fetchStock };
};
