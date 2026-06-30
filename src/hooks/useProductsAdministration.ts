import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Product, useProductStore } from "../store/useProductStore";

export const useProductsAdministration = () => {
    const {
        categories, loading, fetchCategories, addCategory, editCategory,
        products, pagination, fetchProducts, addProduct, editProduct
    } = useProductStore();

    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<{
        name: string;
        description: string;
        price: string;
        unit_type: string;
        id_category: string;
        fecha_vencimiento: string | null;
    }>({
        name: "",
        description: "",
        price: "",
        unit_type: "",
        id_category: "",
        fecha_vencimiento: null,
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

    useEffect(() => {
        if (categories.length === 0) fetchCategories();
        if (products.length === 0) fetchProducts();
    }, [fetchCategories, fetchProducts, categories.length, products.length]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("El nombre de la categoría es obligatorio");
            return;
        }
        await addCategory(newCategory.trim());
        setNewCategory("");
    };

    const handleEditCategory = async () => {
        if (!editingCategory?.name.trim()) {
            toast.error("El nombre de la categoría es obligatorio");
            return;
        }
        await editCategory(editingCategory.id, editingCategory.name.trim());
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.unit_type || !newProduct.id_category) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        const price = parseFloat(newProduct.price);
        const unitTypeNum = parseFloat(newProduct.unit_type);
        if (isNaN(unitTypeNum) || unitTypeNum <= 0) {
            toast.error("La cantidad debe ser un número mayor a 0");
            return;
        }

        await addProduct({ ...newProduct, price, id_category: parseInt(newProduct.id_category) });
        setIsProductModalOpen(false);
        setNewProduct({ name: "", description: "", price: "", unit_type: "", id_category: "", fecha_vencimiento: null });
    };

    return {
        categories, loading, products, pagination,
        newCategory, setNewCategory,
        selectedCategory, setSelectedCategory,
        editingCategory, setEditingCategory,
        isModalOpen, setIsModalOpen,
        searchTerm, setSearchTerm,
        isProductModalOpen, setIsProductModalOpen,
        newProduct, setNewProduct,
        editingProduct, setEditingProduct,
        isEditProductModalOpen, setIsEditProductModalOpen,
        fetchProducts, editProduct, fetchCategories,
        handleAddCategory,
        handleEditCategory,
        handleAddProduct,
    };
};
