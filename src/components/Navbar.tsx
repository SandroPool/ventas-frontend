import { useState, useRef, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "./ThemeToggle";
import { LogOut, ChevronDown, HandCoins, User } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate("/", { replace: true });
    };

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-card">
            <div className="flex h-full items-center justify-between px-4 lg:px-8">
                <NavLink to="/dashboard" className="flex items-center gap-2">
                    <HandCoins size={28} className="text-teal-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-dark-primary">Ventas App</span>
                </NavLink>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-haspopup="menu"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-dark-elevated"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-medium leading-tight text-gray-900 dark:text-dark-primary">{user?.name || "Usuario"}</p>
                                <p className="text-xs leading-tight text-gray-500 dark:text-dark-muted">{user?.role || ""}</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-500 dark:text-dark-muted" />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-xl dark:border-dark-border dark:bg-dark-card">
                                <div className="border-b border-gray-200 px-4 py-3 dark:border-dark-border">
                                    <p className="text-sm font-medium text-gray-900 dark:text-dark-primary">{user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">{user?.email}</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-dark-elevated"
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
