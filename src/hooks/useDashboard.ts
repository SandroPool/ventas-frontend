import { useEffect } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import type { RankingMetric, RankingPeriod } from "../services/dashboard.service";

export const useDashboard = (rankingPeriod: RankingPeriod, rankingMetric: RankingMetric) => {
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
        fetchSalesTrend();
        fetchLowStock();
        fetchCategorySales();
        fetchReturnsRate();
    }, [fetchSalesSummary, fetchPaymentMethods, fetchTopProducts,
        fetchSalesTrend, fetchLowStock, fetchCategorySales, fetchReturnsRate]);

    useEffect(() => {
        fetchTopUsers(rankingPeriod, rankingMetric);
        fetchTopCustomers(rankingPeriod, rankingMetric);
    }, [fetchTopUsers, fetchTopCustomers, rankingPeriod, rankingMetric]);

    return {
        salesSummary, paymentMethods, topProducts, topUsers, topCustomers,
        salesTrend, lowStock, categorySales, returnsRate,
        loadingSales, loadingPayments, loadingProducts, loadingUsers, loadingCustomers,
        loadingTrend, loadingLowStock, loadingCategories, loadingReturns,
        errorSales, errorPayments, errorProducts, errorUsers, errorCustomers,
        errorTrend, errorLowStock, errorCategories, errorReturns,
    };
};
