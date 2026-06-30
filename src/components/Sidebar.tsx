import { NavLink } from "react-router-dom";
import { Menu, X, BarChartBig, UserCog, PackageCheck, Store, HandCoins, UsersRound, ShoppingBasket, Speech, Boxes, Dock } from "lucide-react";
import { useAuthStore, Role } from '../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

const FuturisticNavLink = ({ to, label, Icon }: { to: string; label: string; Icon: React.ElementType }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative flex items-center w-full px-6 py-3 text-left font-semibold uppercase transition-all duration-300 rounded-md
            bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white
            ${isActive ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg" : ""} 
            hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white`
        }
    >
        <Icon size={20} className="mr-3" />
        {label}
    </NavLink>
);

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { user, token } = useAuthStore();
    let userRole = user?.role || '';
    if (!userRole && token) {
        try { userRole = jwtDecode<{ role: string }>(token).role; } catch { /* fallback */ }
    }

    return (
        <>
            {/* Botón de menú en móvil */}
            <div className="fixed bottom-4 left-4 z-50 sm:hidden">
                <button
                    className="text-white dark:text-dark-primary bg-gray-900 dark:bg-dark-card p-3 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-dark-elevated transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-dark-base shadow-lg border-r border-gray-200 dark:border-dark-border
                transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-64"} sm:translate-x-0 z-40`}
            >
                <div className="flex flex-col h-full p-4 space-y-4">
                    <div className="text-gray-900 dark:text-dark-primary text-lg font-extrabold tracking-wider">
                        <NavLink to="/" onClick={() => setIsOpen(false)}> <HandCoins size={50} /></NavLink>
                    </div>

                    {/* Enlaces */}
                    <nav className="space-y-2">
                        {userRole === Role.ROOT || userRole === Role.ADMIN ? (
                            <>
                                <FuturisticNavLink to="/dashboard" label="Estadísticas" Icon={BarChartBig} />
                                <FuturisticNavLink to="/products" label="Productos" Icon={PackageCheck} />
                                <FuturisticNavLink to="/suppliers" label="Proveedores" Icon={UsersRound} />
                                <FuturisticNavLink to="/receptions" label="Recepciones" Icon={Store} />
                                <FuturisticNavLink to="/stock" label="Stock" Icon={Boxes} />
                                <FuturisticNavLink to="/customers" label="Clientes" Icon={Speech} />
                                <FuturisticNavLink to="/sales" label="Ventas" Icon={ShoppingBasket} />
                                <FuturisticNavLink to="/tickets" label="Administrar Ventas" Icon={Dock} />
                                <FuturisticNavLink to="/users" label="Usuarios" Icon={UserCog} />
                            </>
                        ) : (
                            <>
                                <FuturisticNavLink to="/dashboard" label="Estadísticas" Icon={BarChartBig} />
                                <FuturisticNavLink to="/products" label="Productos" Icon={PackageCheck} />
                                <FuturisticNavLink to="/suppliers" label="Proveedores" Icon={UsersRound} />
                                <FuturisticNavLink to="/receptions" label="Recepciones" Icon={Store} />
                                <FuturisticNavLink to="/stock" label="Stock" Icon={Boxes} />
                                <FuturisticNavLink to="/customers" label="Clientes" Icon={Speech} />
                                <FuturisticNavLink to="/sales" label="Ventas" Icon={ShoppingBasket} />
                                <FuturisticNavLink to="/tickets" label="Administrar Ventas" Icon={Dock} />
                            </>)}
                    </nav>

                    <div className="flex-grow"></div>
                </div>
            </aside>

            {/* Fondo oscuro cuando el sidebar está abierto en móvil */}
            {isOpen && <div className="fixed inset-0 bg-black/50 sm:hidden z-30" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;
