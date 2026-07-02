import { useProductsAdministration } from "../hooks/useProductsAdministration";
import { ButtonFuturistic, InputFuturistic, ModalFuturistic, TitleFuturistic, TableFuturistic, SelectFuturistic, TextareaFuturistic, SwitchFuturistic } from "../components";
import { LoaderPinwheel, Pencil, Plus, List, CheckCircle, XCircle, Banknote, Text, Boxes } from "lucide-react";
import toast from "react-hot-toast";

const ProductsAdministration = () => {
    const {
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
        fetchProducts, editProduct,
        handleAddCategory,
        handleEditCategory,
        handleAddProduct,
    } = useProductsAdministration();

    return (
        <div className="px-4 lg:px-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1" >Gestión de Productos</TitleFuturistic>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4 w-full space-y-6">

                    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md mt-2">
                        <h2 className="text-gray-900 dark:text-dark-primary font-semibold mb-3">Nueva Categoría</h2>
                        <InputFuturistic placeholder="Nombre de la categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                        <ButtonFuturistic label={loading ? "" : "Añadir"} icon={loading ? LoaderPinwheel : Plus} onClick={handleAddCategory} disabled={loading} className="mt-3 w-full" />
                    </div>

                    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md">
                        <h2 className="text-gray-900 dark:text-dark-primary font-semibold mb-3">Editar Categoría</h2>
                        <SelectFuturistic
                            label="Categoría"
                            options={[{ value: "", label: "Seleccionar Categoría" }, ...categories.map((c) => ({ label: c.name, value: c.id_category.toString() }))]}
                            icon={List}
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />

                        <ButtonFuturistic
                            label="Editar"
                            icon={Pencil}
                            onClick={() => {
                                const category = categories.find((c) => c.id_category.toString() === selectedCategory);
                                if (category) {
                                    setEditingCategory({ id: category.id_category, name: category.name });
                                    setIsModalOpen(true);
                                } else {
                                    toast.error("Selecciona una categoría válida");
                                }
                            }}
                            disabled={!selectedCategory}
                            className="mt-3 w-full"
                        />
                    </div>
                </div>

                <div className="lg:w-3/4 w-full">

                    <ButtonFuturistic
                        label="Añadir Producto"
                        icon={Plus} onClick={() => setIsProductModalOpen(true)}
                        disabled={categories.length === 0}
                    />

                    <ModalFuturistic isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Crear Nuevo Producto">
                        <InputFuturistic label="Nombre" placeholder="nombre: " maxLength={100} value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                        <TextareaFuturistic label="Descripción" placeholder="Descripción" icon={Text} maxLength={500} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                        <InputFuturistic label="Precio" placeholder="precio: " icon={Banknote} type="number" min="0" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                        <InputFuturistic label="Unidad" placeholder="UNIDAD, KILOGRAMO, LITRO..." icon={Boxes} type="text" maxLength={30} value={newProduct.unit_type} onChange={(e) => setNewProduct({ ...newProduct, unit_type: e.target.value })} />
                        <SelectFuturistic
                            label="Categoría"
                            options={[{ value: "", label: "Selecciona un categoría" }, ...categories.map((c) => ({ label: c.name, value: c.id_category.toString() }))]}
                            value={newProduct.id_category}
                            onChange={(e) => setNewProduct({ ...newProduct, id_category: e.target.value })} />
                        <InputFuturistic
                            label="Fecha de Vencimiento (opcional)"
                            type="date"
                            value={newProduct.fecha_vencimiento || ""}
                            onChange={(e) => setNewProduct({ ...newProduct, fecha_vencimiento: e.target.value || null })}
                        />
                        <ButtonFuturistic label={loading ? "" : "Crear Producto"} icon={loading ? LoaderPinwheel : Plus} onClick={handleAddProduct} disabled={loading} className="mt-3 w-full" />
                    </ModalFuturistic>

                    <TableFuturistic
                        columns={[
                            { key: "name", label: "Nombre" },
                            { key: "description", label: "Descripción" },
                            { key: "price", label: "Precio S/" },
                            { key: "unit_type", label: "Unidad" },
                            { key: "sku", label: "SKU" },
                            {
                                key: "fecha_vencimiento",
                                label: "Vencimiento",
                                render: (fecha) => {
                                    if (typeof fecha === "string" || typeof fecha === "number") {
                                        const date = new Date(fecha);
                                        date.setDate(date.getDate() + 1);
                                        return <span>{date.toLocaleDateString()}</span>;
                                    }
                                    return <span>d - m - a</span>;
                                }
                            },
                            {
                                key: "status", label: "Estado",
                                render: (value) => (
                                    value ? (
                                        <span className="flex items-center gap-1 text-green-400">
                                            <CheckCircle size={18} />
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-rose-400">
                                            <XCircle size={18} />
                                        </span>
                                    )
                                ),
                            },
                        ]}
                        data={products}
                        currentPage={pagination?.page || 1}
                        totalPages={pagination?.totalPages || 1}
                        onPageChange={(page) => fetchProducts(page, 10, searchTerm)}
                        onSearch={(term) => {
                            setSearchTerm(term);
                            fetchProducts(1, 10, term);
                        }}
                        actions={(product) => (
                            <ButtonFuturistic
                                icon={Pencil}
                                onClick={() => {
                                    setEditingProduct(product);
                                    setIsEditProductModalOpen(true);
                                }}
                                gradient="bg-teal-500"
                            />
                        )}
                        loading={loading}
                    />
                </div>
            </div>

            <ModalFuturistic
                isOpen={isEditProductModalOpen}
                onClose={() => {
                    setIsEditProductModalOpen(false);
                    setEditingProduct(null);
                }}
                title="Editar Producto"
            >
                {editingProduct && (
                    <>
                        <InputFuturistic label="Nombre" placeholder="Nombre del producto" maxLength={100} value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                        <TextareaFuturistic label="Descripción" placeholder="Descripción del producto" maxLength={500} value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                        <InputFuturistic label="SKU" placeholder="sku: SKU115" maxLength={50} value={editingProduct.sku === null ? "" : editingProduct.sku} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })} />
                        <InputFuturistic label="Precio" placeholder="Precio" type="number" min="0" step="0.01" value={editingProduct.price.toString()} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} />
                        <InputFuturistic label="Unidad" placeholder="UNIDAD, KILOGRAMO, LITRO..." type="text" maxLength={30} value={editingProduct.unit_type} onChange={(e) => setEditingProduct({ ...editingProduct, unit_type: e.target.value })} />
                        <SelectFuturistic
                            label="Categoría"
                            options={[{ value: "", label: "Selecciona un categoría" }, ...categories.map((c) => ({ label: c.name, value: c.id_category.toString() }))]}
                            value={editingProduct.id_category.toString() || ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct, id_category: parseInt(e.target.value) })} />
                        <SwitchFuturistic label="Estado" checked={editingProduct.status} onChange={(checked) => setEditingProduct({ ...editingProduct, status: checked })} />
                        <InputFuturistic
                            label="Fecha de Vencimiento (opcional)"
                            type="date"
                            value={editingProduct.fecha_vencimiento ? new Date(editingProduct.fecha_vencimiento).toISOString().split('T')[0] : ""}
                            onChange={(e) => setEditingProduct({ ...editingProduct, fecha_vencimiento: e.target.value })}
                        />
                        <ButtonFuturistic className="mt-3 w-full"
                            label={loading ? "" : "Guardar Cambios"}
                            icon={loading ? LoaderPinwheel : Pencil}
                            onClick={async () => {
                                if (!editingProduct) return;
                                if (editingProduct.price <= 0) {
                                    toast.error("El precio debe ser mayor a 0");
                                    return;
                                }
                                await editProduct(editingProduct.id_product, editingProduct);
                                setIsEditProductModalOpen(false);
                                setEditingProduct(null);
                            }}
                            disabled={loading}
                        />
                    </>
                )}
            </ModalFuturistic>

            <ModalFuturistic
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Editar Categoría"
            >
                <InputFuturistic
                    placeholder="Nuevo nombre"
                    value={editingCategory?.name || ""}
                    onChange={(e) =>
                        setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                    }
                />
                <div className="flex mt-4">
                    <ButtonFuturistic
                        className="w-full"
                        label={loading ? "" : "Guardar"}
                        icon={loading ? LoaderPinwheel : Plus}
                        onClick={handleEditCategory} disabled={loading} />
                </div>
            </ModalFuturistic>
        </div>
    );
};

export default ProductsAdministration;
