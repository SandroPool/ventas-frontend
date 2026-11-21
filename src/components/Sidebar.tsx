import { NavLink } from "react-router-dom";
import { BarChartBig, UserCog, PackageCheck, Store, UsersRound, ShoppingBasket, Speech, Boxes, Dock, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore, Role } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";

const FuturisticNavLink = ({
    to,
    label,
    Icon,
    onNavigate,
    collapsed,
}: {
    to: string;
    label: string;
    Icon: React.ElementType;
    onNavigate?: () => void;
    collapsed: boolean;
}) => (
    <NavLink
        to={to}
        onClick={onNavigate}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
            `relative flex w-full items-center rounded-md border-l-4 py-3 pl-5 pr-6 text-left font-semibold transition-colors duration-200
            ${collapsed ? "sm:justify-center sm:px-0" : ""}
            ${isActive
                ? "border-teal-200 bg-[#5D8FB3] text-white shadow-sm dark:border-teal-400 dark:bg-dark-elevated dark:text-dark-primary"
                : "border-transparent bg-[#4A779B] text-white dark:bg-gray-800 dark:text-white"}
            hover:bg-[#3F6887] hover:text-white dark:hover:bg-gray-700 dark:hover:text-white`
        }
    >
        <Icon size={20} className={`mr-3 ${collapsed ? "sm:mr-0" : ""}`} />
        <span className={collapsed ? "sm:sr-only" : ""}>{label}</span>
    </NavLink>
);

const Sidebar = ({
    isOpen,
    setIsOpen,
    collapsed,
    onToggleCollapse,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}) => {
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

    const menuSections = [
        {
            label: "General",
            items: [{ to: "/dashboard", label: "Estadísticas", Icon: BarChartBig }],
        },
        {
            label: "Inventario",
            items: [
                { to: "/products", label: "Productos", Icon: PackageCheck },
                { to: "/suppliers", label: "Proveedores", Icon: UsersRound },
                { to: "/receptions", label: "Recepciones", Icon: Store },
                { to: "/stock", label: "Stock", Icon: Boxes },
            ],
        },
        {
            label: "Ventas",
            items: [
                { to: "/customers", label: "Clientes", Icon: Speech },
                { to: "/sales", label: "Registrar venta", Icon: ShoppingBasket },
                { to: "/tickets", label: "Notas de venta", Icon: Dock },
            ],
        },
        ...(isAdminOrRoot
            ? [{
                  label: "Administración",
                  items: [{ to: "/users", label: "Usuarios", Icon: UserCog }],
              }]
            : []),
    ];

    return (
        <>
            <aside
                id="app-sidebar"
                className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-[#5D8FB3] bg-[#73A5CA] shadow-lg transition-all duration-300 ease-in-out dark:border-dark-border dark:bg-dark-base ${
                    collapsed ? "sm:w-20" : "sm:w-64"
                } ${
                    isOpen ? "translate-x-0" : "-translate-x-64"
                } sm:translate-x-0`}
            >
                <div className="flex h-full flex-col space-y-4 p-4">
                    <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                        {menuSections.map(({ label, items }) => (
                            <section key={label} aria-label={label} className="space-y-2">
                                <h2 className={`px-3 text-xs font-bold uppercase tracking-wider text-white/80 dark:text-dark-muted ${collapsed ? "sm:sr-only" : ""}`}>
                                    {label}
                                </h2>
                                {items.map(({ to, label: itemLabel, Icon }) => (
                                    <FuturisticNavLink
                                        key={to}
                                        to={to}
                                        label={itemLabel}
                                        Icon={Icon}
                                        onNavigate={closeSidebar}
                                        collapsed={collapsed}
                                    />
                                ))}
                            </section>
                        ))}
                    </nav>
                </div>
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    title={collapsed ? "Expandir menú" : "Contraer menú"}
                    aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
                    aria-expanded={!collapsed}
                    className="absolute right-0 top-2 z-50 hidden h-8 w-8 translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-[#1F4D67] text-white shadow-lg transition-colors hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:flex dark:border-dark-card dark:bg-teal-600 dark:hover:bg-teal-500"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </aside>

            {isOpen && <div className="fixed inset-0 z-30 bg-black/50 sm:hidden" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
