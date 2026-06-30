import { fetchWithAuth } from "./auth.service";
const API_URL_INSTALLMENTS = `${import.meta.env.VITE_BASE_URL}/installments`;

export interface Installment {
    id_installment?: number;
    id_sale: number;
    amount: number;
    due_date: string;
    paid: boolean;
    paid_date?: string | null;
    createdAt?: string;
    sale?: { operation_number: string };
}

export interface InstallmentsPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: Installment[];
}

export const getInstallments = async (page = 1, limit = 10, searchTerm = "") => {
    try {
        const url = new URL(API_URL_INSTALLMENTS);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());
        if (searchTerm) url.searchParams.append("searchTerm", searchTerm);

        const response = await fetchWithAuth(url.toString(), { method: "GET" });
        if (!response.ok) throw new Error("Error al obtener cuotas");
        return await response.json();
    } catch (error) {
        console.error("Error en getInstallments:", error);
        return null;
    }
};

export const createInstallments = async (id_sale: number, installments: { amount: number; due_date: string }[]) => {
    try {
        const response = await fetchWithAuth(API_URL_INSTALLMENTS, {
            method: "POST",
            body: JSON.stringify({ id_sale, installments }),
        });
        if (!response.ok) throw new Error("Error al registrar cuotas");
        return await response.json();
    } catch (error) {
        console.error("Error en createInstallments:", error);
        return null;
    }
};

export const payInstallment = async (id_installment: number) => {
    try {
        const response = await fetchWithAuth(`${API_URL_INSTALLMENTS}/${id_installment}/pay`, {
            method: "PUT",
        });
        if (!response.ok) throw new Error("Error al pagar cuota");
        return await response.json();
    } catch (error) {
        console.error("Error en payInstallment:", error);
        return null;
    }
};

export const getInstallmentsBySale = async (id_sale: number) => {
    try {
        const response = await fetchWithAuth(`${API_URL_INSTALLMENTS}/sale/${id_sale}`, { method: "GET" });
        if (!response.ok) throw new Error("Error al obtener cuotas de la venta");
        return await response.json();
    } catch (error) {
        console.error("Error en getInstallmentsBySale:", error);
        return null;
    }
};
