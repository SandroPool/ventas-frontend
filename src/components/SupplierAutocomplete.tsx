import { useEffect, useState, useRef } from "react";
import { UserRoundSearch, XCircle } from "lucide-react";
import { InputFuturistic } from "../components";
import { useSupplierStore, Supplier } from "../store/useSupplierStore";

const SupplierAutocomplete = ({ onSelect }: { onSelect: (supplier: Supplier) => void }) => {
    const { fetchSuppliers, suppliers, loading } = useSupplierStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    useEffect(() => {
        if (searchTerm.length > 1 && !selectedSupplier) {
            const delayDebounce = setTimeout(() => {
                fetchSuppliers(1, 10, searchTerm);
                setShowDropdown(true);
            }, 300);
            return () => clearTimeout(delayDebounce);
        } else {
            setShowDropdown(false);
        }
    }, [searchTerm, fetchSuppliers, selectedSupplier]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (supplier: Supplier) => {
        setSearchTerm(supplier.name);
        setSelectedSupplier(supplier);
        setShowDropdown(false);
        onSelect(supplier);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedSupplier(null);
        setShowDropdown(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev < suppliers.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && showDropdown && suppliers.length > 0) {
            handleSelect(suppliers[selectedIndex]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <InputFuturistic
                label="Proveedor"
                icon={UserRoundSearch}
                placeholder="Buscar proveedor..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedSupplier(null); // Restablecer cuando el usuario edita el input
                    setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
            />
            {searchTerm && (
                <XCircle
                    className="absolute top-12 right-1 text-orange-500 dark:text-dark-muted cursor-pointer hover:text-red-500"
                    size={18}
                    onClick={handleClear}
                />
            )}
            {showDropdown && (
                <ul className="absolute w-full bg-gray-200 dark:bg-dark-base border border-gray-400 dark:border-dark-border 
                    rounded-md mt-1 max-h-48 overflow-y-auto shadow-xl z-50 
                    backdrop-blur-lg bg-opacity-90 dark:bg-opacity-80">
                    {loading ? (
                        <li className="p-3 text-gray-500 dark:text-dark-muted animate-pulse">Cargando...</li>
                    ) : suppliers.length > 0 ? (
                        suppliers.map((supplier, index) => (
                            <li
                                key={supplier.id_supplier}
                                className={`p-3 cursor-pointer transition-all duration-300 
                                    ${selectedIndex === index
                                        ? "bg-teal-500 text-white dark:bg-dark-elevated dark:text-white"
                                        : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-dark-elevated dark:hover:text-white"
                                    }`}
                                onClick={() => handleSelect(supplier)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {supplier.name} - {supplier.ruc}
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 dark:text-dark-muted">No se encontraron proveedores</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SupplierAutocomplete;
