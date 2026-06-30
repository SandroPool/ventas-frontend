import { useEffect, useState, lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoaderPinwheel } from "lucide-react";
import ProtectedRoute from "./ProtectedRoute";
import { Sidebar, Navbar } from "../components";
import { Role, useAuthStore } from "../store/useAuthStore";
import ProtectedRouteByRole from "./ProtectedRouteByRole";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UsersAdministration = lazy(() => import("../pages/UsersAdministration"));
const ProductsAdministration = lazy(() => import("../pages/ProductsAdministration"));
const ReceptionsAdministration = lazy(() => import("../pages/ReceptionsAdministration"));
const NotFound = lazy(() => import("../pages/NotFound"));
const SuppliersAdministration = lazy(() => import("../pages/SuppliersAdministration"));
const SalesAdministration = lazy(() => import("../pages/SalesAdministration"));
const CustomersAdministration = lazy(() => import("../pages/CustomersAdministration"));
const StockAdministration = lazy(() => import("../pages/StockAdministration"));
const TicketsAdministration = lazy(() => import("../pages/TicketsAdministration"));

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-64">
        <LoaderPinwheel size={36} className="animate-spin text-teal-500" />
    </div>
);

const AppRoutes = () => {
    const { token, user, fetchProfile } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (token && !user) {
            fetchProfile();
        }
    }, [token, user, fetchProfile]);

    return (
        <Router>
            {token && <Navbar />}
            {token && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
            <div className={`transition-all ${token ? "sm:ml-64 pt-16" : ""} ${isOpen ? "ml-3.5" : ""}`}>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={token ? <Navigate to={"/dashboard"} /> : <Login />} />

                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/products" element={
                            <ProtectedRoute>
                                <ProductsAdministration />
                            </ProtectedRoute>
                        } />

                        <Route path="/receptions" element={
                            <ProtectedRoute>
                                <ReceptionsAdministration />
                            </ProtectedRoute>
                        } />

                        <Route path="/suppliers" element={
                            <ProtectedRoute>
                                <SuppliersAdministration />
                            </ProtectedRoute>
                        } />

                        <Route path="/sales" element={
                            <ProtectedRoute>
                                <SalesAdministration />
                            </ProtectedRoute>
                        } />

                        <Route path="/customers" element={
                            <ProtectedRoute>
                                <CustomersAdministration />
                            </ProtectedRoute>
                        } />

                        <Route path="/stock" element={
                            <ProtectedRoute>
                                <StockAdministration />
                            </ProtectedRoute>
                        } />

                        <Route path="/tickets" element={
                            <ProtectedRoute>
                                <TicketsAdministration />
                            </ProtectedRoute>
                        } />

                        <Route
                            path="/users" element={
                                <ProtectedRouteByRole allowedRoles={[Role.ROOT, Role.ADMIN]}>
                                    <UsersAdministration />
                                </ProtectedRouteByRole>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
};

export default AppRoutes;