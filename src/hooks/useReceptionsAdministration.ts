import { useEffect, useState } from "react";
import { ProductReceptions, useReceptionStore } from "../store/useReceptionStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const getLocalDateString = (date: Date) => date.toLocaleDateString('fr-CA');

export const useReceptionsAdministration = () => {
    const { token } = useAuthStore();
    const decodedToken = token ? jwtDecode<{ id: number; role: string }>(token) : { id: 0, role: '' };
    const {
        productReceptions,
        paginationReception,
        loading,
        fetchProductReceptions,
        addProductReception,
        editProductReception,
    } = useReceptionStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen] = useState(false);
    const [newProductReception, setNewProductReception] = useState<Omit<ProductReceptions, "id_reception" | "createdAt" | "updatedAt" | "product_name" | "price" | "supplier_name" | "user_name">>({
        id_product: 0,
        quantity: 0,
        purchase_price: 0,
        id_supplier: 0,
        id_user: 0,
        date: getLocalDateString(new Date())
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedReception, setEditedReception] = useState<Partial<ProductReceptions> | null>(null);

    useEffect(() => {
        fetchProductReceptions(currentPage, 10, searchTerm);
    }, [fetchProductReceptions, currentPage, searchTerm]);

    const handleAddProductReception = async () => {
        newProductReception.id_user = decodedToken.id;
        if (!newProductReception.id_product || !newProductReception.quantity || !newProductReception.purchase_price || !newProductReception.id_supplier) {
            toast.error("Faltan datos, por favor complétalos.");
            return;
        }
        const receptionToSend = {
            ...newProductReception,
            date: new Date(newProductReception.date).toISOString(),
        };
        await addProductReception(receptionToSend);
        setIsAddProductReceptionModalOpen(false);
        setNewProductReception({ id_product: 0, quantity: 0, purchase_price: 0, id_supplier: 0, id_user: 0, date: new Date().toISOString().split("T")[0] });
    };

    const handleEditReception = async () => {
        if (!editedReception || !editedReception.id_reception) return;
        await editProductReception(editedReception.id_reception, editedReception);
        fetchProductReceptions(currentPage, 10, searchTerm);
        setIsEditModalOpen(false);
        setEditedReception(null);
    };

    return {
        productReceptions, paginationReception, loading,
        searchTerm, setSearchTerm,
        currentPage, setCurrentPage,
        isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen,
        newProductReception, setNewProductReception,
        isEditModalOpen, setIsEditModalOpen,
        editedReception, setEditedReception,
        fetchProductReceptions,
        handleAddProductReception,
        handleEditReception,
    };
};
