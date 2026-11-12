import { FC, JSX, useEffect, useRef, useState, type FormEvent } from "react";
import { ArchiveX, ChevronLeft, ChevronRight, ImageOff, LoaderPinwheel, Search } from "lucide-react";
import { InputFuturistic, ModalFuturistic, TitleFuturistic } from "../components";
import { STOCK_PAGE_SIZE, StockItem } from "../services/stock.service";
import { useStockAdministration } from "../hooks/useStockAdministration";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
});

interface ProductImageProps {
    src: string | null;
    alt: string;
    className: string;
}

const ProductImage = ({ src, alt, className }: ProductImageProps) => {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    const imageUrl = src ? new URL(src, import.meta.env.VITE_BASE_URL).toString() : null;

    return (
        <div className={`flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-dark-elevated ${className}`}>
            {imageUrl && !failed ? (
                <img
                    src={imageUrl}
                    alt={alt}
                    loading="lazy"
                    className="h-full w-full object-contain"
                    onError={() => setFailed(true)}
                />
            ) : (
                <ImageOff className="text-gray-400 dark:text-dark-muted" size={36} aria-label="Sin imagen" />
            )}
        </div>
    );
};

const formatExpirationDate = (value: string | null) => {
    if (!value) return "No especificada";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "No especificada"
        : date.toLocaleDateString("es-PE", { timeZone: "UTC" });
};

const StockAdministration: FC = (): JSX.Element => {
    const { stock, paginationStock, loading, fetchStock } = useStockAdministration();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    }, []);

    const clearSearchTimeout = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        clearSearchTimeout();
        searchTimeoutRef.current = setTimeout(() => {
            fetchStock(1, STOCK_PAGE_SIZE, value);
        }, 300);
    };

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearSearchTimeout();
        fetchStock(1, STOCK_PAGE_SIZE, searchTerm);
    };

    const handlePageChange = (page: number) => {
        clearSearchTimeout();
        fetchStock(page, STOCK_PAGE_SIZE, searchTerm);
    };

    return (
        <div className="space-y-6 px-4 pb-8 lg:px-10 lg:pt-5">
            <div>
                <TitleFuturistic as="h1">Catálogo de Productos</TitleFuturistic>
                <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted">
                    Explora los productos y consulta su disponibilidad en stock.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xl">
                    <InputFuturistic
                        type="search"
                        value={searchTerm}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        placeholder="Buscar por nombre, SKU o descripción…"
                        aria-label="Buscar productos por nombre, SKU o descripción"
                        icon={Search}
                    />
                </form>

            </div>

            {loading && stock.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-gray-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-muted">
                    <LoaderPinwheel size={32} className="animate-spin text-teal-500" />
                    <span>Cargando catálogo...</span>
                </div>
            ) : stock.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-gray-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-muted">
                    <ArchiveX size={36} />
                    <p className="text-center">
                        {searchTerm ? "No encontramos productos que coincidan con tu búsqueda." : "Aún no hay productos para mostrar."}
                    </p>
                </div>
            ) : (
                <>
                    {loading && (
                        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-muted" role="status">
                            <LoaderPinwheel size={16} className="animate-spin text-teal-500" />
                            Actualizando catálogo...
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stock.map((product) => {
                            const hasStock = Number(product.stock) > 0;

                            return (
                                <button
                                    key={product.id_product}
                                    type="button"
                                    onClick={() => setSelectedProduct(product)}
                                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-dark-border dark:bg-dark-card"
                                    aria-label={`Ver detalle de ${product.name}`}
                                >
                                    <ProductImage
                                        src={product.image}
                                        alt={product.name}
                                        className="h-36 w-full p-4 transition-transform duration-300 group-hover:scale-[1.02]"
                                    />
                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="mb-3 flex items-center">
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    hasStock
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                }`}
                                            >
                                                {hasStock ? `${product.stock} en stock` : "Agotado"}
                                            </span>
                                        </div>

                                        <h2 className="min-h-12 text-base font-semibold leading-6 text-gray-900 dark:text-dark-primary">
                                            {product.name}
                                        </h2>
                                        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-dark-primary">
                                            {currencyFormatter.format(Number(product.price))}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {(paginationStock?.totalPages ?? 1) > 1 && (
                        <nav className="flex items-center justify-center gap-4" aria-label="Paginación del catálogo">
                            {(paginationStock?.page ?? 1) > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handlePageChange((paginationStock?.page ?? 1) - 1)}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-primary dark:hover:bg-dark-elevated"
                                    aria-label="Ver productos anteriores"
                                >
                                    <ChevronLeft size={18} />
                                    Anterior
                                </button>
                            )}
                            <span className="text-sm text-gray-600 dark:text-dark-secondary" aria-live="polite">
                                Página {paginationStock?.page ?? 1} de {paginationStock?.totalPages ?? 1}
                            </span>
                            {(paginationStock?.page ?? 1) < (paginationStock?.totalPages ?? 1) && (
                                <button
                                    type="button"
                                    onClick={() => handlePageChange((paginationStock?.page ?? 1) + 1)}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-primary dark:hover:bg-dark-elevated"
                                    aria-label="Ver más productos"
                                >
                                    Siguiente
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </nav>
                    )}
                </>
            )}

            <ModalFuturistic
                isOpen={selectedProduct !== null}
                onClose={() => setSelectedProduct(null)}
                title={selectedProduct?.name}
                className="max-w-4xl"
            >
                {selectedProduct && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <ProductImage
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="mx-auto aspect-square w-full max-w-[280px] rounded-xl"
                        />
                        <div className="flex flex-col">
                            <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                {selectedProduct.category || "Sin categoría"}
                            </span>
                            <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-dark-primary">
                                {currencyFormatter.format(Number(selectedProduct.price))}
                            </p>
                            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-dark-secondary">
                                {selectedProduct.description || "No hay una descripción disponible para este producto."}
                            </p>

                            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-5 text-sm dark:border-dark-border">
                                <div>
                                    <dt className="text-gray-500 dark:text-dark-muted">Disponibilidad</dt>
                                    <dd className={`mt-1 font-semibold ${Number(selectedProduct.stock) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                        {Number(selectedProduct.stock) > 0 ? `${selectedProduct.stock} en stock` : "Agotado"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-dark-muted">Unidad</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-dark-primary">
                                        {selectedProduct.unit_type || "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-dark-muted">SKU</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-dark-primary">
                                        {selectedProduct.sku || "—"}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-dark-muted">Vencimiento</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-dark-primary">
                                        {formatExpirationDate(selectedProduct.fecha_vencimiento)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}
            </ModalFuturistic>
        </div>
    );
};

export default StockAdministration;
