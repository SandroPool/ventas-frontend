import { create } from "zustand";
import { getSalesSummary, getPaymentMethods, getTopProducts, getTopUsers, getTopCustomers, getSalesTrend, getLowStock, getSalesByCategory, getReturnsRate } from "../services/dashboard.service";

interface SalesSummary {
    salesToday: number;
    salesWeek: number;
    salesMonth: number;
    salesYear: number;
}

interface PaymentMethods {
    method: string;
    count: number;
}

interface TopProduct {
    id_product: number;
    name: string;
    sku: string;
    total_sold: number;
}

interface TopUser {
    id_user: number;
    name: string;
    role: string;
    total_sales: number;
    total_sold: number;
}

interface TopCustomer {
    id_customer: number;
    name: string;
    total_purchases: number;
    total_spent: number;
}

interface SalesTrend {
    day: string;
    total: number;
}

interface LowStockProduct {
    id_product: number;
    name: string;
    sku: string;
    stock: number;
}

interface CategorySales {
    category: string;
    total: number;
    sales_count: number;
}

interface ReturnsRate {
    fully_returned_count: number;
    total_count: number;
    fully_returned_amount: number;
    total_amount: number;
    returns_rate: number;
    amount_rate: number;
}

interface DashboardState {
    salesSummary: SalesSummary | null;
    paymentMethods: PaymentMethods[] | null;
    topProducts: TopProduct[] | null;
    topUsers: TopUser[] | null;
    topCustomers: TopCustomer[] | null;
    salesTrend: SalesTrend[] | null;
    lowStock: LowStockProduct[] | null;
    categorySales: CategorySales[] | null;
    returnsRate: ReturnsRate | null;
    loadingSales: boolean;
    loadingPayments: boolean;
    loadingProducts: boolean;
    loadingUsers: boolean;
    loadingCustomers: boolean;
    loadingTrend: boolean;
    loadingLowStock: boolean;
    loadingCategories: boolean;
    loadingReturns: boolean;
    errorSales: string | null;
    errorPayments: string | null;
    errorProducts: string | null;
    errorUsers: string | null;
    errorCustomers: string | null;
    errorTrend: string | null;
    errorLowStock: string | null;
    errorCategories: string | null;
    errorReturns: string | null;
    fetchSalesSummary: () => Promise<void>;
    fetchPaymentMethods: () => Promise<void>;
    fetchTopProducts: () => Promise<void>;
    fetchTopUsers: () => Promise<void>;
    fetchTopCustomers: () => Promise<void>;
    fetchSalesTrend: () => Promise<void>;
    fetchLowStock: () => Promise<void>;
    fetchCategorySales: () => Promise<void>;
    fetchReturnsRate: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    salesSummary: null,
    paymentMethods: null,
    topProducts: null,
    topUsers: null,
    topCustomers: null,
    salesTrend: null,
    lowStock: null,
    categorySales: null,
    returnsRate: null,
    loadingSales: false,
    loadingPayments: false,
    loadingProducts: false,
    loadingUsers: false,
    loadingCustomers: false,
    loadingTrend: false,
    loadingLowStock: false,
    loadingCategories: false,
    loadingReturns: false,
    errorSales: null,
    errorPayments: null,
    errorProducts: null,
    errorUsers: null,
    errorCustomers: null,
    errorTrend: null,
    errorLowStock: null,
    errorCategories: null,
    errorReturns: null,

    fetchSalesSummary: async () => {
        try {
            set({ loadingSales: true, salesSummary: null, errorSales: null });
            const data = await getSalesSummary();
            set({ salesSummary: data });
        } catch (error) {
            console.error("Error al obtener el resumen de ventas", error);
            set({ errorSales: "Error al cargar resumen de ventas" });
        } finally {
            set({ loadingSales: false });
        }
    },
    fetchPaymentMethods: async () => {
        try {
            set({ loadingPayments: true, paymentMethods: null, errorPayments: null });
            const data = await getPaymentMethods();
            set({ paymentMethods: data });
        } catch (error) {
            console.error("Error al obtener los métodos de pago", error);
            set({ errorPayments: "Error al cargar métodos de pago" });
        } finally {
            set({ loadingPayments: false });
        }
    },
    fetchTopProducts: async () => {
        try {
            set({ loadingProducts: true, topProducts: null, errorProducts: null });
            const data = await getTopProducts();
            set({ topProducts: data });
        } catch (error) {
            console.error("Error al obtener los productos más vendidos", error);
            set({ errorProducts: "Error al cargar productos más vendidos" });
        } finally {
            set({ loadingProducts: false });
        }
    },
    fetchTopUsers: async () => {
        try {
            set({ loadingUsers: true, topUsers: null, errorUsers: null });
            const data = await getTopUsers();
            set({ topUsers: data });
        } catch (error) {
            console.error("Error al obtener los usuarios con más ventas", error);
            set({ errorUsers: "Error al cargar usuarios con más ventas" });
        } finally {
            set({ loadingUsers: false });
        }
    },
    fetchTopCustomers: async () => {
        try {
            set({ loadingCustomers: true, topCustomers: null, errorCustomers: null });
            const data = await getTopCustomers();
            set({ topCustomers: data });
        } catch (error) {
            console.error("Error al obtener los clientes con más compras", error);
            set({ errorCustomers: "Error al cargar clientes con más compras" });
        } finally {
            set({ loadingCustomers: false });
        }
    },
    fetchSalesTrend: async () => {
        try {
            set({ loadingTrend: true, salesTrend: null, errorTrend: null });
            const data = await getSalesTrend();
            set({ salesTrend: data });
        } catch (error) {
            console.error("Error al obtener la tendencia de ventas", error);
            set({ errorTrend: "Error al cargar tendencia de ventas" });
        } finally {
            set({ loadingTrend: false });
        }
    },
    fetchLowStock: async () => {
        try {
            set({ loadingLowStock: true, lowStock: null, errorLowStock: null });
            const data = await getLowStock();
            set({ lowStock: data });
        } catch (error) {
            console.error("Error al obtener productos con stock bajo", error);
            set({ errorLowStock: "Error al cargar stock bajo" });
        } finally {
            set({ loadingLowStock: false });
        }
    },
    fetchCategorySales: async () => {
        try {
            set({ loadingCategories: true, categorySales: null, errorCategories: null });
            const data = await getSalesByCategory();
            set({ categorySales: data });
        } catch (error) {
            console.error("Error al obtener ventas por categoría", error);
            set({ errorCategories: "Error al cargar ventas por categoría" });
        } finally {
            set({ loadingCategories: false });
        }
    },
    fetchReturnsRate: async () => {
        try {
            set({ loadingReturns: true, returnsRate: null, errorReturns: null });
            const data = await getReturnsRate();
            set({ returnsRate: data });
        } catch (error) {
            console.error("Error al obtener la tasa de devoluciones", error);
            set({ errorReturns: "Error al cargar tasa de devoluciones" });
        } finally {
            set({ loadingReturns: false });
        }
    },
}));
