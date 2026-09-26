import { Product } from '../store/useProductStore';
import { fetchWithAuth } from "./auth.service";
const API_URL_CATEGORIES = `${import.meta.env.VITE_BASE_URL}/categories`;
const API_URL_PRODUCTS = `${import.meta.env.VITE_BASE_URL}/products`;

export const getAllCategories = async () => {
    try {
        const res = await fetchWithAuth(API_URL_CATEGORIES, {
            method: "GET",
        });

        if (!res.ok) throw new Error("No se pudieron obtener las categorías");

        return await res.json();
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return null;
    }
};

export const createCategory = async (name: string) => {
    try {
        const res = await fetchWithAuth(API_URL_CATEGORIES, {
            method: "POST",
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error("No se pudo crear la categoría");

        return await res.json();
    } catch (error) {
        console.error("Error al crear categoría:", error);
        return null;
    }
};

export const updateCategory = async (id: number, name: string) => {
    try {
        const res = await fetchWithAuth(`${API_URL_CATEGORIES}/${id}`, {
            method: "PUT",
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error("No se pudo actualizar la categoría");

        return await res.json();
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
        return null;
    }
};

export const getAllProducts = async (page: number = 1, limit: number = 10, searchTerm: string = "", activeOnly: boolean = false) => {
    try {

        const url = new URL(`${API_URL_PRODUCTS}`);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());

        // Solo agregamos searchTerm si el usuario escribió algo
        if (searchTerm.trim() !== "") {
            url.searchParams.append("searchTerm", searchTerm);
        }
        if (activeOnly) {
            url.searchParams.append("activeOnly", "true");
        }

        const res = await fetchWithAuth(url.toString(), {
            method: "GET",
        });

        if (!res.ok) throw new Error("No se pudieron obtener los productos");

        const responseFinal = await res.json();

        return responseFinal;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return null;
    }
};

export const createProduct = async (product: Omit<Product, "id_product" | "createdAt" | "sku" | "status">) => {
    try {
        const res = await fetchWithAuth(API_URL_PRODUCTS, {
            method: "POST",
            body: JSON.stringify(product),
        });

        if (!res.ok) throw new Error("No se pudo crear el producto");

        return await res.json();
    } catch (error) {
        console.error("Error al crear producto:", error);
        return null;
    }
};

export const updateProduct = async (id: number, product: Partial<Product>) => {
    try {
        const res = await fetchWithAuth(`${API_URL_PRODUCTS}/${id}`, {
            method: "PUT",
            body: JSON.stringify(product),
        });

        if (!res.ok) throw new Error("No se pudo actualizar el producto");

        return await res.json();
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return null;
    }
};
