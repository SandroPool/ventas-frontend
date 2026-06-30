import { fetchWithAuth } from "./auth.service";
const API_URL_SALES = `${import.meta.env.VITE_BASE_URL}/sales`;

export interface Customer {
    name: string;
    first_surname: string;
    second_surname: string;
}

export interface Sale {
    id_sale?: number;
    id_user: number;
    id_customer: number;
    payment_method: string;
    operation_number: string;
    date: string;
    total?: number;
    status?: string;
    customer: Customer;
    details: SaleDetail[];
}

export interface SaleDetail {
    id_detail: number;
    id_sale: number;
    id_product: number;
    quantity: number;
    unit_price: number;
    createdAt: string;
    updatedAt?: string;
    product?: Product;
}

export interface Product {
    id_product: number;
    name: string;
    description: string;
    sku: string | null;
    price: number;
    unit_type: string;
    status: boolean;
    id_category: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SalesPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: Sale[];
}

// Obtener todas las ventas con paginación y búsqueda
export const getSales = async (page: number = 1, limit: number = 10, searchTerm: string = "") => {
    try {
        const url = new URL(API_URL_SALES);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) {
            url.searchParams.append("search", searchTerm);
        }

        const response = await fetchWithAuth(url.toString(), {
            method: "GET",
        });

        if (!response.ok) throw new Error("Error al obtener las ventas");

        return await response.json();
    } catch (error) {
        console.error("Error en getSales:", error);
        return null;
    }
};

// Crear una venta
export const createSale = async (sale: Sale) => {
    try {
        const response = await fetchWithAuth(API_URL_SALES, {
            method: "POST",
            body: JSON.stringify(sale),
        });

        if (!response.ok) throw new Error("Error al registrar la venta");

        return await response.json();
    } catch (error) {
        console.error("Error en createSale:", error);
        return null;
    }
};

// Actualizar una venta
export const updateSale = async (id_sale: number, sale: Sale) => {
    try {
        const response = await fetchWithAuth(`${API_URL_SALES}/${id_sale}`, {
            method: "PUT",
            body: JSON.stringify(sale),
        });

        if (!response.ok) throw new Error("Error al actualizar la venta");

        return await response.json();
    } catch (error) {
        console.error("Error en updateSale:", error);
        return null;
    }
};
