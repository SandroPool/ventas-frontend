import { JSX, useState, useEffect, useRef, useMemo } from "react";
import {
    ChevronLeft, ChevronRight, MoreHorizontal,
    LoaderPinwheel, ArchiveX, Search, CircleX, ImageOff, X, ArrowUp, ArrowDown, ArrowUpDown
} from "lucide-react";
import TruncatedText from "./TruncatedText";

export interface Column<T> {
    key: keyof T;
    label: string;
    icon?: JSX.Element;
    type?: "image";
    sortable?: boolean;
    sortValue?: (row: T) => string | number | Date | null | undefined;
    render?: (value: T[keyof T], row: T) => JSX.Element;
}

type SortDirection = "asc" | "desc";

const sortCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

const ImageCell = ({ src }: { src: string | null }) => {
    const [failed, setFailed] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomVisible, setZoomVisible] = useState(false);
    const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    useEffect(() => () => {
        if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }, []);

    useEffect(() => {
        if (!isZoomed) return;

        const frame = requestAnimationFrame(() => setZoomVisible(true));
        return () => cancelAnimationFrame(frame);
    }, [isZoomed]);

    const closeZoom = () => {
        setZoomVisible(false);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => setIsZoomed(false), 300);
    };

    useEffect(() => {
        if (!isZoomed) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeZoom();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isZoomed, zoomVisible]);

    if (!src || failed) {
        return (
            <div
                className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-dark-elevated dark:text-dark-muted"
                title="Sin imagen"
                aria-label="Sin imagen"
            >
                <ImageOff size={20} />
            </div>
        );
    }

    const imageUrl = new URL(src, import.meta.env.VITE_BASE_URL).toString();

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
                    zoomTimeoutRef.current = setTimeout(() => setIsZoomed(true), 200);
                }}
                className="cursor-zoom-in rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Ampliar imagen del producto"
            >
                <img
                    src={imageUrl}
                    alt="Imagen del producto"
                    loading="lazy"
                    className="h-12 w-12 rounded-md object-cover"
                    onError={() => setFailed(true)}
                />
            </button>
            {isZoomed && (
                <div
                    className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-300 ${zoomVisible ? "opacity-100" : "opacity-0"}`}
                    role="presentation"
                    onClick={closeZoom}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Imagen ampliada del producto"
                        className={`relative transition-transform duration-300 ease-out ${zoomVisible ? "scale-100" : "scale-[0.08]"}`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeZoom}
                            className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-2 text-gray-800 shadow-lg hover:bg-gray-100"
                            aria-label="Cerrar imagen ampliada"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={imageUrl}
                            alt="Imagen ampliada del producto"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

interface PropsTable<T> {
    columns: Column<T>[];
    data: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onSearch?: (searchTerm: string) => void;
    actions?: (row: T) => JSX.Element;
    loading?: boolean;
}

const TableFuturistic = <T,>({ columns, data, currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, onSearch, actions, loading }: PropsTable<T>) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: SortDirection } | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        const column = columns.find(({ key }) => key === sortConfig.key);
        if (!column || column.sortable === false || column.type === "image") return data;

        return data
            .map((row, index) => ({ row, index }))
            .sort((a, b) => {
                const left = column.sortValue ? column.sortValue(a.row) : a.row[column.key];
                const right = column.sortValue ? column.sortValue(b.row) : b.row[column.key];

                if (left == null || right == null) {
                    if (left == null && right == null) return a.index - b.index;
                    return left == null ? 1 : -1;
                }

                const comparison = typeof left === "number" && typeof right === "number"
                    ? left - right
                    : left instanceof Date && right instanceof Date
                        ? left.getTime() - right.getTime()
                        : sortCollator.compare(String(left), String(right));

                return (sortConfig.direction === "asc" ? comparison : -comparison) || a.index - b.index;
            })
            .map(({ row }) => row);
    }, [columns, data, sortConfig]);

    const toggleSort = (key: keyof T) => {
        setSortConfig((current) => ({
            key,
            direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    useEffect(() => {
        if (!onSearchRef.current) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearchRef.current?.(searchTerm);
        }, 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearchRef.current?.(searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm("");
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearchRef.current?.("");
    };

    const generatePagination = () => {
        const pages = [];
        const showEllipsis = totalPages > 2;
        const leftEllipsis = currentPage > 2;
        const rightEllipsis = currentPage < totalPages - 1;

        if (showEllipsis) {
            pages.push(1); // Primera página
            if (leftEllipsis) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (rightEllipsis) pages.push("...");
            pages.push(totalPages); // Última página
        } else {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white text-gray-900 dark:bg-dark-base dark:text-dark-primary transition-colors">
            {/* 🔍 Barra de búsqueda */}
            <div className="pt-2 pb-2 border-b border-gray-300 dark:border-dark-border">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-dark-muted dark:hover:text-dark-primary"
                            >
                                <CircleX size={18} />
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="p-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                    >
                        <Search size={18} />
                    </button>
                </form>
            </div>

            {/* Tabla */}
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                    <thead className="bg-gradient-to-r bg-teal-500 text-white dark:bg-dark-elevated">
                        <tr>
                            {columns.map(({ key, label, icon, sortable, type }, colIndex) => {
                                const isSortable = sortable !== false && type !== "image";
                                const isSorted = sortConfig?.key === key;
                                const SortIcon = !isSorted ? ArrowUpDown : sortConfig.direction === "asc" ? ArrowUp : ArrowDown;

                                return (
                                <th
                                    key={`${String(key)}-${colIndex}`}
                                    className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm"
                                    aria-sort={isSorted ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                                >
                                    {isSortable ? (
                                        <button
                                            type="button"
                                            onClick={() => toggleSort(key)}
                                            className="flex items-center gap-1 sm:gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                            aria-label={`Ordenar por ${label}${isSorted ? (sortConfig.direction === "asc" ? ", ascendente" : ", descendente") : ""}`}
                                        >
                                            {icon}
                                            {label}
                                            <SortIcon size={14} aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            {icon}
                                            {label}
                                        </div>
                                    )}
                                </th>
                                );
                            })}
                            {actions && <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold">Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                                    <div className="flex justify-center items-center">
                                        <LoaderPinwheel size={30} className=" text-gray-500 dark:text-dark-muted animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? ( // Si no hay datos
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <ArchiveX size={30} className="text-gray-500 dark:text-dark-muted" />
                                        <span className="text-gray-500 dark:text-dark-muted">No encontrado</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // Si hay datos, renderizar las filas
                            sortedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border-b border-gray-300 transition-colors hover:bg-gray-200 dark:border-dark-border dark:hover:bg-dark-elevated"
                                >
                                    {columns.map(({ key, render, type }, colIndex) => (
                                        <td key={`${String(key)}-${colIndex}`} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                            {render
                                                ? render(row[key], row)
                                                : type === "image"
                                                    ? <ImageCell key={String(row[key] ?? "")} src={typeof row[key] === "string" ? String(row[key]) : null} />
                                                : typeof row[key] === "number"
                                                    ? row[key]
                                                    : typeof row[key] === "string" && row[key].length > 50
                                                        ? <TruncatedText text={row[key]} />
                                                        : row[key] ? String(row[key]) : "N/A"}
                                        </td>
                                    ))}
                                    {actions && <td className="px-2 sm:px-4 py-2 sm:py-3 flex gap-2">{actions(row)}</td>}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🔹 Paginación optimizada */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-gray-200 dark:bg-dark-card transition-colors">
                <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-dark-secondary">
                    Filas por página
                    <select
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-dark-border dark:bg-dark-elevated dark:text-dark-primary"
                        aria-label="Filas por página"
                    >
                        {[10, 20, 25, 50].map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </label>

                <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg
                    ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-dark-card transition-colors"}`}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {generatePagination().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === "number" && onPageChange(page)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-xs sm:text-sm
                        ${currentPage === page ? "bg-teal-500 text-white" : "hover:bg-gray-300 dark:hover:bg-dark-card transition-colors"}`}
                        >
                            {page === "..." ? <MoreHorizontal size={16} /> : page}
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg
                    ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-dark-card transition-colors"}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableFuturistic;