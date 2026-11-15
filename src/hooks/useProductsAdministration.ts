import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Product, useProductStore } from "../store/useProductStore";

export const useProductsAdministration = () => {
    const {
        categories, loading, fetchCategories, addCategory, editCategory,
        products, pagination, fetchProducts, addProduct, editProduct
    } = useProductStore();
    const hasLoadedCategories = useRef(false);
    const hasLoadedProducts = useRef(false);

    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
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
    const [newProductImage, setNewProductImage] = useState<File | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingProductImage, setEditingProductImage] = useState<File | null>(null);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

    useEffect(() => {
        if (!hasLoadedCategories.current) {
            hasLoadedCategories.current = true;
            fetchCategories();
        }

        if (!hasLoadedProducts.current && !pagination) {
            hasLoadedProducts.current = true;
            fetchProducts();
        }
    }, [fetchCategories, fetchProducts, pagination]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("El nombre de la categoría es obligatorio");
            return false;
        }
        const added = await addCategory(newCategory.trim());
        if (added) setNewCategory("");
        return added;
    };

    const handleEditCategory = async () => {
        if (!editingCategory?.name.trim()) {
            toast.error("El nombre de la categoría es obligatorio");
            return false;
        }
        const edited = await editCategory(editingCategory.id, editingCategory.name.trim());
        if (edited) {
            setEditingCategory((current) => current ? { ...current, name: current.name.trim() } : null);
        }
        return edited;
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.unit_type || !newProduct.id_category) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        const price = parseFloat(newProduct.price);
        await addProduct(
            { ...newProduct, price, id_category: parseInt(newProduct.id_category) },
            newProductImage
        );
        setIsProductModalOpen(false);
        setNewProduct({ name: "", description: "", price: "", unit_type: "", id_category: "", fecha_vencimiento: null });
        setNewProductImage(null);
    };

    return {
        categories, loading, products, pagination,
        newCategory, setNewCategory,
        selectedCategory, setSelectedCategory,
        editingCategory, setEditingCategory,
        searchTerm, setSearchTerm,
        isProductModalOpen, setIsProductModalOpen,
        newProduct, setNewProduct,
        newProductImage, setNewProductImage,
        editingProduct, setEditingProduct,
        editingProductImage, setEditingProductImage,
        isEditProductModalOpen, setIsEditProductModalOpen,
        fetchProducts, editProduct, fetchCategories,
        handleAddCategory,
        handleEditCategory,
        handleAddProduct,
    };
};
