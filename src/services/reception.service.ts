import { ProductReceptions } from '../store/useReceptionStore';
import { fetchWithAuth } from "./auth.service";
const API_URL_PRODUCT_RECEPTIONS = `${import.meta.env.VITE_BASE_URL}/receptions`;

export interface ReceptionBatchPayload {
    date: string;
    items: Array<{
        id_product: number;
        id_supplier: number;
        quantity: number;
        purchase_price: number;
    }>;
}

// Obtener todas las recepciones con paginación y búsqueda
export const getProductReceptions = async (
    page: number = 1,
    limit: number = 10,
    searchTerm: string = "",
    dateFrom: string = "",
    dateTo: string = "",
) => {
    try {
        const url = new URL(API_URL_PRODUCT_RECEPTIONS);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) {
            url.searchParams.append("searchTerm", searchTerm);
        }
        if (dateFrom && dateTo) {
            url.searchParams.append("dateFrom", dateFrom);
            url.searchParams.append("dateTo", dateTo);
        }

        const response = await fetchWithAuth(url.toString(), {
            method: "GET",
        });

        if (!response.ok) throw new Error("Error al obtener recepciones");

        return await response.json();
    } catch (error) {
        console.error("Error en getProductReceptions:", error);
        return null;
    }
};

// Crear una nueva recepción
export const createProductReception = async (reception: Omit<ProductReceptions, "id_reception" | "createdAt" | "updatedAt" | "product_name" | "price" | "supplier_name" | "user_name">) => {
    try {
        const response = await fetchWithAuth(API_URL_PRODUCT_RECEPTIONS, {
            method: "POST",
            body: JSON.stringify(reception),
        });

        if (!response.ok) throw new Error("Error al crear recepción");

        return await response.json();
    } catch (error) {
        console.error("Error en createProductReception:", error);
        return null;
    }
};

export const createProductReceptionBatch = async (reception: ReceptionBatchPayload) => {
    const response = await fetchWithAuth(`${API_URL_PRODUCT_RECEPTIONS}/batch`, {
        method: "POST",
        body: JSON.stringify(reception),
    });

    if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error ?? "Error al registrar las recepciones");
    }

    return await response.json();
};

// Actualizar una recepción existente
export const updateProductReception = async (id: number, reception: Partial<ProductReceptions>) => {
    try {
        const response = await fetchWithAuth(`${API_URL_PRODUCT_RECEPTIONS}/${id}`, {
            method: "PUT",
            body: JSON.stringify(reception),
        });

        if (!response.ok) throw new Error("Error al actualizar recepción");

        return await response.json();
    } catch (error) {
        console.error("Error en updateProductReception:", error);
        return null;
    }
};
