import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Supplier, useSupplierStore } from "../store/useSupplierStore";

export const useSuppliersAdministration = () => {
    const {
        suppliers, paginationSupplier, loading, fetchSuppliers, addSupplier, editSupplier
    } = useSupplierStore();

    const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
    const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newSupplier, setNewSupplier] = useState({
        name: "", ruc: "", address: "", phone: "", contact: ""
    });
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    useEffect(() => {
        if (suppliers.length === 0) fetchSuppliers();
    }, [fetchSuppliers, suppliers.length]);

    const handleAddSupplier = async () => {
        if (!newSupplier.name || !newSupplier.ruc || !newSupplier.address || !newSupplier.phone || !newSupplier.contact) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        await addSupplier(newSupplier);
        setIsAddSupplierModalOpen(false);
        setNewSupplier({ name: "", ruc: "", address: "", phone: "", contact: "" });
    };

    const handleEditSupplier = async () => {
        if (!editingSupplier) return;
        await editSupplier(editingSupplier.id_supplier, editingSupplier);
        setIsEditSupplierModalOpen(false);
        setEditingSupplier(null);
    };

    return {
        suppliers, paginationSupplier, loading,
        searchTerm, setSearchTerm,
        isAddSupplierModalOpen, setIsAddSupplierModalOpen,
        isEditSupplierModalOpen, setIsEditSupplierModalOpen,
        newSupplier, setNewSupplier,
        editingSupplier, setEditingSupplier,
        fetchSuppliers,
        handleAddSupplier,
        handleEditSupplier,
    };
};
