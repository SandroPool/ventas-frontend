import { useEffect, useState, useRef } from "react";
import { UserRoundSearch, XCircle } from "lucide-react";
import { InputFuturistic } from "../components";
import { useCustomerStore, Customer } from "../store/useCustomerStore";

const CustomerAutocomplete = ({ onSelect }: { onSelect: (customer: Customer) => void }) => {
    const { fetchCustomers, customers, loading } = useCustomerStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        if (searchTerm.length > 1 && !selectedCustomer) {
            const delayDebounce = setTimeout(() => {
                fetchCustomers(1, 10, searchTerm);
                setShowDropdown(true);
            }, 300);
            return () => clearTimeout(delayDebounce);
        } else {
            setShowDropdown(false);
        }
    }, [searchTerm, fetchCustomers, selectedCustomer]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (customer: Customer) => {
        setSearchTerm(customer.name);
        setSelectedCustomer(customer);
        setShowDropdown(false);
        onSelect(customer);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedCustomer(null);
        setShowDropdown(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => (prev < customers.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && showDropdown && customers.length > 0) {
            handleSelect(customers[selectedIndex]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <InputFuturistic
                label="Cliente"
                icon={UserRoundSearch}
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedCustomer(null);
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
                    ) : customers.length > 0 ? (
                        customers.map((customer, index) => (
                            <li
                                key={customer.id_customer}
                                className={`p-3 cursor-pointer transition-all duration-300 
                                    ${selectedIndex === index
                                        ? "bg-teal-500 text-white dark:bg-dark-elevated dark:text-white"
                                        : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-dark-elevated dark:hover:text-white"
                                    }`}
                                onClick={() => handleSelect(customer)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {customer.name} {customer.first_surname} {customer.second_surname}
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 dark:text-dark-muted">No se encontraron clientes</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomerAutocomplete;
