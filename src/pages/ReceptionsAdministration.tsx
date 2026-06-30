import { JSX, FC } from "react";
import { Banknote, Calendar, LoaderPinwheel, Pencil, Plus, Wallet } from "lucide-react";
import { useReceptionsAdministration } from "../hooks/useReceptionsAdministration";
import { ButtonFuturistic, InputFuturistic, ModalFuturistic, TitleFuturistic, ProductAutocomplete, SupplierAutocomplete } from "../components";
import TableFuturistic, { Column } from "../components/TableFuturistic";
import { formatDate } from "../utils/functionDate";
import { ProductReceptions } from "../store/useReceptionStore";

const ReceptionsAdministration: FC = (): JSX.Element => {
    const {
        productReceptions, paginationReception, loading,
        setSearchTerm,
        currentPage, setCurrentPage,
        isAddProductReceptionModalOpen, setIsAddProductReceptionModalOpen,
        newProductReception, setNewProductReception,
        isEditModalOpen, setIsEditModalOpen,
        editedReception, setEditedReception,
        handleAddProductReception,
        handleEditReception,
    } = useReceptionsAdministration();

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

            <ModalFuturistic isOpen={isAddProductReceptionModalOpen} onClose={() => setIsAddProductReceptionModalOpen(false)} title="Nuevo Inventario">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    <ProductAutocomplete onSelect={(product) => setNewProductReception(prev => ({ ...prev, id_product: product.id_product }))} />
                    <SupplierAutocomplete onSelect={(supplier) => setNewProductReception((prev) => ({ ...prev, id_supplier: supplier.id_supplier }))} />
                    <InputFuturistic label="Cantidad" icon={Wallet} type="number" placeholder="0" value={newProductReception.quantity || ""} onChange={(e) =>
                        setNewProductReception((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                    } />
                    <InputFuturistic label="Precio de Compra" icon={Banknote} type="number" placeholder="S/" value={newProductReception.purchase_price || ""} onChange={(e) =>
                        setNewProductReception((prev) => ({ ...prev, purchase_price: Number(e.target.value) }))
                    } />
                    <div className="col-span-2">
                        <InputFuturistic label="Fecha de Recepción" icon={Calendar} type="date" value={newProductReception.date}
                            onChange={(e) => setNewProductReception((prev) => ({ ...prev, date: e.target.value }))}
                        />
                    </div>
                    <div className="col-span-2">
                        <ButtonFuturistic
                            label={loading ? "" : "Guardar Cambios"}
                            icon={loading ? LoaderPinwheel : Pencil}
                            onClick={handleAddProductReception}
                            disabled={loading}
                            className="mt-3 w-full"
                        />
                    </div>
                </div>
            </ModalFuturistic>

            <ModalFuturistic isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Recepción">
                {editedReception && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        <ProductAutocomplete onSelect={(product) => setEditedReception(prev => ({ ...prev!, id_product: product.id_product }))} />
                        <SupplierAutocomplete onSelect={(supplier) => setEditedReception(prev => ({ ...prev!, id_supplier: supplier.id_supplier }))} />
                        <InputFuturistic label="Cantidad" icon={Wallet} type="number" placeholder="0" value={editedReception.quantity || ""} onChange={(e) =>
                            setEditedReception(prev => ({ ...prev!, quantity: Number(e.target.value) }))
                        } />
                        <InputFuturistic label="Precio de Compra" icon={Banknote} type="number" placeholder="S/" value={editedReception.purchase_price || ""} onChange={(e) =>
                            setEditedReception(prev => ({ ...prev!, purchase_price: Number(e.target.value) }))
                        } />
                        <div className="col-span-2">
                            <ButtonFuturistic
                                label={loading ? "" : "Actualizar"}
                                icon={loading ? LoaderPinwheel : Pencil}
                                onClick={handleEditReception}
                                disabled={loading}
                                className="mt-3 w-full"
                            />
                        </div>
                    </div>
                )}
            </ModalFuturistic>

            <TableFuturistic
                columns={columns}
                data={productReceptions}
                currentPage={currentPage}
                totalPages={paginationReception?.totalPages || 1}
                onPageChange={setCurrentPage}
                onSearch={setSearchTerm}
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
