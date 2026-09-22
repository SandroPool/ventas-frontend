import { CircleX, LoaderPinwheel, Pencil, Plus, Save } from "lucide-react";
import {
    ButtonFuturistic,
    InputFuturistic,
    ModalFuturistic,
    TableFuturistic,
    TitleFuturistic
} from "../components";
import { useCustomersAdministration } from "../hooks/useCustomersAdministration";

const CustomersAdministration = () => {
    const {
        customers, paginationCustomer, loading,
        searchTerm, setSearchTerm,
        isAddCustomerModalOpen, setIsAddCustomerModalOpen,
        isEditCustomerModalOpen, setIsEditCustomerModalOpen,
        newCustomer, setNewCustomer,
        editingCustomer, setEditingCustomer,
        fetchCustomers,
        handleAddCustomer,
        handleEditCustomer,
    } = useCustomersAdministration();

    return (
        <div className="px-4 lg:px-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Clientes</TitleFuturistic>

            <ButtonFuturistic
                label="Añadir Cliente"
                icon={Plus}
                onClick={() => setIsAddCustomerModalOpen(true)}
            />

            <TableFuturistic
                columns={[
                    { key: "name", label: "Nombre" },
                    { key: "first_surname", label: "Primer Apellido" },
                    { key: "second_surname", label: "Segundo Apellido" },
                    { key: "dni", label: "DNI" },
                ]}
                data={customers}
                currentPage={paginationCustomer?.page || 1}
                totalPages={paginationCustomer?.totalPages || 1}
                onPageChange={(page) => fetchCustomers(page, 10, searchTerm)}
                onSearch={(term) => {
                    setSearchTerm(term);
                    fetchCustomers(1, 10, term);
                }}
                actions={(customer) => (
                    <ButtonFuturistic
                        gradient="bg-teal-500"
                        icon={Pencil}
                        onClick={() => { setEditingCustomer(customer); setIsEditCustomerModalOpen(true); }}
                    />
                )}
                loading={loading}
            />

            <ModalFuturistic
                isOpen={isAddCustomerModalOpen}
                onClose={() => setIsAddCustomerModalOpen(false)}
                title="Añadir Cliente"
            >
                <InputFuturistic
                    label="Nombre"
                    placeholder="nombre: "
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
                <InputFuturistic
                    label="Primer Apellido"
                    placeholder="primer apellido: "
                    value={newCustomer.first_surname}
                    onChange={(e) => setNewCustomer({ ...newCustomer, first_surname: e.target.value })}
                />
                <InputFuturistic
                    label="Segundo Apellido"
                    placeholder="segundo apellido: "
                    value={newCustomer.second_surname}
                    onChange={(e) => setNewCustomer({ ...newCustomer, second_surname: e.target.value })}
                />
                <InputFuturistic
                    label="DNI"
                    placeholder="01234567"
                    value={newCustomer.dni}
                    maxLength={8}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                        setNewCustomer({ ...newCustomer, dni: value })
                    }}
                />
                <div className="mt-4 flex justify-start gap-3">
                    <ButtonFuturistic
                        label="Cancelar"
                        gradient="bg-red-500"
                        icon={CircleX}
                        className="m-0"
                        onClick={() => setIsAddCustomerModalOpen(false)}
                    />
                    <ButtonFuturistic
                        label={loading ? "" : "Guardar Cliente"}
                        icon={loading ? LoaderPinwheel : Save}
                        onClick={handleAddCustomer}
                        className="m-0"
                    />
                </div>
            </ModalFuturistic>

            <ModalFuturistic
                isOpen={isEditCustomerModalOpen}
                onClose={() => setIsEditCustomerModalOpen(false)}
                title="Editar Cliente"
            >
                {editingCustomer && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputFuturistic
                            label="Nombre"
                            placeholder="nombre"
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                        />
                        <InputFuturistic
                            label="Primer Apellido"
                            placeholder="primer apellido"
                            value={editingCustomer.first_surname}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, first_surname: e.target.value })}
                        />
                        <InputFuturistic
                            label="Segundo Apellido"
                            placeholder="segundo apellido"
                            value={editingCustomer.second_surname}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, second_surname: e.target.value })}
                        />
                        <InputFuturistic
                            label="DNI"
                            placeholder="01234567"
                            value={editingCustomer?.dni || ""}
                            maxLength={8}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                                setEditingCustomer({ ...editingCustomer, dni: value });
                            }}
                        />
                        <div className="md:col-span-2 flex justify-start gap-3">
                            <ButtonFuturistic
                                label="Cancelar"
                                gradient="bg-red-500"
                                icon={CircleX}
                                className="m-0"
                                onClick={() => setIsEditCustomerModalOpen(false)}
                            />
                            <ButtonFuturistic
                                label={loading ? "" : "Actualizar Cliente"}
                                icon={loading ? LoaderPinwheel : Plus}
                                onClick={handleEditCustomer}
                                className="m-0"
                            />
                        </div>
                    </div>
                )}
            </ModalFuturistic>
        </div>
    );
};

export default CustomersAdministration;
