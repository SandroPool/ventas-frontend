import { FC, JSX, useState } from "react";
import { useStockAdministration } from "../hooks/useStockAdministration";
import { TitleFuturistic, TableFuturistic } from "../components";

const StockAdministration: FC = (): JSX.Element => {
    const { stock, paginationStock, loading, fetchStock } = useStockAdministration();
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="px-4 lg:px-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Búsqueda de Stock</TitleFuturistic>

            <TableFuturistic
                columns={[
                    { key: "name", label: "Producto" },
                    { key: "stock", label: "Stock" },
                    { key: "price", label: "Precio" },
                    { key: "unit_type", label: "Unidad" },
                    { key: "category", label: "Categoría" },
                    { key: "sku", label: "SKU" },
                ]}
                data={stock}
                currentPage={paginationStock?.page || 1}
                totalPages={paginationStock?.totalPages || 1}
                pageSize={pageSize}
                onPageChange={(page) => fetchStock(page, pageSize, searchTerm)}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    fetchStock(1, size, searchTerm);
                }}
                onSearch={(term) => {
                    setSearchTerm(term);
                    fetchStock(1, pageSize, term);
                }}
                loading={loading}
            />
        </div>
    );
};

export default StockAdministration;
