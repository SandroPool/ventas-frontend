import { useTicketsAdministration } from "../hooks/useTicketsAdministration";
import {
    ButtonFuturistic, ModalFuturistic, TitleFuturistic,
    TableFuturistic, InputFuturistic
} from "../components";
import { DockIcon, LoaderPinwheel, SaveAllIcon, Settings2Icon, RotateCcw, Eye, Receipt } from "lucide-react";
import generatePDF from "../utils/generatePDF";
import { formatDate } from "../utils/functionDate";

const TicketsAdministration = () => {
    const {
        sales, paginationSales, loadingSale, fetchSales,
        searchTerm, setSearchTerm,
        isConfigModalOpen, setIsConfigModalOpen,
        isSavingConfig,
        companyName, setCompanyName,
        setLogoFile,
        setLogoPreview,
        logoPreview,
        returnModalOpen, setReturnModalOpen,
        selectedSale,
        returnReason, setReturnReason,
        selectedProducts,
        returnLoading,
        saleReturns,
        returnsViewOpen, setReturnsViewOpen,
        saleDetailOpen, setSaleDetailOpen,
        handleSaveConfig,
        openReturnModal,
        handleFullCancel,
        updateReturnQty,
        handleConfirmReturn,
        viewReturns,
        viewSaleDetail,
    } = useTicketsAdministration();

    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gesti&oacute;n de Tickets</TitleFuturistic>

            <ButtonFuturistic
                gradient="bg-teal-500"
                icon={Settings2Icon}
                label="Configurar Boleta"
                onClick={() => setIsConfigModalOpen(true)}
            />

            <ModalFuturistic
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                title="Editar Boleta"
            >
                <InputFuturistic
                    label="Nombre: "
                    type="text"
                    placeholder="Nombre de la empresa"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <InputFuturistic
                    label="Logo: "
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setLogoFile(file);

                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setLogoPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                />
                {logoPreview && (
                    <div className="mt-2">
                        <p className="text-lg text-gray-700 dark:text-dark-primary mb-1">Imagen Actual:</p>
                        <img src={logoPreview} alt="Logo preview" className="h-auto object-contain border rounded p-2 bg-white" />
                    </div>
                )}
                <ButtonFuturistic
                    icon={isSavingConfig ? LoaderPinwheel : SaveAllIcon}
                    label={isSavingConfig ? "" : "Registrar"}
                    onClick={handleSaveConfig}
                    disabled={isSavingConfig}
                />
            </ModalFuturistic>

            <TableFuturistic
                columns={[
                    { key: "date", label: "Fecha", render: (value) => <span>{formatDate(value as string)}</span> },
                    { key: "customer", label: "Cliente", render: (_, row) => <span>{`${row.customer?.name || "N/A"} ${row.customer?.first_surname || ""} ${row.customer?.second_surname || ""}`}</span> },
                    { key: "payment_method", label: "M&eacute;todo de Pago" },
                    { key: "operation_number", label: "N&deg; Operaci&oacute;n" },
                    { key: "total", label: "Total (S/.)" },
                    { key: "status", label: "Estado", render: (value) => (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            value === "FULLY_RETURNED" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                            value === "PARTIALLY_RETURNED" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}>
                            {value === "FULLY_RETURNED" ? "Anulada" :
                             value === "PARTIALLY_RETURNED" ? "Dev. parcial" :
                             "Completada"}
                        </span>
                    )},
                ]}
                data={sales}
                currentPage={paginationSales?.page || 1}
                totalPages={paginationSales?.totalPages || 1}
                onPageChange={(page) => fetchSales(page, 10, searchTerm)}
                onSearch={(term) => {
                    setSearchTerm(term);
                    fetchSales(1, 10, term);
                }}
                actions={(sale) => (
                    <div className="flex gap-1">
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-teal-600 to-emerald-500"
                            icon={Receipt}
                            onClick={() => viewSaleDetail(sale)}
                        />
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-red-600 to-rose-500"
                            icon={DockIcon}
                            onClick={() => generatePDF(sale)}
                        />
                        {sale.status !== "FULLY_RETURNED" && (
                            <ButtonFuturistic
                                gradient="bg-gradient-to-r from-amber-500 to-orange-500"
                                icon={RotateCcw}
                                onClick={() => openReturnModal(sale)}
                            />
                        )}
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
                            icon={Eye}
                            onClick={() => viewReturns(sale)}
                        />
                    </div>
                )}
                loading={loadingSale}
            />

            <ModalFuturistic isOpen={returnModalOpen} onClose={() => setReturnModalOpen(false)} title="Registrar Devoluci&oacute;n" className="max-w-2xl">
                {selectedSale && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                                <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">Operaci&oacute;n</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-dark-primary mt-1">{selectedSale.operation_number}</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Total</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-dark-primary mt-1">S/ {selectedSale.total?.toFixed(2)}</p>
                            </div>
                        </div>

                        <ButtonFuturistic label="Anular toda la venta" icon={RotateCcw} onClick={handleFullCancel} gradient="bg-gradient-to-r from-red-500 to-rose-500" className="w-full" />

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-primary uppercase tracking-wider">Productos a devolver</h3>
                            </div>
                            <div className="space-y-2">
                                {selectedProducts.map((p, i) => (
                                    <div key={p.id_product} className="flex items-center gap-3 bg-gray-50 dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-dark-primary truncate">
                                                {(selectedSale.details?.[i]?.product?.name || "Producto")}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Disponible: {p.maxQty}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => updateReturnQty(i, Math.max(0, p.quantity - 1))}
                                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-elevated text-gray-600 dark:text-dark-primary font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                                            >
                                                &minus;
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-800 dark:text-dark-primary text-lg">{p.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateReturnQty(i, Math.min(p.maxQty, p.quantity + 1))}
                                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-elevated text-gray-600 dark:text-dark-primary font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 dark:text-dark-primary uppercase tracking-wider block mb-2">Motivo</label>
                            <textarea
                                placeholder="Describa el motivo de la devoluci&oacute;n..."
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-800 dark:text-dark-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            />
                        </div>

                        <ButtonFuturistic
                            label={returnLoading ? "" : "Confirmar Devoluci&oacute;n"}
                            icon={returnLoading ? LoaderPinwheel : RotateCcw}
                            onClick={handleConfirmReturn}
                            disabled={returnLoading}
                            className="w-full"
                            gradient="bg-gradient-to-r from-amber-500 to-orange-500"
                        />
                    </div>
                )}
            </ModalFuturistic>

            <ModalFuturistic isOpen={saleDetailOpen} onClose={() => setSaleDetailOpen(false)} title="" className="max-w-2xl">
                {selectedSale && (
                    <div className="-m-6">
                        <div className="bg-gray-800 dark:bg-gray-900 px-6 py-5 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-400 text-2xl font-bold tracking-wider uppercase">Boleta de Venta</p>
                                    <p className="text-gray-400 text-xs mt-1">{formatDate(selectedSale.date)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-teal-400 font-bold text-lg">{selectedSale.operation_number}</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                        selectedSale.status === "FULLY_RETURNED" ? "bg-red-500/20 text-red-400" :
                                        selectedSale.status === "PARTIALLY_RETURNED" ? "bg-yellow-500/20 text-yellow-400" :
                                        "bg-green-500/20 text-green-400"
                                    }`}>
                                        {selectedSale.status === "FULLY_RETURNED" ? "Anulada" :
                                         selectedSale.status === "PARTIALLY_RETURNED" ? "Dev. parcial" :
                                         "Completada"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pt-4 pb-3 border-b border-gray-200 dark:border-dark-border">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Emitido a</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-dark-primary mt-0.5">
                                        {selectedSale.customer?.name} {selectedSale.customer?.first_surname} {selectedSale.customer?.second_surname}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Pago</p>
                                    <p className="text-sm font-bold text-gray-800 dark:text-dark-primary mt-0.5">{selectedSale.payment_method}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-dark-border">
                                        <th className="text-left py-2 font-semibold uppercase text-xs tracking-wider">Producto</th>
                                        <th className="text-center py-2 font-semibold uppercase text-xs tracking-wider">Cant.</th>
                                        <th className="text-right py-2 font-semibold uppercase text-xs tracking-wider">P. Unit.</th>
                                        <th className="text-right py-2 font-semibold uppercase text-xs tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSale.details?.map((d: any, i: number) => (
                                        <tr key={i} className="border-b border-gray-100 dark:border-dark-border/50">
                                            <td className="py-2.5 text-gray-800 dark:text-dark-primary font-medium">{d.product?.name}</td>
                                            <td className="py-2.5 text-center text-gray-600 dark:text-gray-300">{d.quantity}</td>
                                            <td className="py-2.5 text-right text-gray-600 dark:text-gray-300">S/ {d.unit_price.toFixed(2)}</td>
                                            <td className="py-2.5 text-right font-semibold text-gray-800 dark:text-dark-primary">S/ {(d.quantity * d.unit_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-300 dark:border-dark-border">
                                        <td colSpan={3} className="py-3 text-right font-bold text-gray-700 dark:text-dark-primary uppercase tracking-wider text-sm">Total</td>
                                        <td className="py-3 text-right font-bold text-teal-600 dark:text-teal-400 text-lg">S/ {selectedSale.total?.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="px-6 pb-4 border-b border-gray-200 dark:border-dark-border">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                N&deg; Operaci&oacute;n: <span className="font-semibold text-gray-600 dark:text-gray-300">{selectedSale.operation_number}</span>
                            </p>
                        </div>

                        <div className="px-6 pt-4 pb-5 text-center">
                            <p className="text-xs text-gray-400">
                                Generado el {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                )}
            </ModalFuturistic>

            <ModalFuturistic isOpen={returnsViewOpen} onClose={() => setReturnsViewOpen(false)} title="" className="max-w-2xl">
                {selectedSale && (
                    <div className="-m-6">
                        <div className="bg-gray-800 dark:bg-gray-900 px-6 py-5 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-400 text-2xl font-bold tracking-wider uppercase">Devoluciones</p>
                                    <p className="text-gray-400 text-xs mt-1">Boleta de devoluci&oacute;n</p>
                                </div>
                                <p className="text-teal-400 font-bold text-lg">{selectedSale.operation_number}</p>
                            </div>
                        </div>

                        <div className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-dark-border">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Emitido a</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-dark-primary">
                                {selectedSale.customer?.name} {selectedSale.customer?.first_surname} {selectedSale.customer?.second_surname}
                            </p>
                        </div>

                        <div className="px-6 py-4 space-y-4">
                            {saleReturns.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 dark:text-gray-500">No hay devoluciones registradas</p>
                                </div>
                            ) : (
                                saleReturns.map((ret: any, idx: number) => (
                                    <div key={ret.id_return} className="border border-gray-200 dark:border-dark-border rounded-lg overflow-hidden">
                                        <div className="bg-gray-100 dark:bg-dark-card px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-dark-border">
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">#{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="font-semibold text-gray-700 dark:text-dark-primary">{ret.reason}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{ret.createdAt ? new Date(ret.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</p>
                                                <p className="text-sm font-bold text-red-500">- S/ {ret.total_amount?.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        {ret.details?.length > 0 && (
                                            <div className="px-4 py-2">
                                                <table className="w-full text-xs">
                                                    <thead>
                                                        <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-dark-border">
                                                            <th className="text-left py-1 font-medium">Producto</th>
                                                            <th className="text-center py-1 font-medium">Cant.</th>
                                                            <th className="text-right py-1 font-medium">P. Unit.</th>
                                                            <th className="text-right py-1 font-medium">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ret.details.map((d: any) => (
                                                            <tr key={d.id_return_detail} className="border-b border-gray-50 dark:border-dark-border/50">
                                                                <td className="py-1.5 text-gray-700 dark:text-dark-primary">{d.product?.name}</td>
                                                                <td className="py-1.5 text-center text-gray-600 dark:text-gray-300">{d.quantity}</td>
                                                                <td className="py-1.5 text-right text-gray-600 dark:text-gray-300">S/ {d.unit_price.toFixed(2)}</td>
                                                                <td className="py-1.5 text-right font-semibold text-gray-700 dark:text-dark-primary">S/ {(d.quantity * d.unit_price).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {saleReturns.length > 0 && (
                            <div className="px-6 pb-4 pt-2 border-t border-gray-200 dark:border-dark-border text-center">
                                <p className="text-xs text-gray-400">
                                    Generado el {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </ModalFuturistic>
        </div>
    );
};

export default TicketsAdministration;
