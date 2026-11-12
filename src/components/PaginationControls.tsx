import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const PaginationControls = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: PaginationControlsProps) => {
    const generatePagination = () => {
        const pages: (number | "...")[] = [];
        const showEllipsis = totalPages > 2;
        const leftEllipsis = currentPage > 2;
        const rightEllipsis = currentPage < totalPages - 1;

        if (showEllipsis) {
            pages.push(1);
            if (leftEllipsis) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let page = start; page <= end; page++) pages.push(page);
            if (rightEllipsis) pages.push("...");
            pages.push(totalPages);
        } else {
            for (let page = 1; page <= totalPages; page++) pages.push(page);
        }

        return pages;
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-200 p-3 transition-colors dark:bg-dark-card sm:p-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-dark-secondary sm:text-sm">
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

            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Página anterior"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
                        currentPage <= 1 ? "cursor-not-allowed opacity-50" : "transition-colors hover:bg-gray-300 dark:hover:bg-dark-card"
                    }`}
                >
                    <ChevronLeft size={16} />
                </button>

                {generatePagination().map((page, index) => (
                    <button
                        key={`${page}-${index}`}
                        type="button"
                        onClick={() => typeof page === "number" && onPageChange(page)}
                        disabled={page === "..."}
                        aria-current={currentPage === page ? "page" : undefined}
                        aria-label={typeof page === "number" ? `Ir a la página ${page}` : undefined}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors sm:h-10 sm:w-10 sm:text-sm ${
                            currentPage === page
                                ? "bg-teal-500 text-white"
                                : page === "..."
                                    ? "cursor-default"
                                    : "hover:bg-gray-300 dark:hover:bg-dark-card"
                        }`}
                    >
                        {page === "..." ? <MoreHorizontal size={16} /> : page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Página siguiente"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
                        currentPage >= totalPages ? "cursor-not-allowed opacity-50" : "transition-colors hover:bg-gray-300 dark:hover:bg-dark-card"
                    }`}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
