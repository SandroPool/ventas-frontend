import { JSX, FC, useState } from "react";
import { Banknote, CircleX, LoaderPinwheel, Pencil, Plus, ShoppingCart, Trash2, Wallet } from "lucide-react";
import { useReceptionsAdministration } from "../hooks/useReceptionsAdministration";
import { ButtonFuturistic, DatePickerFuturistic, DateRangePicker, InputFuturistic, ModalFuturistic, TitleFuturistic, ProductAutocomplete, SupplierAutocomplete } from "../components";
import TableFuturistic, { Column } from "../components/TableFuturistic";
import { formatDate } from "../utils/functionDate";
import { ProductReceptions } from "../store/useReceptionStore";
import type { Product } from "../store/useProductStore";
import type { Supplier } from "../store/useSupplierStore";

const ReceptionsAdministration: FC = (): JSX.Element => {
    const {
        productReceptions, paginationReception, loading,
        setSearchTerm,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        currentPage, setCurrentPage,
        pageSize, setPageSize,
        isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen,
        newProductReception, setNewProductReception,
        receptionItems, handleAddReceptionItem, handleRemoveReceptionItem, handleUpdateReceptionItem,
        isEditModalOpen, setIsEditModalOpen,
        editedReception, setEditedReception,
        handleAddProductReception,
        handleEditReception,
    } = useReceptionsAdministration();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [productSearchKey, setProductSearchKey] = useState(0);
    const [supplierSearchKey, setSupplierSearchKey] = useState(0);
    const cartTotal = receptionItems.reduce((total, item) => total + item.quantity * item.purchase_price, 0);

    const addProductToReception = () => {
        if (handleAddReceptionItem(selectedProduct, selectedSupplier)) {
            setSelectedProduct(null);
            setSelectedSupplier(null);
            setProductSearchKey((key) => key + 1);
            setSupplierSearchKey((key) => key + 1);
        }
    };

    const saveReception = async () => {
        if (await handleAddProductReception()) {
            setProductSearchKey((key) => key + 1);
            setSupplierSearchKey((key) => key + 1);
            setSelectedProduct(null);
            setSelectedSupplier(null);
        }
    };

    const columns: Column<ProductReceptions>[] = [
        { key: "product_name", label: "Producto" },
        { key: "supplier_name", label: "Proveedor" },
        { key: "quantity", label: "Cantidad" },
        { key: "purchase_price", label: "Precio Compra S/" },
        {
            key: "date", label: "Fecha de Recepción",
            render: (value) => <span> {formatDate(value as string)} </span>
        },
    ];

    return (
        <div className="px-4 lg:px-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Inventario</TitleFuturistic>
            <ButtonFuturistic
                label="Nueva Recepción"
                icon={Plus}
                onClick={() => setIsAddProductReceptionModalOpen(true)}
            />

            <div className="lg:w-3/4 w-full">
            <ModalFuturistic isOpen={isAddProductReceptionModalOpen} onClose={() => setIsAddProductReceptionModalOpen(false)} title="Nuevo Inventario">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <DatePickerFuturistic
                            label="Fecha de Recepción"
                            value={newProductReception.date}
                            onChange={(date) => setNewProductReception((prev) => ({ ...prev, date }))}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-dark-muted">Esta fecha se aplicará a todas las líneas.</p>
                    </div>

                    <ProductAutocomplete
                        resetKey={productSearchKey}
                        onSelect={(product) => setSelectedProduct(product)}
                        onClear={() => setSelectedProduct(null)}
                    />
                    <SupplierAutocomplete
                        resetKey={supplierSearchKey}
                        onSelect={setSelectedSupplier}
                        onClear={() => setSelectedSupplier(null)}
                    />
                    <InputFuturistic label="Cantidad" icon={Wallet} type="number" min="0.01" step="any" placeholder="0" value={newProductReception.quantity || ""} onChange={(e) =>
                        setNewProductReception((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                    } />
                    <InputFuturistic label="Precio de Compra" icon={Banknote} type="number" min="0.01" step="any" placeholder="S/" value={newProductReception.purchase_price || ""} onChange={(e) =>
                        setNewProductReception((prev) => ({ ...prev, purchase_price: Number(e.target.value) }))
                    } />
                    <div className="md:col-span-2">
                        <ButtonFuturistic
                            label="Agregar producto"
                            icon={Plus}
                            className="m-0 w-full sm:w-auto"
                            onClick={addProductToReception}
                        />
                    </div>

                    <section className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-dark-border md:col-span-2" aria-label="Productos de la recepción">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-dark-primary">
                                <ShoppingCart size={19} className="text-teal-500" />
                                Productos en la recepción
                            </h3>
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 dark:bg-dark-elevated dark:text-teal-300">
                                {receptionItems.length}
                            </span>
                        </div>

                        {receptionItems.length === 0 ? (
                            <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:bg-dark-elevated dark:text-dark-muted">
                                Busca un producto, indica cantidad y precio, y agrégalo a la recepción.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {receptionItems.map((item) => (
                                    <article key={item.lineId} className="grid grid-cols-1 items-end gap-3 rounded-lg bg-gray-50 p-3 dark:bg-dark-elevated md:grid-cols-[minmax(0,1.5fr)_minmax(6rem,0.7fr)_minmax(8rem,0.8fr)_minmax(7rem,0.7fr)_auto]">
                                        <div className="min-w-0 pb-1">
                                            <p className="text-xs font-medium text-gray-500 dark:text-dark-muted">Producto</p>
                                            <p className="truncate font-semibold text-gray-900 dark:text-dark-primary">{item.product_name}</p>
                                            <p className="mt-1 truncate text-sm text-gray-600 dark:text-dark-secondary">
                                                Proveedor: {item.supplier_name}
                                            </p>
                                        </div>
                                        <InputFuturistic
                                            label="Cantidad"
                                            type="number"
                                            min="0.01"
                                            step="any"
                                            value={item.quantity || ""}
                                            onChange={(event) => handleUpdateReceptionItem(item.lineId, "quantity", Number(event.target.value))}
                                        />
                                        <InputFuturistic
                                            label="Precio compra"
                                            type="number"
                                            min="0.01"
                                            step="any"
                                            value={item.purchase_price || ""}
                                            onChange={(event) => handleUpdateReceptionItem(item.lineId, "purchase_price", Number(event.target.value))}
                                        />
                                        <div className="pb-2 text-sm">
                                            <p className="text-xs text-gray-500 dark:text-dark-muted">Subtotal</p>
                                            <p className="font-semibold text-gray-900 dark:text-dark-primary">
                                                S/ {(item.quantity * item.purchase_price).toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={`Quitar ${item.product_name} de ${item.supplier_name}`}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                                            onClick={() => handleRemoveReceptionItem(item.lineId)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </article>
                                ))}
                                <div className="flex justify-end border-t border-gray-200 pt-3 text-right dark:border-dark-border">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-dark-muted">Total de la recepción</p>
                                        <p className="text-xl font-bold text-teal-700 dark:text-teal-300">S/ {cartTotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 md:justify-start">
                        <ButtonFuturistic
                            label="Cancelar"
                            gradient="bg-red-500"
                            icon={CircleX}
                            className="m-0 w-full sm:w-auto"
                            onClick={() => setIsAddProductReceptionModalOpen(false)}
                        />
                        <ButtonFuturistic
                            label={loading ? "" : `Registrar recepción (${receptionItems.length})`}
                            icon={loading ? LoaderPinwheel : Pencil}
                            onClick={saveReception}
                            disabled={loading}
                            className="m-0 w-full sm:w-auto"
                        />
                    </div>
                </div>
            </ModalFuturistic>
            </div>

            <div className="lg:w-3/4 w-full">
            <ModalFuturistic isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Recepción">
                {editedReception && (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                        <ProductAutocomplete
                            onSelect={(product) => setEditedReception(prev => ({ ...prev!, id_product: product.id_product }))}
                            onClear={() => setEditedReception(prev => ({ ...prev!, id_product: 0 }))}
                            initialName={editedReception.product_name ?? ""}
                        />
                        <SupplierAutocomplete
                            onSelect={(supplier) => setEditedReception(prev => ({ ...prev!, id_supplier: supplier.id_supplier }))}
                            onClear={() => setEditedReception(prev => ({ ...prev!, id_supplier: 0 }))}
                            value={editedReception.id_supplier && editedReception.supplier_name
                                ? { id_supplier: editedReception.id_supplier, name: editedReception.supplier_name, ruc: "" }
                                : null}
                        />
                        <InputFuturistic label="Cantidad" icon={Wallet} type="number" placeholder="0" value={editedReception.quantity || ""} onChange={(e) =>
                            setEditedReception(prev => ({ ...prev!, quantity: Number(e.target.value) }))
                        } />
                        <InputFuturistic label="Precio de Compra" icon={Banknote} type="number" placeholder="S/" value={editedReception.purchase_price || ""} onChange={(e) =>
                            setEditedReception(prev => ({ ...prev!, purchase_price: Number(e.target.value) }))
                        } />
                        <div className="md:col-span-2">
                            <DatePickerFuturistic
                                label="Fecha de Recepción"
                                value={editedReception.date?.slice(0, 10) ?? ""}
                                onChange={(date) => setEditedReception(prev => ({ ...prev!, date }))}
                            />
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 md:justify-start">
                            <ButtonFuturistic
                                label="Cancelar"
                                gradient="bg-red-500"
                                icon={CircleX}
                                className="m-0 w-full sm:w-auto"
                                onClick={() => setIsEditModalOpen(false)}
                            />
                            <ButtonFuturistic
                                label={loading ? "" : "Actualizar"}
                                icon={loading ? LoaderPinwheel : Pencil}
                                onClick={handleEditReception}
                                disabled={loading}
                                className="m-0 w-full sm:w-auto"
                            />
                        </div>
                    </div>
                )}
            </ModalFuturistic>
            </div>

            <TableFuturistic
                columns={columns}
                data={productReceptions}
                currentPage={currentPage}
                totalPages={paginationReception?.totalPages || 1}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                }}
                onSearch={setSearchTerm}
                toolbarContent={
                    <DateRangePicker
                        label="Filtrar recepciones por fecha"
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onRangeSelect={(from, to) => {
                            setDateFrom(from);
                            setDateTo(to);
                            setCurrentPage(1);
                        }}
                        onClear={() => {
                            setDateFrom("");
                            setDateTo("");
                            setCurrentPage(1);
                        }}
                    />
                }
                loading={loading}
                actions={(row) => (
                    <ButtonFuturistic
                        icon={Pencil}
                        gradient="bg-teal-500"
                        onClick={() => {
                            setEditedReception(row);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Editar
                    </ButtonFuturistic>
                )}
            />
        </div>
    );
};

export default ReceptionsAdministration;
