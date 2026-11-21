import { useState } from "react";
import { useProductsAdministration } from "../hooks/useProductsAdministration";
import { ButtonFuturistic, DateRangePicker, InputFuturistic, ModalFuturistic, TitleFuturistic, TableFuturistic, SelectFuturistic, TextareaFuturistic, SwitchFuturistic, ImageUpload } from "../components";
import { LoaderPinwheel, Pencil, Plus, CheckCircle, XCircle, Banknote, Text, Boxes, CircleX, Tags } from "lucide-react";
import toast from "react-hot-toast";

const ProductsAdministration = () => {
    const {
        categories, loading, products, pagination,
        newCategory, setNewCategory,
        selectedCategory, setSelectedCategory,
        editingCategory, setEditingCategory,
        searchTerm, setSearchTerm,
        isProductModalOpen, setIsProductModalOpen,
        newProduct, setNewProduct, newProductImage,
        setNewProductImage,
        editingProduct, setEditingProduct,
        editingProductImage, setEditingProductImage,
        isEditProductModalOpen, setIsEditProductModalOpen,
        fetchProducts, editProduct,
        handleAddCategory,
        handleEditCategory,
        handleAddProduct,
    } = useProductsAdministration();
    const [pageSize, setPageSize] = useState(10);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
    const [categoryEditorMode, setCategoryEditorMode] = useState<"add" | "edit" | null>(null);

    const cancelCategoryEdit = () => {
        setCategoryEditorMode(null);
        setNewCategory("");
        setEditingCategory(null);
    };

    const closeCategoryManager = () => {
        setIsCategoryManagerOpen(false);
        cancelCategoryEdit();
    };

    const startAddingCategory = () => {
        setNewCategory("");
        setSelectedCategory(null);
        setEditingCategory(null);
        setCategoryEditorMode("add");
    };

    const startEditingCategory = () => {
        const category = categories.find((item) => item.id_category.toString() === selectedCategory);
        if (!category) return;
        setEditingCategory({ id: category.id_category, name: category.name });
        setNewCategory("");
        setCategoryEditorMode("edit");
    };

    const handleCategorySubmit = async () => {
        if (!categoryEditorMode) return;

        const saved = categoryEditorMode === "add"
            ? await handleAddCategory()
            : await handleEditCategory();
        if (saved) cancelCategoryEdit();
    };

    return (
        <div className="px-4 lg:px-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1" >Gestión de Productos</TitleFuturistic>
            <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                    <ButtonFuturistic
                        label="Añadir Categoría"
                        icon={Tags}
                        onClick={() => setIsCategoryManagerOpen(true)}
                        className="m-0"
                    />
                    <ButtonFuturistic
                        label="Añadir Producto"
                        icon={Plus} onClick={() => {
                            setNewProductImage(null);
                            setIsProductModalOpen(true);
                        }}
                        disabled={categories.length === 0}
                        className="m-0"
                    />
                </div>

                <div className="w-full">
                    <ModalFuturistic isOpen={isProductModalOpen} onClose={() => {
                        setIsProductModalOpen(false);
                        setNewProductImage(null);
                    }} 
                    title="Crear Nuevo Producto"
                    closeButtonVariant="circle"
                    >
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
                        <ImageUpload
                            label="Imagen del producto"
                            selectedFile={newProductImage}
                            onChange={setNewProductImage}
                            enableCamera
                        />
                        <div className="mt-4 flex justify-start gap-3">
                            <ButtonFuturistic 
                            label="Cancelar" 
                            gradient="bg-red-500"
                            icon={CircleX}
                            className="m-0" 
                            onClick={() => {
                                setIsProductModalOpen(false);
                                setNewProductImage(null);
                            }} />
                            <ButtonFuturistic label={loading ? "" : "Crear Producto"} icon={loading ? LoaderPinwheel : Plus} onClick={handleAddProduct} disabled={loading} className="m-0" />
                        </div>
                    </ModalFuturistic>

                    <TableFuturistic
                        columns={[
                            { key: "name", label: "Nombre" },
                            { key: "description", label: "Descripción" },
                            { key: "image", label: "Imagen", type: "image" },
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
                        pageSize={pageSize}
                        onPageChange={(page) => fetchProducts(page, pageSize, searchTerm, dateFrom, dateTo)}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            fetchProducts(1, size, searchTerm, dateFrom, dateTo);
                        }}
                        onSearch={(term) => {
                            setSearchTerm(term);
                            fetchProducts(1, pageSize, term, dateFrom, dateTo);
                        }}
                        toolbarContent={
                            <DateRangePicker
                                label="Filtrar productos por vencimiento"
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                onRangeSelect={(from, to) => {
                                    setDateFrom(from);
                                    setDateTo(to);
                                    fetchProducts(1, pageSize, searchTerm, from, to);
                                }}
                                onClear={() => {
                                    setDateFrom("");
                                    setDateTo("");
                                    fetchProducts(1, pageSize, searchTerm, "", "");
                                }}
                            />
                        }
                        actions={(product) => (
                            <ButtonFuturistic
                                icon={Pencil}
                                aria-label={`Editar ${product.name}`}
                                onClick={() => {
                                    setEditingProduct(product);
                                    setEditingProductImage(null);
                                    setIsEditProductModalOpen(true);
                                }}
                                gradient="bg-teal-500"
                            />
                        )}
                        loading={loading}
                        emptyStateText="No hay productos para mostrar."
                        searchEmptyStateText="No existe el producto buscado."
                    />
                </div>
            </div>

            <div className="!mt-0">
            <ModalFuturistic
                isOpen={isEditProductModalOpen}
                onClose={() => {
                    setIsEditProductModalOpen(false);
                    setEditingProduct(null);
                    setEditingProductImage(null);
                }}
                title="Editar Producto"
                closeButtonVariant="circle"
            >
                {editingProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
                        <InputFuturistic label="Nombre" placeholder="Nombre del producto" maxLength={100} value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
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
                        <TextareaFuturistic  label="Descripción" placeholder="Descripción del producto"  value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                        <ImageUpload
                            label="Imagen del producto"
                            selectedFile={editingProductImage}
                            onChange={setEditingProductImage}
                            existingImage={editingProduct.image}
                            enableCamera
                        />
                        <div className="md:col-span-2 flex justify-start gap-3">
                            <ButtonFuturistic 
                            label="Cancelar" 
                            gradient="bg-red-500"
                            icon={CircleX}
                            className="m-0" 
                            onClick={() => {
                                setIsEditProductModalOpen(false);
                                setEditingProduct(null);
                                setEditingProductImage(null);
                            }} />
                            <ButtonFuturistic className="m-0"
                                label={loading ? "" : "Guardar Cambios"}
                                icon={loading ? LoaderPinwheel : Pencil}
                                onClick={async () => {
                                    if (!editingProduct) return;
                                    if (editingProduct.price <= 0) {
                                        toast.error("El precio debe ser mayor a 0");
                                        return;
                                    }
                                    await editProduct(editingProduct.id_product, editingProduct, editingProductImage);
                                    setIsEditProductModalOpen(false);
                                    setEditingProduct(null);
                                    setEditingProductImage(null);
                                }}
                                disabled={loading}
                            />
                        </div>
                    </div>
                )}
            </ModalFuturistic>
            </div>

            <div className="!mt-0">
                <ModalFuturistic
                    isOpen={isCategoryManagerOpen}
                    onClose={closeCategoryManager}
                    title="Gestionar categorías"
                    className="max-w-xl"
                    closeButtonVariant="circle"
                >
                    <div
                        className="rounded-lg bg-white p-4 shadow-md dark:bg-dark-card"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="font-semibold text-gray-900 dark:text-dark-primary">Categorías</h2>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`overflow-hidden transition-[width,opacity] duration-300 ease-in-out ${
                                        categoryEditorMode === "add" ? "w-32 opacity-100 sm:w-48" : "w-0 opacity-0"
                                    }`}
                                >
                                    {categoryEditorMode === "add" && (
                                        <input
                                            autoFocus
                                            required
                                            disabled={loading}
                                            aria-label="Nombre de la nueva categoría"
                                            placeholder="Nueva categoría"
                                            value={newCategory}
                                            onChange={(event) => setNewCategory(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    void handleCategorySubmit();
                                                }
                                            }}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-dark-border dark:bg-dark-elevated dark:text-dark-primary"
                                        />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    aria-label={categoryEditorMode === "add"
                                        ? newCategory.trim() ? "Guardar y cerrar categoría" : "Cerrar sin guardar"
                                        : "Añadir categoría"}
                                    title={categoryEditorMode === "add"
                                        ? newCategory.trim() ? "Guardar y cerrar" : "Cerrar sin guardar"
                                        : "Añadir categoría"}
                                    disabled={loading || categoryEditorMode === "edit"}
                                    onClick={categoryEditorMode === "add"
                                        ? () => {
                                            if (newCategory.trim()) void handleCategorySubmit();
                                            else cancelCategoryEdit();
                                        }
                                        : startAddingCategory}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-white shadow-sm transition hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-dark-card"
                                >
                                    {loading ? (
                                        <LoaderPinwheel size={18} className="animate-spin" />
                                    ) : (
                                        <Plus
                                            size={19}
                                            className={`transition-transform duration-300 ${categoryEditorMode === "add" ? "rotate-45" : "rotate-0"}`}
                                        />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    aria-label={categoryEditorMode === "edit" ? "Guardar cambios de categoría" : "Editar categoría seleccionada"}
                                    title={categoryEditorMode === "edit" ? "Guardar con Enter o este botón" : "Editar categoría seleccionada"}
                                    disabled={loading || categoryEditorMode === "add" || (categoryEditorMode === null && !selectedCategory) || (categoryEditorMode === "edit" && !editingCategory?.name.trim())}
                                    onClick={categoryEditorMode === "edit" ? () => { void handleCategorySubmit(); } : startEditingCategory}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-sm transition hover:bg-teal-100 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-dark-elevated dark:text-dark-primary dark:hover:bg-dark-base dark:focus-visible:ring-offset-dark-card"
                                >
                                    <Pencil size={17} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.length === 0 ? (
                                <div className="flex w-full flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center dark:border-dark-border dark:bg-dark-base/40">
                                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300">
                                        <Tags size={22} />
                                    </span>
                                    <p className="font-medium text-gray-800 dark:text-dark-primary">Aún no hay categorías</p>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">Crea una categoría para organizar tus productos.</p>
                                </div>
                            ) : (
                                categories.map((category) => {
                                    const isSelected = selectedCategory === category.id_category.toString();

                                    if (categoryEditorMode === "edit" && editingCategory?.id === category.id_category) {
                                        return (
                                            <div
                                                key={category.id_category}
                                                className="flex items-center gap-1 rounded-full border border-teal-500 bg-white px-2 py-1 dark:bg-dark-card"
                                            >
                                                <input
                                                    autoFocus
                                                    required
                                                    disabled={loading}
                                                    aria-label={`Editar nombre de ${category.name}`}
                                                    value={editingCategory.name}
                                                    onChange={(event) => setEditingCategory({ ...editingCategory, name: event.target.value })}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            event.preventDefault();
                                                            void handleCategorySubmit();
                                                        }
                                                    }}
                                                    className="w-40 min-w-0 bg-transparent px-1 text-sm text-gray-900 outline-none dark:text-dark-primary"
                                                />
                                                <button
                                                    type="button"
                                                    aria-label="Cancelar edición de categoría"
                                                    disabled={loading}
                                                    onClick={cancelCategoryEdit}
                                                    className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-secondary dark:hover:bg-dark-elevated"
                                                >
                                                    <CircleX size={16} />
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            key={category.id_category}
                                            type="button"
                                            aria-pressed={isSelected}
                                            disabled={categoryEditorMode !== null}
                                            onClick={() => {
                                                setSelectedCategory(isSelected ? null : category.id_category.toString());
                                                setEditingCategory(null);
                                            }}
                                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card ${
                                                isSelected
                                                    ? "border-teal-500 bg-teal-500 text-white shadow-sm"
                                                    : "border-gray-300 bg-gray-100 text-gray-700 hover:border-teal-400 hover:bg-teal-50 dark:border-dark-border dark:bg-dark-elevated dark:text-dark-primary dark:hover:border-teal-500 dark:hover:bg-dark-card"
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </ModalFuturistic>
            </div>

        </div>
    );
};

export default ProductsAdministration;
