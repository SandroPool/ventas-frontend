import { useEffect } from "react";
import { useDashboardStore } from "../store/useDashboardStore";

export const useDashboard = () => {
    const { salesSummary, paymentMethods, topProducts, topUsers, topCustomers,
        salesTrend, lowStock, categorySales, returnsRate,
        loadingSales, loadingPayments, loadingProducts, loadingUsers, loadingCustomers,
        loadingTrend, loadingLowStock, loadingCategories, loadingReturns,
        errorSales, errorPayments, errorProducts, errorUsers, errorCustomers,
        errorTrend, errorLowStock, errorCategories, errorReturns,
        fetchSalesSummary, fetchPaymentMethods, fetchTopProducts, fetchTopUsers, fetchTopCustomers,
        fetchSalesTrend, fetchLowStock, fetchCategorySales, fetchReturnsRate
    } = useDashboardStore();

    useEffect(() => {
        fetchSalesSummary();
        fetchPaymentMethods();
        fetchTopProducts();
        fetchTopUsers();
        fetchTopCustomers();
        fetchSalesTrend();
        fetchLowStock();
        fetchCategorySales();
        fetchReturnsRate();
    }, [fetchSalesSummary, fetchPaymentMethods, fetchTopProducts, fetchTopUsers, fetchTopCustomers,
        fetchSalesTrend, fetchLowStock, fetchCategorySales, fetchReturnsRate]);

    return {
        salesSummary, paymentMethods, topProducts, topUsers, topCustomers,
        salesTrend, lowStock, categorySales, returnsRate,
        loadingSales, loadingPayments, loadingProducts, loadingUsers, loadingCustomers,
        loadingTrend, loadingLowStock, loadingCategories, loadingReturns,
        errorSales, errorPayments, errorProducts, errorUsers, errorCustomers,
        errorTrend, errorLowStock, errorCategories, errorReturns,
    };
};
