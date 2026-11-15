import { FC, JSX, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonFuturistic, InputFuturistic, TitleFuturistic, ProductAutocomplete, SelectFuturistic, ShoppingCart, AlertModal, SwitchFuturistic, CustomerDniAutocomplete } from "../components";
import { Banknote, LoaderPinwheel, NotebookPen, Pencil, Plus, Save, Search } from "lucide-react";
import { paymentMethods } from "../constants";
import { useSalesAdministration } from "../hooks/useSalesAdministration";
import { Product } from "../store/useProductStore";
import { StockItem } from "../services/stock.service";
import { getAllProducts } from "../services/product.service";
import toast from "react-hot-toast";

const SalesAdministration: FC = (): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
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
        updatePrice,
        removeProduct,
        handleConfirmRemove,
        clearCart,
        handleConfirmClear,
        handleRegisterSale,
    } = useSalesAdministration();
    const productToSell = (location.state as { productToSell?: StockItem } | null)?.productToSell;

    useEffect(() => {
        if (!productToSell) return;

        let cancelled = false;
        const loadProduct = async () => {
            const response = await getAllProducts(1, 50, productToSell.name, true);
            if (cancelled) return;

            const fullProduct = (response?.data as Product[] | undefined)?.find(
                (product) => product.id_product === productToSell.id_product
            );
            navigate(location.pathname, { replace: true, state: null });

            if (!fullProduct) {
                toast.error("No se pudo encontrar un producto activo para vender");
                return;
            }

            handleProductSelect(fullProduct);
        };
        void loadProduct();

        return () => {
            cancelled = true;
        };
    }, [handleProductSelect, location.pathname, navigate, productToSell]);

    return (
        <div className={`lg:px-10 px-4 pt-6 ${cart.length > 0 ? "pb-32 lg:pb-6" : "pb-6"}`}>
            <TitleFuturistic as="h1" className="text-center mb-8">Administración de Ventas</TitleFuturistic>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-lg bg-white dark:bg-dark-card/50">
                    <TitleFuturistic as="h2" className="text-lg mb-4">Información del Cliente</TitleFuturistic>

                    <div className="space-y-4">
                        {customer && customer.id_customer !== 0 ? (
                            <div className="flex flex-col gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-dark-border dark:bg-dark-elevated sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-dark-primary">
                                        {customer.name} {customer.first_surname} {customer.second_surname}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-dark-muted">DNI: {customer.dni}</p>
                                </div>
                                <ButtonFuturistic
                                    label="Cambiar cliente"
                                    icon={Pencil}
                                    className="w-full shrink-0 sm:w-auto"
                                    onClick={() => {
                                        setCustomer(null);
                                        setDniSearch("");
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <CustomerDniAutocomplete
                                        value={dniSearch}
                                        onChange={(value) => {
                                            setDniSearch(value);
                                            setCustomer(null);
                                        }}
                                        onSelect={setCustomer}
                                    />
                                    <ButtonFuturistic
                                        label={loading ? "" : "Consultar DNI"}
                                        icon={loading ? LoaderPinwheel : Search}
                                        className="w-full md:w-auto mt-2 md:mt-6"
                                        onClick={handleSearchByDni}
                                    />
                                </div>

                                {customer?.id_customer === 0 && (
                                    <>
                                        <div
                                            role="status"
                                            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200"
                                        >
                                            No encontramos un cliente con el DNI <strong>{dniSearch}</strong>. Completa los datos para registrarlo.
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputFuturistic
                                                label="Nombre"
                                                icon={NotebookPen}
                                                placeholder="Nombre"
                                                value={customer.name}
                                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                            />
                                            <InputFuturistic
                                                label="Primer Apellido"
                                                icon={NotebookPen}
                                                placeholder="Primer Apellido"
                                                value={customer.first_surname}
                                                onChange={(e) => setCustomer({ ...customer, first_surname: e.target.value })}
                                            />
                                            <InputFuturistic
                                                label="Segundo Apellido"
                                                icon={NotebookPen}
                                                placeholder="Segundo Apellido"
                                                value={customer.second_surname}
                                                onChange={(e) => setCustomer({ ...customer, second_surname: e.target.value })}
                                            />
                                            <ButtonFuturistic
                                                label={loading ? "" : "Guardar Cliente"}
                                                icon={loading ? LoaderPinwheel : Save}
                                                disabled={!customer.name || !customer.first_surname}
                                                onClick={handleSaveCustomer}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-8 border-t border-gray-200 dark:border-dark-border pt-6">
                        <TitleFuturistic as="h2" className="text-lg mb-4">Agregar Producto</TitleFuturistic>
                        <ProductAutocomplete activeOnly onSelect={handleProductSelect} />
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
                    {paymentMethod.toLowerCase() === "pagoefectivo" ? (
                        <p className="text-sm text-gray-600 dark:text-dark-muted">
                            El número de operación se genera automáticamente para PagoEfectivo.
                        </p>
                    ) : paymentMethod ? (
                        <InputFuturistic
                            label="Número de operación"
                            icon={NotebookPen}
                            placeholder="Ingrese el número de operación"
                            value={operationNumber}
                            onChange={(e) => setOperationNumber(e.target.value)}
                        />
                    ) : null}

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
                    updatePrice={updatePrice}
                    removeProduct={removeProduct}
                    clearCart={clearCart}
                    registerSale={handleRegisterSale}
                    total={total}
                    loadingSale={loadingSale}
                    customerSelected={!!customer && customer.id_customer !== 0}
                    paymentMethodSelected={!!paymentMethod && !!operationNumber}
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
