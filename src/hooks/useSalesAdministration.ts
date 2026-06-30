import { useEffect, useState } from "react";
import { useSalesStore } from "../store/useSalesStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCustomerStore, Customer } from "../store/useCustomerStore";
import { Product } from "../store/useProductStore";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { validateDNI } from "../utils/validateDNI";
import { Sale } from "../services/sales.service";
import { createInstallments } from "../services/installment.service";

export const useSalesAdministration = () => {
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [highlightId, setHighlightId] = useState<number | null>(null);
    const [dniSearch, setDniSearch] = useState<string>("");
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [operationNumber, setOperationNumber] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [toRemoveId, setToRemoveId] = useState<number | null>(null);
    const [clearOpen, setClearOpen] = useState<boolean>(false);
    const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
    const [installmentRows, setInstallmentRows] = useState<{ amount: number; due_date: string }[]>([]);

    const { loading, searchCustomer, addCustomer } = useCustomerStore();
    const { registerSale, loadingSale } = useSalesStore();
    const { token } = useAuthStore();

    const decodedToken = token ? jwtDecode<{ id: number; role: string }>(token) : { id: 0, role: '' };
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    useEffect(() => {
        if (paymentMethod.toLocaleLowerCase() === 'PagoEfectivo'.toLocaleLowerCase()) {
            const opNum = `EF-${Date.now()}`
            setOperationNumber(opNum);
        } else {
            setOperationNumber('');
        }
    }, [paymentMethod]);

    const handleSearchByDni = async (): Promise<void> => {
        if (!/^\d{8}$/.test(dniSearch)) {
            toast.error("El DNI debe tener 8 dígitos");
            return;
        }
        const result = await searchCustomer(dniSearch);
        if (result === "not_found") {
            toast.error("Cliente no encontrado, registrar manualmente");
            setCustomer({ id_customer: 0, dni: dniSearch, name: "", first_surname: "", second_surname: "", createdAt: "", updatedAt: "" });
        } else if (result) {
            setCustomer(result);
        }
    };

    const handleSaveCustomer = async (): Promise<void> => {
        if (!customer || !customer.name || !customer.first_surname) {
            toast.error("Completa los campos obligatorios");
            return;
        }
        const currentDni = customer.id_customer === 0 ? dniSearch : customer.dni;
        if (!validateDNI(currentDni)) return;

        try {
            const newCustomer = await addCustomer({
                dni: currentDni,
                name: customer.name,
                first_surname: customer.first_surname,
                second_surname: customer.second_surname || "",
            });
            if (newCustomer) setCustomer(newCustomer);
        } catch (error) {
            console.error("Error al guardar el cliente:", error);
            toast.error("Error al guardar el cliente");
        }
    };

    const handleProductSelect = (product: Product): void => {
        console.info({
            nombre: product.name,
            cantidadDiponible: product.stock,
        });

        if (!product.stock || product.stock <= 0) {
            toast.error("No hay stock disponible")
            return
        }

        setCart(prevCart => {
            const index = prevCart.findIndex(item => item.product.id_product === product.id_product);
            if (index !== -1) {
                return prevCart.map((item, i) =>
                    i === index ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { product, quantity: 1 }];
        });

        setHighlightId(product.id_product);
        setTimeout(() => setHighlightId(null), 1500);
        toast.success(`${product.name} añadido al carrito`);
    };

    const updateQuantity = (id: number, quantity: number): void => {
        setCart(prevCart =>
            prevCart
                .map(item => {
                    if (item.product.id_product !== id) return item;
                    const maxStock = item.product.stock ?? Infinity;
                    return { ...item, quantity: Math.max(0, Math.min(quantity, maxStock)) };
                })
                .filter(item => item.quantity > 0)
        );
    };

    const removeProduct = (id: number): void => {
        setToRemoveId(id);
        setConfirmOpen(true);
    };

    const handleConfirmRemove = (): void => {
        if (toRemoveId === null) return;
        setCart(prevCart => prevCart.filter(item => item.product.id_product !== toRemoveId));
        toast.success('Producto eliminado');
        setConfirmOpen(false);
        setToRemoveId(null);
    };

    const clearCart = (): void => {
        if (!cart.length) return;
        setClearOpen(true);
    };

    const handleConfirmClear = (): void => {
        setCart([]);
        toast.success("Carrito vaciado");
        setClearOpen(false);
    };

    const handleRegisterSale = async (): Promise<void> => {
        if (!cart.length) {
            toast.error("El carrito está vacío");
            return;
        }
        if (!customer || customer.id_customer === 0) {
            toast.error("Debe seleccionar un cliente");
            return;
        }
        if (!paymentMethod) {
            toast.error("Debe seleccionar un método de pago");
            return;
        }
        if (!operationNumber) {
            toast.error("Debe ingresar el número de operación");
            return;
        }

        const saleDate = new Date().toISOString();

        const sale: Sale = {
            id_user: decodedToken.id,
            id_customer: customer.id_customer,
            payment_method: paymentMethod,
            operation_number: operationNumber,
            date: saleDate,
            customer: {
                name: customer.name,
                first_surname: customer.first_surname,
                second_surname: customer.second_surname || "",
            },
            details: cart.map(item => ({
                id_product: item.product.id_product,
                quantity: item.quantity,
                unit_price: item.product.price,
                id_sale: 0,
                id_detail: 0,
                createdAt: saleDate,
                updatedAt: saleDate,
                product: item.product,
            })),
        };

        const saleResponse = await registerSale(sale);
        if (saleResponse) {
            if (installmentsEnabled && installmentRows.length > 0) {
                const saleId = saleResponse.id_sale || 0;
                if (saleId) {
                    await createInstallments(saleId, installmentRows);
                }
            }
            setCustomer(null);
            setDniSearch("");
            setCart([]);
            setInstallmentsEnabled(false);
            setInstallmentRows([]);
        } else {
            console.error('Ocurrió un error al registrar la venta')
        }
    };

    return {
        cart, setCart,
        highlightId, setHighlightId,
        dniSearch, setDniSearch,
        customer, setCustomer,
        paymentMethod, setPaymentMethod,
        operationNumber, setOperationNumber,
        confirmOpen, setConfirmOpen,
        toRemoveId, setToRemoveId,
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
    };
};
