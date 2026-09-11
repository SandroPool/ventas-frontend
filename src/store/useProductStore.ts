import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
    getAllCategories, createCategory, updateCategory,
    getAllProducts, createProduct, updateProduct
} from "../services/product.service";

interface Category {
    id_category: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id_product: number;
    name: string;
    description: string;
    price: number;
    unit_type: string;
    status: boolean;
    sku: string;
    id_category: number;
    createdAt: string;
    fecha_vencimiento: string | null;
    stock?: number;
    min_sale_price?: number;
}

export interface ProductPagination {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    data: Product[];
}

interface ProductState {
    categories: Category[];
    products: Product[];
    pagination: Omit<ProductPagination, "data"> | null;
    loading: boolean;
    fetchCategories: () => Promise<void>;
    addCategory: (name: string) => Promise<void>;
    editCategory: (id: number, name: string) => Promise<void>;
    fetchProducts: (page?: number, limit?: number, searchTerm?: string) => Promise<void>;
    addProduct: (product: Omit<Product, "id_product" | "createdAt" | "sku" | "status">) => Promise<void>;
    editProduct: (id: number, product: Partial<Product>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    categories: [],
    products: [],
    pagination: null,
    loading: false,

    fetchCategories: async () => {
        set({ loading: true });
        const data = await getAllCategories();
        if (data) set({ categories: data });
        else toast.error("Error al obtener categorías");
        set({ loading: false });
    },

    addCategory: async (name) => {
        set({ loading: true });
        const newCategory = await createCategory(name);
        if (newCategory) {
            set((state) => ({ categories: [...state.categories, newCategory] }));
            toast.success("Categoría creada con éxito");
        } else {
            toast.error("Error al crear categoría");
        }
        set({ loading: false });
    },

    editCategory: async (id, name) => {
        set({ loading: true });
        const updatedCategory = await updateCategory(id, name);
        if (updatedCategory) {
            set((state) => ({
                categories: state.categories.map((cat) =>
                    cat.id_category === id ? updatedCategory : cat
                ),
            }));
            toast.success("Categoría actualizada");
        } else {
            toast.error("Error al actualizar categoría");
        }
        set({ loading: false });
    },

    fetchProducts: async (page = 1, limit = 10, searchTerm = "") => {
        set({ loading: true });
        const response: ProductPagination | null = await getAllProducts(page, limit, searchTerm);

        if (response) {
            set({ products: response.data, pagination: { page: response.page, limit: response.limit, total: response.total, totalPages: response.totalPages } });
        } else {
            toast.error("Error al obtener la lista de productos");
        }
        set({ loading: false });
    },

    addProduct: async (product) => {
        set({ loading: true });
        const newProduct = await createProduct(product);
        if (newProduct) {
            set((state) => ({ products: [...state.products, newProduct] }));
            toast.success("Producto creado con éxito");
        } else {
            toast.error("Error al crear producto");
        }
        set({ loading: false });
    },

    editProduct: async (id, product) => {
        set({ loading: true });
        const updatedProduct = await updateProduct(id, product);
        if (updatedProduct) {
            set((state) => ({
                products: state.products.map((p) =>
                    p.id_product === id ? updatedProduct : p
                ),
            }));
            toast.success("Producto actualizado");
        } else {
            toast.error("Error al actualizar producto");
        }
        set({ loading: false });
    },
}));
