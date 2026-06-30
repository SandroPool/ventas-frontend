import { useSuppliersAdministration } from "../hooks/useSuppliersAdministration";
import { ButtonFuturistic, InputFuturistic, ModalFuturistic, TitleFuturistic, TableFuturistic } from "../components";
import { LoaderPinwheel, Pencil, Plus } from "lucide-react";

const SuppliersAdministration = () => {
    const {
        suppliers, paginationSupplier, loading,
        searchTerm, setSearchTerm,
        isAddSupplierModalOpen, setIsAddSupplierModalOpen,
        isEditSupplierModalOpen, setIsEditSupplierModalOpen,
        newSupplier, setNewSupplier,
        editingSupplier, setEditingSupplier,
        fetchSuppliers,
        handleAddSupplier,
        handleEditSupplier,
    } = useSuppliersAdministration();

    return (
        <div className="px-4 lg:px-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Proveedores</TitleFuturistic>

            <div>
                <ButtonFuturistic label="Añadir Proveedor" icon={Plus} onClick={() => setIsAddSupplierModalOpen(true)} />
                <ModalFuturistic isOpen={isAddSupplierModalOpen} onClose={() => setIsAddSupplierModalOpen(false)} title="Agregar Proveedor">
                    <InputFuturistic label="Nombre" placeholder="Nombre" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} />
                    <InputFuturistic label="RUC" placeholder="RUC" value={newSupplier.ruc} onChange={(e) => setNewSupplier({ ...newSupplier, ruc: e.target.value })} />
                    <InputFuturistic label="Dirección" placeholder="Dirección" value={newSupplier.address} onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })} />
                    <InputFuturistic label="Teléfono" placeholder="Teléfono" type="number" value={newSupplier.phone} onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })} />
                    <InputFuturistic label="Contacto" placeholder="Contacto" value={newSupplier.contact} onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })} />
                    <ButtonFuturistic label={loading ? "" : "Crear Proveedor"} icon={loading ? LoaderPinwheel : Plus} onClick={handleAddSupplier} disabled={loading} className="mt-3 w-full" />
                </ModalFuturistic>
                <TableFuturistic
                    columns={[
                        { key: "name", label: "Nombre" },
                        { key: "ruc", label: "RUC" },
                        { key: "address", label: "Dirección" },
                        { key: "phone", label: "Teléfono" },
                        { key: "contact", label: "Contacto" },
                    ]}
                    data={suppliers}
                    currentPage={paginationSupplier?.page || 1}
                    totalPages={paginationSupplier?.totalPages || 1}
                    onPageChange={(page) => fetchSuppliers(page, 10, searchTerm)}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        fetchSuppliers(1, 10, term);
                    }}
                    actions={(supplier) => (
                        <ButtonFuturistic
                            icon={Pencil}
                            onClick={() => {
                                setEditingSupplier(supplier);
                                setIsEditSupplierModalOpen(true);
                            }}
                            gradient="bg-teal-500"
                        />
                    )}
                    loading={loading}
                />
                <ModalFuturistic isOpen={isEditSupplierModalOpen} onClose={() => setIsEditSupplierModalOpen(false)} title="Editar Proveedor">
                    {editingSupplier && (
                        <>
                            <InputFuturistic label="Nombre" value={editingSupplier.name} onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })} />
                            <InputFuturistic label="RUC" value={editingSupplier.ruc} onChange={(e) => setEditingSupplier({ ...editingSupplier, ruc: e.target.value })} />
                            <InputFuturistic label="Dirección" value={editingSupplier.address} onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })} />
                            <InputFuturistic label="Teléfono" type="number" value={editingSupplier.phone.toString()} onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })} />
                            <InputFuturistic label="Contacto" value={editingSupplier.contact} onChange={(e) => setEditingSupplier({ ...editingSupplier, contact: e.target.value })} />
                            <ButtonFuturistic label={loading ? "" : "Guardar Cambios"} icon={loading ? LoaderPinwheel : Pencil} onClick={handleEditSupplier} disabled={loading} className="mt-3 w-full" />
                        </>
                    )}
                </ModalFuturistic>
            </div>
        </div>
    );
};

export default SuppliersAdministration;
