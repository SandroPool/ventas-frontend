import { FC, JSX } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { TitleFuturistic } from "../components";
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { AlertCircle, LoaderPinwheel } from "lucide-react";

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

const Dashboard: FC = (): JSX.Element => {
    const { salesSummary, paymentMethods, topProducts, topUsers, topCustomers,
        salesTrend, lowStock, categorySales, returnsRate,
        loadingSales, loadingPayments, loadingProducts, loadingUsers, loadingCustomers,
        loadingTrend, loadingLowStock, loadingCategories, loadingReturns,
        errorSales, errorPayments, errorProducts, errorUsers, errorCustomers,
        errorTrend, errorLowStock, errorCategories, errorReturns
    } = useDashboard();

    return (
        <div className="px-4 lg:px-10 lg:pt-5">
            <TitleFuturistic children="Bienvenido al Dashboard" as="h1" />

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loadingSales ? <LoadingCard /> : errorSales ? <ErrorCard message={errorSales} /> : salesSummary ? (
                    <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Resumen de Ventas</h2>
                        <ResponsiveContainer width="95%" height={350}>
                            <BarChart data={[
                                { name: "Hoy", value: salesSummary.salesToday },
                                { name: "Semana", value: salesSummary.salesWeek },
                                { name: "Mes", value: salesSummary.salesMonth },
                                { name: "Año", value: salesSummary.salesYear },
                            ]}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `S/ ${value}`} />
                                <Bar dataKey="value" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : null}

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

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {loadingUsers ? <LoadingCard /> : errorUsers ? <ErrorCard message={errorUsers} /> : topUsers && topUsers.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card dark:text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Usuarios con Más Ventas</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 dark:border-dark-border">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-dark-elevated text-gray-800 dark:text-dark-primary">
                                        <th className="border px-4 py-2 text-left">Usuario</th>
                                        <th className="border px-4 py-2 text-left">Rol</th>
                                        <th className="border px-4 py-2 text-left">Total Ventas</th>
                                        <th className="border px-4 py-2 text-left">Monto Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topUsers.map((user, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-elevated">
                                            <td className="border px-4 py-2">{user.name}</td>
                                            <td className="border px-4 py-2">{user.role}</td>
                                            <td className="border px-4 py-2">{user.total_sales}</td>
                                            <td className="border px-4 py-2">S/ {user.total_sold.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

                {loadingCustomers ? <LoadingCard /> : errorCustomers ? <ErrorCard message={errorCustomers} /> : topCustomers && topCustomers.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card dark:text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Clientes con Más Compras</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 dark:border-dark-border">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-dark-elevated text-gray-800 dark:text-dark-primary">
                                        <th className="border px-4 py-2 text-left">Cliente</th>
                                        <th className="border px-4 py-2 text-left">Total Compras</th>
                                        <th className="border px-4 py-2 text-left">Total Gastado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCustomers.map((customer, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-elevated">
                                            <td className="border px-4 py-2">{customer.name}</td>
                                            <td className="border px-4 py-2">{customer.total_purchases}</td>
                                            <td className="border px-4 py-2">S/ {customer.total_spent.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
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

                {loadingLowStock ? <LoadingCard /> : errorLowStock ? <ErrorCard message={errorLowStock} /> : lowStock && lowStock.length > 0 ? (
                    <div className="bg-white dark:bg-dark-card dark:text-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-primary mb-4">Productos con Stock Bajo</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 dark:border-dark-border">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-dark-elevated text-gray-800 dark:text-dark-primary">
                                        <th className="border px-4 py-2 text-left">Producto</th>
                                        <th className="border px-4 py-2 text-left">SKU</th>
                                        <th className="border px-4 py-2 text-left">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStock.map((product, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-elevated">
                                            <td className="border px-4 py-2">{product.name}</td>
                                            <td className="border px-4 py-2">{product.sku}</td>
                                            <td className="border px-4 py-2">
                                                <span className={`font-semibold ${product.stock <= 2 ? 'text-red-500' : 'text-amber-500'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
