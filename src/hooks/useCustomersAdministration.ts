import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Customer, useCustomerStore } from "../store/useCustomerStore";
import { validateDNI } from "../utils/validateDNI";

export const useCustomersAdministration = () => {
    const {
        customers, paginationCustomer, loading, fetchCustomers, addCustomer, editCustomer
    } = useCustomerStore();
    const hasLoadedCustomers = useRef(false);

    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newCustomer, setNewCustomer] = useState({ name: "", first_surname: "", second_surname: "", dni: "" });
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        if (!hasLoadedCustomers.current && !paginationCustomer) {
            hasLoadedCustomers.current = true;
            fetchCustomers();
        }
    }, [fetchCustomers, paginationCustomer]);

    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.first_surname || !newCustomer.dni) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        if (!validateDNI(newCustomer.dni)) return;

        await addCustomer(newCustomer);
        setIsAddCustomerModalOpen(false);
        setNewCustomer({ name: "", first_surname: "", second_surname: "", dni: "" });
    };

    const handleEditCustomer = async () => {
        if (!editingCustomer) return;
        if (!validateDNI(editingCustomer.dni)) return;

        await editCustomer(editingCustomer.id_customer, editingCustomer);
        setIsEditCustomerModalOpen(false);
        setEditingCustomer(null);
    };

    return {
        customers, paginationCustomer, loading,
        searchTerm, setSearchTerm,
        isAddCustomerModalOpen, setIsAddCustomerModalOpen,
        isEditCustomerModalOpen, setIsEditCustomerModalOpen,
        newCustomer, setNewCustomer,
        editingCustomer, setEditingCustomer,
        fetchCustomers,
        handleAddCustomer,
        handleEditCustomer,
    };
};
