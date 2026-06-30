import { FC, JSX } from "react";
import { ButtonFuturistic, InputFuturistic, TitleFuturistic, ProductAutocomplete, SelectFuturistic, ShoppingCart, AlertModal, SwitchFuturistic } from "../components";
import { Banknote, LoaderPinwheel, NotebookPen, PencilLine, Plus, Save, Search } from "lucide-react";
import { paymentMethods } from "../constants";
import { useSalesAdministration } from "../hooks/useSalesAdministration";

const SalesAdministration: FC = (): JSX.Element => {
    const {
        cart,
        highlightId,
        dniSearch, setDniSearch,
        customer, setCustomer,
        paymentMethod, setPaymentMethod,
        operationNumber, setOperationNumber,
        confirmOpen, setConfirmOpen,
        clearOpen, setClearOpen,
        installmentsEnabled, setInstallmentsEnabled,
        installmentRows, setInstallmentRows,
        loading, loadingSale, total,
        handleSearchByDni,
        handleSaveCustomer,
        handleProductSelect,
        updateQuantity,
        removeProduct,
        handleConfirmRemove,
        clearCart,
        handleConfirmClear,
        handleRegisterSale,
    } = useSalesAdministration();

    return (
        <div className="lg:px-10 px-4 py-6">
            <TitleFuturistic as="h1" className="text-center mb-8">Administración de Ventas</TitleFuturistic>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-lg bg-white dark:bg-dark-card/50">
                    <TitleFuturistic as="h2" className="text-lg mb-4">Información del Cliente</TitleFuturistic>

                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <InputFuturistic
                                    label="DNI"
                                    icon={PencilLine}
                                    placeholder="01234567"
                                    value={dniSearch}
                                    maxLength={8}
                                    onChange={(e) => setDniSearch(e.target.value.replace(/\D/g, "").slice(0, 8))}
                                />
                            </div>
                            <ButtonFuturistic
                                label={loading ? "" : "Consultar DNI"}
                                icon={loading ? LoaderPinwheel : Search}
                                className="w-full md:w-auto mt-2 md:mt-6"
                                onClick={handleSearchByDni}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputFuturistic
                                label="Nombre"
                                icon={NotebookPen}
                                placeholder="Nombre"
                                value={customer?.name || ""}
                                readOnly={customer?.id_customer !== 0}
                                onChange={(e) => setCustomer({ ...customer!, name: e.target.value })}
                            />
                            <InputFuturistic
                                label="Primer Apellido"
                                icon={NotebookPen}
                                placeholder="Primer Apellido"
                                value={customer?.first_surname || ""}
                                readOnly={customer?.id_customer !== 0}
                                onChange={(e) => setCustomer({ ...customer!, first_surname: e.target.value })}
                            />
                            <InputFuturistic
                                label="Segundo Apellido"
                                icon={NotebookPen}
                                placeholder="Segundo Apellido"
                                value={customer?.second_surname || ""}
                                readOnly={customer?.id_customer !== 0}
                                onChange={(e) => setCustomer({ ...customer!, second_surname: e.target.value })}
                            />
                            <ButtonFuturistic
                                label={loading ? "" : "Guardar Cliente"}
                                icon={loading ? LoaderPinwheel : Save}
                                disabled={!customer || !customer.name || !customer.first_surname}
                                onClick={handleSaveCustomer}
                            />
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 dark:border-dark-border pt-6">
                        <TitleFuturistic as="h2" className="text-lg mb-4">Agregar Producto</TitleFuturistic>
                        <ProductAutocomplete onSelect={handleProductSelect} />
                    </div>

                    <div className="mt-6">
                        <SelectFuturistic
                            icon={Banknote}
                            label="Método de Pago"
                            options={[{ value: "", label: "Selecciona un método de pago" }, ...paymentMethods]}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <InputFuturistic
                        label="Número de operación"
                        icon={NotebookPen}
                        placeholder="Ingrese el número de operación"
                        value={operationNumber}
                        onChange={(e) => setOperationNumber(e.target.value)}
                        readOnly={paymentMethod.toLowerCase() === 'PagoEfectivo'}
                        disabled={paymentMethod.toLowerCase() === 'pagoefectivo'}
                    />

                    <div className="mt-6 border-t border-gray-200 dark:border-dark-border pt-4">
                        <div className="flex items-center justify-between">
                            <TitleFuturistic as="h2" className="text-base">Pago en cuotas</TitleFuturistic>
                            <SwitchFuturistic
                                checked={installmentsEnabled}
                                onChange={setInstallmentsEnabled}
                            />
                        </div>
                        {installmentsEnabled && (
                            <div className="mt-4 space-y-3">
                                {installmentRows.map((row, i) => (
                                    <div key={i} className="flex gap-2 items-end">
                                        <InputFuturistic
                                            label="Monto (S/)"
                                            type="number"
                                            value={row.amount}
                                            onChange={(e) => {
                                                const updated = [...installmentRows];
                                                updated[i] = { ...updated[i], amount: Number(e.target.value) };
                                                setInstallmentRows(updated);
                                            }}
                                        />
                                        <InputFuturistic
                                            label="Vencimiento"
                                            type="date"
                                            value={row.due_date}
                                            onChange={(e) => {
                                                const updated = [...installmentRows];
                                                updated[i] = { ...updated[i], due_date: e.target.value };
                                                setInstallmentRows(updated);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700 mb-1"
                                            onClick={() => setInstallmentRows(prev => prev.filter((_, j) => j !== i))}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <ButtonFuturistic
                                    label="Agregar cuota"
                                    icon={Plus}
                                    onClick={() =>
                                        setInstallmentRows(prev => [...prev, { amount: Math.round(total / Math.max(prev.length + 1, 1)), due_date: "" }])
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>

                <ShoppingCart
                    cart={cart}
                    highlightId={highlightId}
                    updateQuantity={updateQuantity}
                    removeProduct={removeProduct}
                    clearCart={clearCart}
                    registerSale={handleRegisterSale}
                    total={total}
                    loadingSale={loadingSale}
                    customerSelected={!!customer}
                    paymentMethodSelected={!!paymentMethod}
                />

                <AlertModal
                    open={confirmOpen}
                    title="Eliminar producto"
                    message="¿Estás seguro de que deseas eliminar este producto del carrito?"
                    confirmText="Sí, eliminar"
                    cancelText="Cancelar"
                    onConfirm={handleConfirmRemove}
                    onCancel={() => setConfirmOpen(false)}
                />

                <AlertModal
                    open={clearOpen}
                    title="Vaciar carrito"
                    message="¿Estás seguro de que deseas vaciar todo el carrito?"
                    confirmText="Sí, vaciar"
                    cancelText="Cancelar"
                    onConfirm={handleConfirmClear}
                    onCancel={() => setClearOpen(false)}
                />

            </div>
        </div>
    );
};

export default SalesAdministration;
