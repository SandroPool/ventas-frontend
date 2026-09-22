import { NavLink } from "react-router-dom";
import { Menu, X, BarChartBig, UserCog, PackageCheck, Store, HandCoins, UsersRound, ShoppingBasket, Speech, Boxes, Dock } from "lucide-react";
import { useAuthStore, Role } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";

const FuturisticNavLink = ({
    to,
    label,
    Icon,
    onNavigate,
}: {
    to: string;
    label: string;
    Icon: React.ElementType;
    onNavigate?: () => void;
}) => (
    <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) =>
            `relative flex w-full items-center rounded-md px-6 py-3 text-left font-semibold uppercase transition-all duration-300
            bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-white
            ${isActive ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg" : ""}
            hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white`
        }
    >
        <Icon size={20} className="mr-3" />
        {label}
    </NavLink>
);

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { user, token } = useAuthStore();
    let userRole = user?.role || "";

    if (!userRole && token) {
        try {
            userRole = jwtDecode<{ role: string }>(token).role;
        } catch {
            userRole = "";
        }
    }

    const closeSidebar = () => setIsOpen(false);
    const isAdminOrRoot = userRole === Role.ROOT || userRole === Role.ADMIN;

    const menuItems = isAdminOrRoot
        ? [
              { to: "/dashboard", label: "Estadísticas", Icon: BarChartBig },
              { to: "/products", label: "Productos", Icon: PackageCheck },
              { to: "/suppliers", label: "Proveedores", Icon: UsersRound },
              { to: "/receptions", label: "Recepciones", Icon: Store },
              { to: "/stock", label: "Stock", Icon: Boxes },
              { to: "/customers", label: "Clientes", Icon: Speech },
              { to: "/sales", label: "Ventas", Icon: ShoppingBasket },
              { to: "/tickets", label: "Administrar Ventas", Icon: Dock },
              { to: "/users", label: "Usuarios", Icon: UserCog },
          ]
        : [
              { to: "/dashboard", label: "Estadísticas", Icon: BarChartBig },
              { to: "/products", label: "Productos", Icon: PackageCheck },
              { to: "/suppliers", label: "Proveedores", Icon: UsersRound },
              { to: "/receptions", label: "Recepciones", Icon: Store },
              { to: "/stock", label: "Stock", Icon: Boxes },
              { to: "/customers", label: "Clientes", Icon: Speech },
              { to: "/sales", label: "Ventas", Icon: ShoppingBasket },
              { to: "/tickets", label: "Administrar Ventas", Icon: Dock },
          ];

    return (
        <>
            <div className="fixed bottom-4 left-4 z-50 sm:hidden">
                <button
                    type="button"
                    className="rounded-full bg-gray-900 p-3 text-white shadow-lg transition-colors hover:bg-gray-800 dark:bg-dark-card dark:text-dark-primary dark:hover:bg-dark-elevated"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside
                className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out dark:border-dark-border dark:bg-dark-base ${
                    isOpen ? "translate-x-0" : "-translate-x-64"
                } sm:translate-x-0`}
            >
                <div className="flex h-full flex-col space-y-4 p-4">
                    <div className="text-lg font-extrabold tracking-wider text-gray-900 dark:text-dark-primary">
                        <NavLink to="/dashboard" onClick={closeSidebar}>
                            <HandCoins size={50} />
                        </NavLink>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map(({ to, label, Icon }) => (
                            <FuturisticNavLink
                                key={to}
                                to={to}
                                label={label}
                                Icon={Icon}
                                onNavigate={closeSidebar}
                            />
                        ))}
                    </nav>

                    <div className="flex-grow"></div>
                </div>
            </aside>

            {isOpen && <div className="fixed inset-0 z-30 bg-black/50 sm:hidden" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
