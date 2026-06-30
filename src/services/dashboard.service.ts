import { fetchWithAuth } from "./auth.service";
const API_URL_DASHBOARD = `${import.meta.env.VITE_BASE_URL}/dashboard`;

export const getSalesSummary = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/sales-summary`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo el resumen de ventas");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getSalesSummary:", error);
        throw error;
    }
};

export const getPaymentMethods = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/payment-methods`, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error("Error obteniendo los métodos de pago");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getPaymentMethods:", error);
        throw error;
    }
};

export const getTopProducts = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/top-products`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo los productos más vendidos");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getTopProducts:", error);
        throw error;
    }
};

export const getTopUsers = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/top-users`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo los usuarios con más ventas");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getTopUsers:", error);
        throw error;
    }
};

export const getTopCustomers = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/top-customers`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo los clientes con más compras");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getTopCustomers:", error);
        throw error;
    }
};

export const getSalesTrend = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/sales-trend`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo la tendencia de ventas");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getSalesTrend:", error);
        throw error;
    }
};

export const getLowStock = async (threshold = 5) => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/low-stock?threshold=${threshold}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo productos con stock bajo");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getLowStock:", error);
        throw error;
    }
};

export const getSalesByCategory = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/sales-by-category`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo ventas por categoría");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getSalesByCategory:", error);
        throw error;
    }
};

export const getReturnsRate = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL_DASHBOARD}/returns-rate`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error obteniendo la tasa de devoluciones");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en getReturnsRate:", error);
        throw error;
    }
};
