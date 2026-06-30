import React from "react";
import { Product } from "../store/useProductStore";
import { Banknote, Box, Minus, Plus, Trash2, X, ShoppingCart as CartIcon } from "lucide-react";
import { ButtonFuturistic, TitleFuturistic } from ".";

interface ShoppingCartProps {
    cart: { product: Product; quantity: number }[];
    highlightId: number | null;
    updateQuantity: (id: number, quantity: number) => void;
    removeProduct: (id: number) => void;
    clearCart: () => void;
    registerSale: () => Promise<void>;
    customerSelected: boolean;
    paymentMethodSelected: boolean;
    total: number;  // ✅ Se recibe como prop, ya no se recalcula dentro del componente
    loadingSale: boolean;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
    cart,
    highlightId,
    updateQuantity,
    removeProduct,
    clearCart,
    registerSale,
    customerSelected,
    paymentMethodSelected,
    total, // ✅ Ahora usamos el total pasado como prop
    loadingSale
}) => {
    return (
        <div className="border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-lg bg-white dark:bg-dark-card/50">
            <div className="flex items-center justify-between mb-6">
                <TitleFuturistic as="h2" className="text-lg">Carrito de Compras</TitleFuturistic>
                <div className="flex items-center gap-3">
                    {cart.length > 0 && (
                        <button onClick={clearCart} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                            <X size={16} /><span>Vaciar</span>
                        </button>
                    )}
                    <CartIcon className="text-amber-500 dark:text-yellow-400" size={24} />
                </div>
            </div>

            {!cart.length ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-card/30">
                    <Box className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="text-gray-500 dark:text-dark-muted text-lg">No hay productos en el carrito.</p>
                    <p className="text-gray-400 dark:text-dark-muted text-sm mt-2">Seleccione productos para añadir</p>
                </div>
            ) : (
                <div className={`space-y-3 ${cart.length >= 5 ? "max-h-96 overflow-y-auto pr-2" : ""}`}>
                    {cart.map(({ product, quantity }) => (
                        <div
                            key={product.id_product}
                            className={`flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-elevated/80 border ${highlightId === product.id_product
                                ? "border-amber-400 shadow-amber-400/20 dark:border-yellow-400 dark:shadow-yellow-400/20 shadow-lg"
                                : "border-gray-200 dark:border-dark-border"
                                }`}
                        >
                            {/* Icono Producto */}
                            <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-dark-elevated rounded-md border border-gray-200 dark:border-dark-border">
                                <Box className="text-gray-700 dark:text-gray-300" size={24} />
                            </div>

                            {/* Info Producto */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 dark:text-dark-primary">{product.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-dark-secondary truncate">{product.description}</p>

                                {/* Controles */}
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 bg-white dark:bg-dark-card text-gray-800 dark:text-dark-primary rounded-full shadow-md px-2 py-1 border border-gray-200 dark:border-dark-border">
                                        <button
                                            onClick={() => updateQuantity(product.id_product, Math.max(1, quantity - 1))}
                                            className="p-1 hover:text-teal-600 dark:hover:text-teal-400"
                                            aria-label="Disminuir"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id_product, quantity + 1)}
                                            className="p-1 hover:text-teal-600 dark:hover:text-teal-400"
                                            aria-label="Aumentar"
                                            disabled={quantity >= (product.stock ?? Infinity)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button onClick={() => removeProduct(product.id_product)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-400/20 rounded-full" aria-label="Eliminar">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Precio */}
                            <div className="text-right">
                                <p className="font-semibold text-gray-800 dark:text-dark-primary">S/{product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-600 dark:text-dark-secondary mt-1">Total: S/{(product.price * quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Totales y Acción */}
            <div className="mt-6 border-t border-gray-200 dark:border-dark-border pt-4">
                <p className="font-bold text-4xl text-center mt-4 mb-6 text-amber-500 dark:text-yellow-400">
                    Total: S/{total.toFixed(2)}
                </p>
                <ButtonFuturistic
                    label={loadingSale ? "Procesando..." : "Registrar Venta"}
                    icon={Banknote}
                    onClick={registerSale}
                    disabled={!cart.length || !customerSelected || !paymentMethodSelected || loadingSale}
                    className={`w-full ${(!cart.length || !customerSelected || !paymentMethodSelected || loadingSale) ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    );
};

export default ShoppingCart;
