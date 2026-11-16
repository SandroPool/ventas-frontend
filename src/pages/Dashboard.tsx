import { FC, JSX, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { TitleFuturistic } from "../components";
import { Link } from "react-router-dom";
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { AlertCircle, AlertTriangle, ArrowRight, Banknote, LoaderPinwheel, Receipt, type LucideIcon } from "lucide-react";
import type { RankingMetric, RankingPeriod } from "../services/dashboard.service";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ErrorCard = ({ message }: { message: string }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-red-500 dark:text-red-400 gap-2">
        <AlertCircle size={24} />
        <p className="text-sm text-center">{message}</p>
    </div>
);

const LoadingCard = () => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 min-h-[300px]">
        <LoaderPinwheel size={36} className="animate-spin text-teal-500" />
        <p className="text-sm text-gray-500 dark:text-dark-muted">Cargando...</p>
    </div>
);

const MetricCard = ({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}: {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    iconClassName: string;
}) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-dark-muted">{title}</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-dark-primary">{value}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted">{description}</p>
            </div>
            <div className={`rounded-xl p-3 ${iconClassName}`}>
                <Icon size={22} />
            </div>
        </div>
    </div>
);

const LoadingMetricCard = () => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg flex min-h-[150px] items-center justify-center">
        <LoaderPinwheel size={30} className="animate-spin text-teal-500" />
    </div>
);

const formatCurrency = (value: number) => new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
}).format(value);

const getRankClassName = (index: number) => {
    if (index === 0) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
    if (index === 1) return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
    if (index === 2) return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200";
    return "bg-gray-100 text-gray-600 dark:bg-dark-elevated dark:text-dark-muted";
};

const getStockSeverity = (stock: number) => {
    if (stock <= 0) {
        return { label: "Agotado", className: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200" };
    }
    if (stock <= 2) {
        return { label: "Crítico", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200" };
    }
    return { label: "Bajo", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" };
};

const Dashboard: FC = (): JSX.Element => {
    const [rankingPeriod, setRankingPeriod] = useState<RankingPeriod>("all");
    const [rankingMetric, setRankingMetric] = useState<RankingMetric>("amount");
    const { salesSummary, paymentMethods, topProducts, topUsers, topCustomers,
        salesTrend, lowStock, categorySales, returnsRate,
        loadingSales, loadingPayments, loadingProducts, loadingUsers, loadingCustomers,
        loadingTrend, loadingLowStock, loadingCategories, loadingReturns,
        errorSales, errorPayments, errorProducts, errorUsers, errorCustomers,
        errorTrend, errorLowStock, errorCategories, errorReturns
    } = useDashboard(rankingPeriod, rankingMetric);
    const rankingPeriodLabel = rankingPeriod === "all"
        ? "Histórico"
        : rankingPeriod === "30d"
            ? "Últimos 30 días"
            : "Últimos 90 días";
    const rankingMetricLabel = rankingMetric === "count" ? "cantidad de operaciones" : "monto total";

    return (
        <div className="px-4 lg:px-10 lg:pt-5">
            <TitleFuturistic children="Bienvenido al Dashboard" as="h1" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {loadingSales ? <LoadingMetricCard /> : errorSales ? <ErrorCard message={errorSales} /> : salesSummary ? (
                    <MetricCard
                        title="Ventas de hoy"
                        value={formatCurrency(salesSummary.salesToday)}
                        description={`${salesSummary.salesTodayCount} ${salesSummary.salesTodayCount === 1 ? "venta registrada" : "ventas registradas"}`}
                        icon={Banknote}
                        iconClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                    />
                ) : null}

                {loadingSales ? <LoadingMetricCard /> : errorSales ? <ErrorCard message={errorSales} /> : salesSummary ? (
                    <MetricCard
                        title="Ticket promedio de hoy"
                        value={formatCurrency(salesSummary.averageTicketToday)}
                        description={salesSummary.salesTodayCount > 0
                            ? `Promedio de ${salesSummary.salesTodayCount} ${salesSummary.salesTodayCount === 1 ? "venta" : "ventas"}`
                            : "Sin ventas registradas hoy"}
                        icon={Receipt}
                        iconClassName="bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300"
                    />
                ) : null}

                {loadingLowStock ? <LoadingMetricCard /> : errorLowStock ? <ErrorCard message={errorLowStock} /> : lowStock ? (
                    <MetricCard
                        title="Alertas de stock bajo"
                        value={lowStock.length.toString()}
                        description={lowStock.length === 0
                            ? "Sin productos bajo el umbral"
                            : "Productos con 5 unidades o menos"}
                        icon={AlertTriangle}
                        iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
                    />
                ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {loadingPayments ? <LoadingCard /> : errorPayments ? <ErrorCard message={errorPayments} /> : paymentMethods && paymentMethods.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Métodos de Pago Más Utilizados</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={paymentMethods}
                                    dataKey="count"
                                    nameKey="method"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label={({ value }) => `${value}`}
                                    labelLine={false}
                                >
                                    {paymentMethods.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ cursor: "pointer" }} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${((value as number) * 100 / paymentMethods.reduce((acc, cur) => acc + cur.count, 0)).toFixed(2)}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}

                {loadingProducts ? <LoadingCard /> : errorProducts ? <ErrorCard message={errorProducts} /> : topProducts && topProducts.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Productos Más Vendidos</h2>
                        <ResponsiveContainer width="95%" height={350}>
                            <BarChart data={topProducts} layout="vertical">
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <Tooltip />
                                <Bar dataKey="total_sold" fill="#4F46E5" radius={[0, 10, 10, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}
            </div>

            <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-primary">Rankings de ventas</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                            Ordenados por {rankingMetricLabel} · {rankingPeriodLabel}
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto md:min-w-[440px]">
                        <label className="text-sm font-medium text-gray-700 dark:text-dark-primary">
                            Periodo
                            <select
                                aria-label="Periodo de los rankings"
                                value={rankingPeriod}
                                onChange={(event) => setRankingPeriod(event.target.value as RankingPeriod)}
                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-dark-border dark:bg-dark-elevated dark:text-dark-primary"
                            >
                                <option value="all">Todo el historial</option>
                                <option value="30d">Últimos 30 días</option>
                                <option value="90d">Últimos 90 días</option>
                            </select>
                        </label>
                        <label className="text-sm font-medium text-gray-700 dark:text-dark-primary">
                            Ordenar por
                            <select
                                aria-label="Criterio para ordenar los rankings"
                                value={rankingMetric}
                                onChange={(event) => setRankingMetric(event.target.value as RankingMetric)}
                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-dark-border dark:bg-dark-elevated dark:text-dark-primary"
                            >
                                <option value="amount">Monto total</option>
                                <option value="count">Cantidad de operaciones</option>
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-2">
                {loadingUsers ? <LoadingCard /> : errorUsers ? <ErrorCard message={errorUsers} /> : (
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-card">
                        <div className="flex items-start justify-between gap-3 border-b border-gray-200 p-5 dark:border-dark-border">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-primary">Usuarios</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                                    Top 5 por {rankingMetric === "count" ? "cantidad de ventas" : "monto vendido"}
                                </p>
                            </div>
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                {rankingPeriodLabel}
                            </span>
                        </div>
                        {topUsers && topUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-[620px] w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-dark-elevated dark:text-dark-muted">
                                        <tr>
                                            <th className="w-14 px-4 py-3">#</th>
                                            <th className="px-4 py-3">Usuario</th>
                                            <th className="px-4 py-3">Rol</th>
                                            <th className={`px-4 py-3 text-right ${rankingMetric === "count" ? "text-teal-700 dark:text-teal-300" : ""}`}>Ventas</th>
                                            <th className={`px-4 py-3 text-right ${rankingMetric === "amount" ? "text-teal-700 dark:text-teal-300" : ""}`}>Monto vendido</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                        {topUsers.map((user, index) => (
                                            <tr key={user.id_user} className="transition-colors hover:bg-gray-50 dark:hover:bg-dark-elevated/70">
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${getRankClassName(index)}`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-dark-primary">{user.name}</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-elevated dark:text-dark-muted">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 text-right tabular-nums ${rankingMetric === "count" ? "font-bold text-teal-700 dark:text-teal-300" : "text-gray-600 dark:text-dark-muted"}`}>
                                                    {user.total_sales.toLocaleString("es-PE")}
                                                </td>
                                                <td className={`px-4 py-3 text-right tabular-nums ${rankingMetric === "amount" ? "font-bold text-teal-700 dark:text-teal-300" : "text-gray-900 dark:text-dark-primary"}`}>
                                                    {formatCurrency(user.total_sold)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="px-5 py-10 text-center text-sm text-gray-500 dark:text-dark-muted">
                                No hay ventas para este periodo.
                            </p>
                        )}
                    </section>
                )}

                {loadingCustomers ? <LoadingCard /> : errorCustomers ? <ErrorCard message={errorCustomers} /> : (
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-card">
                        <div className="flex items-start justify-between gap-3 border-b border-gray-200 p-5 dark:border-dark-border">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-primary">Clientes</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                                    Top 5 por {rankingMetric === "count" ? "cantidad de compras" : "monto gastado"}
                                </p>
                            </div>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {rankingPeriodLabel}
                            </span>
                        </div>
                        {topCustomers && topCustomers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-[560px] w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-dark-elevated dark:text-dark-muted">
                                        <tr>
                                            <th className="w-14 px-4 py-3">#</th>
                                            <th className="px-4 py-3">Cliente</th>
                                            <th className={`px-4 py-3 text-right ${rankingMetric === "count" ? "text-indigo-700 dark:text-indigo-300" : ""}`}>Compras</th>
                                            <th className={`px-4 py-3 text-right ${rankingMetric === "amount" ? "text-indigo-700 dark:text-indigo-300" : ""}`}>Monto gastado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                        {topCustomers.map((customer, index) => (
                                            <tr key={customer.id_customer} className="transition-colors hover:bg-gray-50 dark:hover:bg-dark-elevated/70">
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${getRankClassName(index)}`}>
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-dark-primary">{customer.name}</td>
                                                <td className={`px-4 py-3 text-right tabular-nums ${rankingMetric === "count" ? "font-bold text-indigo-700 dark:text-indigo-300" : "text-gray-600 dark:text-dark-muted"}`}>
                                                    {customer.total_purchases.toLocaleString("es-PE")}
                                                </td>
                                                <td className={`px-4 py-3 text-right tabular-nums ${rankingMetric === "amount" ? "font-bold text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-dark-primary"}`}>
                                                    {formatCurrency(customer.total_spent)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="px-5 py-10 text-center text-sm text-gray-500 dark:text-dark-muted">
                                No hay compras para este periodo.
                            </p>
                        )}
                    </section>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loadingTrend ? <LoadingCard /> : errorTrend ? <ErrorCard message={errorTrend} /> : salesTrend && salesTrend.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 md:col-span-2 lg:col-span-3">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Tendencia de Ventas (Últimos 30 Días)</h2>
                        <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                            <AreaChart data={salesTrend} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip formatter={(value) => `S/ ${value}`} />
                                <Area type="monotone" dataKey="total" stroke="#4F46E5" fill="#4F46E5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loadingCategories ? <LoadingCard /> : errorCategories ? <ErrorCard message={errorCategories} /> : categorySales && categorySales.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Ventas por Categoría</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categorySales}
                                    dataKey="total"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label={({ value }) => `S/${(value as number).toFixed(0)}`}
                                    labelLine={false}
                                >
                                    {categorySales.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `S/ ${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}

                {loadingLowStock ? <LoadingCard /> : errorLowStock ? <ErrorCard message={errorLowStock} /> : lowStock ? (
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-card">
                        <div className="flex items-start justify-between gap-3 border-b border-gray-200 p-5 dark:border-dark-border">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-dark-primary">Stock bajo</h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
                                    {lowStock.length} {lowStock.length === 1 ? "producto requiere" : "productos requieren"} atención
                                </p>
                            </div>
                            <Link
                                to="/stock"
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-300 dark:hover:bg-dark-elevated"
                            >
                                Ver stock
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>
                        {lowStock.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-dark-muted">
                                No hay productos bajo el umbral de 5 unidades.
                            </p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-[420px] w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-dark-elevated dark:text-dark-muted">
                                            <tr>
                                                <th className="px-4 py-3">Producto</th>
                                                <th className="px-4 py-3">SKU</th>
                                                <th className="px-4 py-3 text-right">Stock</th>
                                                <th className="px-4 py-3 text-right">Nivel</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                                            {lowStock.slice(0, 5).map((product) => {
                                                const severity = getStockSeverity(product.stock);
                                                return (
                                                    <tr key={product.id_product} className="transition-colors hover:bg-gray-50 dark:hover:bg-dark-elevated/70">
                                                        <td className="max-w-[160px] truncate px-4 py-3 font-medium text-gray-900 dark:text-dark-primary" title={product.name}>
                                                            {product.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500 dark:text-dark-muted">{product.sku}</td>
                                                        <td className="px-4 py-3 text-right font-bold tabular-nums text-gray-900 dark:text-dark-primary">
                                                            {product.stock}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${severity.className}`}>
                                                                {severity.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {lowStock.length > 5 && (
                                    <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500 dark:border-dark-border dark:text-dark-muted">
                                        Mostrando los 5 productos más críticos de {lowStock.length}.
                                    </p>
                                )}
                            </>
                        )}
                    </section>
                ) : null}

                {loadingReturns ? <LoadingCard /> : errorReturns ? <ErrorCard message={errorReturns} /> : returnsRate ? (
                    <div className="bg-white dark:bg-dark-card dark:text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Tasa de Devoluciones</h2>
                        <div className="flex flex-col gap-6">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-red-500">{returnsRate.returns_rate.toFixed(1)}%</p>
                                <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">de ventas anuladas</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400">{returnsRate.fully_returned_count}</p>
                                    <p className="text-gray-500 dark:text-dark-muted">Anuladas</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-dark-elevated p-3 rounded-lg text-center">
                                    <p className="text-lg font-bold text-gray-700 dark:text-dark-primary">{returnsRate.total_count}</p>
                                    <p className="text-gray-500 dark:text-dark-muted">Totales</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 dark:text-dark-muted text-center">
                                S/ {returnsRate.fully_returned_amount.toFixed(2)} de S/ {returnsRate.total_amount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Dashboard;
