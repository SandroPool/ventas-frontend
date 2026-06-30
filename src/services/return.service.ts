import { fetchWithAuth } from "./auth.service";
const API_URL_RETURNS = `${import.meta.env.VITE_BASE_URL}/returns`;

export interface ReturnDetail {
    id_return_detail?: number;
    id_return?: number;
    id_product: number;
    quantity: number;
    unit_price: number;
    product?: { id_product: number; name: string };
}

export interface ReturnRecord {
    id_return?: number;
    id_sale: number;
    id_user: number;
    reason: string;
    total_amount?: number;
    date?: string;
    createdAt?: string;
    details: ReturnDetail[];
    sale?: { operation_number: string };
    user?: { name: string };
}

export interface ReturnsPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: ReturnRecord[];
}

export const getReturns = async (page = 1, limit = 10, searchTerm = "") => {
    try {
        const url = new URL(API_URL_RETURNS);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) url.searchParams.append("searchTerm", searchTerm);

        const response = await fetchWithAuth(url.toString(), { method: "GET" });
        if (!response.ok) throw new Error("Error al obtener devoluciones");
        return await response.json();
    } catch (error) {
        console.error("Error en getReturns:", error);
        return null;
    }
};

export const createReturn = async (returnRecord: {
    id_sale: number;
    id_user: number;
    reason: string;
    details: { id_product: number; quantity: number; unit_price: number }[];
}) => {
    try {
        const response = await fetchWithAuth(API_URL_RETURNS, {
            method: "POST",
            body: JSON.stringify(returnRecord),
        });
        if (!response.ok) throw new Error("Error al registrar devolución");
        return await response.json();
    } catch (error) {
        console.error("Error en createReturn:", error);
        return null;
    }
};

export const getReturnById = async (id: number) => {
    try {
        const response = await fetchWithAuth(`${API_URL_RETURNS}/${id}`, { method: "GET" });
        if (!response.ok) throw new Error("Error al obtener devolución");
        return await response.json();
    } catch (error) {
        console.error("Error en getReturnById:", error);
        return null;
    }
};

export const getReturnsBySale = async (id_sale: number) => {
    try {
        const response = await fetchWithAuth(`${API_URL_RETURNS}/sale/${id_sale}`, { method: "GET" });
        if (!response.ok) throw new Error("Error al obtener devoluciones de la venta");
        return await response.json();
    } catch (error) {
        console.error("Error en getReturnsBySale:", error);
        return null;
    }
};
