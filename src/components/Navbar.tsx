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
        logout();
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border shadow-sm">
            <div className="flex items-center justify-between h-full px-4 lg:px-8">
                <NavLink to="/dashboard" className="flex items-center gap-2">
                    <HandCoins size={28} className="text-teal-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-dark-primary">Ventas App</span>
                </NavLink>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900 dark:text-dark-primary leading-tight">{user?.name || "Usuario"}</p>
                                <p className="text-xs text-gray-500 dark:text-dark-muted leading-tight">{user?.role || ""}</p>
                            </div>
                            <ChevronDown size={16} className="text-gray-500 dark:text-dark-muted" />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-xl py-1 z-50">
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
                                    <p className="text-sm font-medium text-gray-900 dark:text-dark-primary">{user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-dark-muted">{user?.email}</p>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors"
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
