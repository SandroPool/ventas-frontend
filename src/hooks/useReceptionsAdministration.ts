import { useEffect, useRef, useState } from "react";
import { ProductReceptions, useReceptionStore } from "../store/useReceptionStore";
import type { Product } from "../store/useProductStore";
import type { Supplier } from "../store/useSupplierStore";
import toast from "react-hot-toast";

const getLocalDateString = (date: Date) => date.toLocaleDateString('fr-CA');

export interface ReceptionCartItem {
    lineId: number;
    id_product: number;
    product_name: string;
    id_supplier: number;
    supplier_name: string;
    quantity: number;
    purchase_price: number;
}

interface ReceptionDraft {
    quantity: number;
    purchase_price: number;
    date: string;
}

export const useReceptionsAdministration = () => {
    const {
        productReceptions,
        paginationReception,
        loading,
        fetchProductReceptions,
        addProductReceptionBatch,
        editProductReception,
    } = useReceptionStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen] = useState(false);
    const [newProductReception, setNewProductReception] = useState<ReceptionDraft>({
        quantity: 0,
        purchase_price: 0,
        date: getLocalDateString(new Date())
    });
    const [receptionItems, setReceptionItems] = useState<ReceptionCartItem[]>([]);
    const nextReceptionItemId = useRef(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedReception, setEditedReception] = useState<Partial<ProductReceptions> | null>(null);

    useEffect(() => {
        fetchProductReceptions(currentPage, pageSize, searchTerm, dateFrom, dateTo);
    }, [fetchProductReceptions, currentPage, pageSize, searchTerm, dateFrom, dateTo]);

    const handleAddReceptionItem = (product: Product | null, supplier: Supplier | null) => {
        if (!product) {
            toast.error("Selecciona un producto.");
            return false;
        }
        if (!supplier) {
            toast.error("Selecciona el proveedor de este producto.");
            return false;
        }
        if (!Number.isFinite(newProductReception.quantity) || newProductReception.quantity <= 0) {
            toast.error("La cantidad debe ser mayor a cero.");
            return false;
        }
        if (!Number.isFinite(newProductReception.purchase_price) || newProductReception.purchase_price <= 0) {
            toast.error("El precio de compra debe ser mayor a cero.");
            return false;
        }
        setReceptionItems((items) => [...items, {
            lineId: nextReceptionItemId.current++,
            id_product: product.id_product,
            product_name: product.name,
            id_supplier: supplier.id_supplier,
            supplier_name: supplier.name,
            quantity: newProductReception.quantity,
            purchase_price: newProductReception.purchase_price,
        }]);
        setNewProductReception((current) => ({ ...current, id_product: 0, quantity: 0, purchase_price: 0 }));
        return true;
    };

    const handleRemoveReceptionItem = (lineId: number) => {
        setReceptionItems((items) => items.filter((item) => item.lineId !== lineId));
    };

    const handleUpdateReceptionItem = (lineId: number, field: "quantity" | "purchase_price", value: number) => {
        setReceptionItems((items) => items.map((item) =>
            item.lineId === lineId ? { ...item, [field]: value } : item
        ));
    };

    const handleAddProductReception = async () => {
        if (receptionItems.length === 0) {
            toast.error("Agrega al menos un producto a la recepción.");
            return false;
        }
        if (receptionItems.some((item) =>
            !item.id_supplier ||
            !Number.isFinite(item.quantity) || item.quantity <= 0 ||
            !Number.isFinite(item.purchase_price) || item.purchase_price <= 0
        )) {
            toast.error("Cada producto debe tener proveedor, cantidad y precio de compra válidos.");
            return false;
        }

        const saved = await addProductReceptionBatch({
            date: newProductReception.date,
            items: receptionItems.map(({ id_product, id_supplier, quantity, purchase_price }) => ({
                id_product,
                id_supplier,
                quantity,
                purchase_price,
            })),
        });
        if (!saved) return false;

        setIsAddProductReceptionModalOpen(false);
        setReceptionItems([]);
        setNewProductReception({
            quantity: 0,
            purchase_price: 0,
            date: getLocalDateString(new Date()),
        });
        return true;
    };

    const handleEditReception = async () => {
        if (!editedReception || !editedReception.id_reception) return;
        await editProductReception(editedReception.id_reception, editedReception);
        fetchProductReceptions(currentPage, pageSize, searchTerm, dateFrom, dateTo);
        setIsEditModalOpen(false);
        setEditedReception(null);
    };

    return {
        productReceptions, paginationReception, loading,
        searchTerm, setSearchTerm,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen,
        newProductReception, setNewProductReception,
        receptionItems, handleAddReceptionItem, handleRemoveReceptionItem, handleUpdateReceptionItem,
        isEditModalOpen, setIsEditModalOpen,
        editedReception, setEditedReception,
        fetchProductReceptions,
        handleAddProductReception,
        handleEditReception,
    };
};
