import { FC, JSX } from "react";
import { useStockAdministration } from "../hooks/useStockAdministration";
import { TitleFuturistic, TableFuturistic } from "../components";

const StockAdministration: FC = (): JSX.Element => {
    const { stock, paginationStock, loading, fetchStock } = useStockAdministration();

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
                onPageChange={(page) => fetchStock(page, 10)}
                onSearch={(term) => fetchStock(1, 10, term)}
                loading={loading}
            />
        </div>
    );
};

export default StockAdministration;
