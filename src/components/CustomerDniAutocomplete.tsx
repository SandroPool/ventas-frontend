import { useEffect, useRef, useState } from "react";
import { Search, XCircle } from "lucide-react";
import { InputFuturistic } from "../components";
import { getCustomers } from "../services/customer.service";
import { Customer } from "../store/useCustomerStore";

interface CustomerDniAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (customer: Customer) => void;
}

const CustomerDniAutocomplete = ({ value, onChange, onSelect }: CustomerDniAutocompleteProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchFailed, setSearchFailed] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedDniRef = useRef<string | null>(null);

    useEffect(() => {
        if (selectedDniRef.current === value) {
            selectedDniRef.current = null;
            setLoading(false);
            setShowDropdown(false);
            return;
        }
        selectedDniRef.current = null;

        if (value.length < 2) {
            setCustomers([]);
            setLoading(false);
            setSearchFailed(false);
            setShowDropdown(false);
            return;
        }

        setCustomers([]);
        setLoading(true);
        setSearchFailed(false);
        setShowDropdown(true);
        let cancelled = false;
        const timeout = setTimeout(async () => {
            const response = await getCustomers(1, 10, value);
            if (!cancelled) {
                setCustomers(response?.data ?? []);
                setSearchFailed(!response);
                setLoading(false);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectCustomer = (customer: Customer) => {
        selectedDniRef.current = customer.dni;
        onChange(customer.dni);
        onSelect(customer);
        setShowDropdown(false);
        setSelectedIndex(0);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setShowDropdown(false);
        } else if (event.key === "ArrowDown" && showDropdown) {
            event.preventDefault();
            setSelectedIndex((index) => Math.min(index + 1, customers.length - 1));
        } else if (event.key === "ArrowUp" && showDropdown) {
            event.preventDefault();
            setSelectedIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter" && showDropdown && customers.length > 0) {
            event.preventDefault();
            selectCustomer(customers[selectedIndex]);
        }
    };

    const clearSearch = () => {
        onChange("");
        setCustomers([]);
        setShowDropdown(false);
        setSelectedIndex(0);
    };

    return (
        <div className="relative flex-1" ref={dropdownRef}>
            <InputFuturistic
                label="DNI"
                icon={Search}
                placeholder="01234567"
                value={value}
                maxLength={8}
                inputMode="numeric"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                aria-controls="customer-dni-suggestions"
                onChange={(event) => {
                    onChange(event.target.value.replace(/\D/g, "").slice(0, 8));
                    setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
            />
            {value && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-[42px] rounded-full text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Limpiar DNI"
                >
                    <XCircle size={18} />
                </button>
            )}
            {showDropdown && (
                <ul
                    id="customer-dni-suggestions"
                    role="listbox"
                    className={`${customers.length > 0 && !loading && !searchFailed ? "absolute z-50" : "relative"} mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-xl dark:border-dark-border dark:bg-dark-base`}
                >
                    {loading ? (
                        <li className="p-3 text-gray-500 dark:text-dark-muted" role="status">Buscando clientes...</li>
                    ) : searchFailed ? (
                        <li className="p-3 text-red-600 dark:text-red-300" role="alert">No se pudo buscar clientes. Inténtalo de nuevo.</li>
                    ) : customers.length > 0 ? (
                        customers.map((customer, index) => (
                            <li
                                key={customer.id_customer}
                                role="option"
                                aria-selected={selectedIndex === index}
                                className={`cursor-pointer p-3 transition-colors ${
                                    selectedIndex === index
                                        ? "bg-teal-500 text-white dark:bg-dark-elevated dark:text-dark-primary"
                                        : "text-gray-900 hover:bg-gray-100 dark:text-dark-secondary dark:hover:bg-dark-elevated"
                                }`}
                                onClick={() => selectCustomer(customer)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <span className="font-medium">
                                    {customer.name} {customer.first_surname} {customer.second_surname}
                                </span>
                                <span className={`ml-2 text-sm ${selectedIndex === index ? "text-white/90" : "text-gray-500 dark:text-dark-muted"}`}>
                                    {customer.dni}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 dark:text-dark-muted">No se encontraron clientes para ese DNI.</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CustomerDniAutocomplete;
