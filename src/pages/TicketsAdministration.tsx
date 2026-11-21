import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTicketsAdministration } from "../hooks/useTicketsAdministration";
import {
    ButtonFuturistic, ModalFuturistic, TitleFuturistic,
    TableFuturistic, InputFuturistic, ImageUpload, DateRangePicker
} from "../components";
import { Download, DockIcon, LoaderPinwheel, SaveAllIcon, Settings2Icon, RotateCcw, Eye, CircleX } from "lucide-react";
import generatePDF from "../utils/generatePDF";
import { formatDate } from "../utils/functionDate";
import type { Sale } from "../services/sales.service";

const getPDFFileName = (sale: Sale) => {
    const customerName = [
        sale.customer?.name,
        sale.customer?.first_surname,
        sale.customer?.second_surname,
    ]
        .filter((name) => name?.trim())
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();

    return `NOTA_DE_VENTA_${customerName || "SIN_CLIENTE"}.pdf`;
};

const TicketsAdministration = () => {
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [pdfPreviewSale, setPdfPreviewSale] = useState<Sale | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const {
        sales, paginationSales, loadingSale, fetchSales,
        searchTerm, setSearchTerm,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        isConfigModalOpen, setIsConfigModalOpen,
        isSavingConfig,
        companyName, setCompanyName,
        logoFile, setLogoFile,
        logoPreview,
        returnModalOpen, setReturnModalOpen,
        selectedSale,
        returnReason, setReturnReason,
        selectedProducts,
        returnLoading,
        saleReturns,
        returnsViewOpen, setReturnsViewOpen,
        handleSaveConfig,
        openReturnModal,
        handleFullCancel,
        updateReturnQty,
        handleConfirmReturn,
        viewReturns,
    } = useTicketsAdministration();
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        return () => {
            if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        };
    }, [pdfPreviewUrl]);

    const handlePreviewPDF = async (sale: Sale) => {
        setIsGeneratingPdf(true);
        try {
            const pdfBlob = await generatePDF(sale);
            setPdfPreviewUrl(URL.createObjectURL(pdfBlob));
            setPdfPreviewSale(sale);
        } catch (error) {
            console.error("Error al generar la vista previa de la nota de venta:", error);
            toast.error("No se pudo generar la vista previa de la nota de venta");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="lg:pr-10 lg:pl-10 lg:pt-5 space-y-8">
            <TitleFuturistic as="h1">Gestión de Notas de Venta</TitleFuturistic>

            <ButtonFuturistic
                gradient="bg-teal-500"
                icon={Settings2Icon}
                label="Configurar Nota de Venta"
                onClick={() => setIsConfigModalOpen(true)}
            />

            <div className="lg:w-3/4 w-full">
            <ModalFuturistic
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                title="Editar Nota de Venta"
                closeButtonVariant="circle"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <InputFuturistic
                            label="Nombre: "
                            type="text"
                            placeholder="Nombre de la empresa"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <ImageUpload
                        label="Logo de la empresa"
                        selectedFile={logoFile}
                        onChange={setLogoFile}
                        existingImage={logoPreview}
                    />
                    <div className="md:col-span-2 flex justify-start gap-3">
                        <ButtonFuturistic
                            label="Cancelar"
                            gradient="bg-red-500"
                            icon={CircleX}
                            className="m-0"
                            onClick={() => setIsConfigModalOpen(false)}
                        />
                        <ButtonFuturistic
                            icon={isSavingConfig ? LoaderPinwheel : SaveAllIcon}
                            label={isSavingConfig ? "" : "Registrar"}
                            onClick={handleSaveConfig}
                            disabled={isSavingConfig}
                            className="m-0"
                        />
                    </div>
                </div>
            </ModalFuturistic>
            </div>

            <section
                aria-label="Resumen de notas de venta"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
                <article className="rounded-xl border border-teal-100 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-secondary">Notas de venta encontradas</p>
                    <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-dark-primary">
                        {loadingSale ? "..." : (paginationSales?.total ?? 0)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-dark-muted">Según la búsqueda actual</p>
                </article>
                <article className="rounded-xl border border-teal-100 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card">
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-secondary">Venta bruta visible</p>
                    <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-dark-primary">
                        {loadingSale ? "..." : `S/ ${sales.reduce((sum, sale) => sum + (sale.total ?? 0), 0).toFixed(2)}`}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-dark-muted">
                        Suma de las {sales.length} notas de venta de esta página
                    </p>
                </article>
            </section>

            <TableFuturistic
                columns={[
                    { key: "date", label: "Fecha", render: (value) => <span>{formatDate(value as string)}</span> },
                    { key: "customer", label: "Cliente", render: (_, row) => <span>{`${row.customer?.name || "N/A"} ${row.customer?.first_surname || ""} ${row.customer?.second_surname || ""}`}</span> },
                    { key: "payment_method", label: "Método de Pago" },
                    { key: "operation_number", label: "N° de Operación" },
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
                pageSize={pageSize}
                onPageChange={(page) => fetchSales(page, pageSize, searchTerm, dateFrom, dateTo)}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    fetchSales(1, size, searchTerm, dateFrom, dateTo);
                }}
                onSearch={(term) => {
                    setSearchTerm(term);
                    fetchSales(1, pageSize, term, dateFrom, dateTo);
                }}
                toolbarContent={
                    <DateRangePicker
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onRangeSelect={(from, to) => {
                            setDateFrom(from);
                            setDateTo(to);
                            fetchSales(1, pageSize, searchTerm, from, to);
                        }}
                        onClear={() => {
                            setDateFrom("");
                            setDateTo("");
                            fetchSales(1, pageSize, searchTerm, "", "");
                        }}
                    />
                }
                actions={(sale) => (
                    <div className="flex gap-1">
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-red-600 to-rose-500"
                            icon={isGeneratingPdf ? LoaderPinwheel : DockIcon}
                            label={isGeneratingPdf ? "Generando..." : "Previsualizar"}
                            title="Previsualizar nota de venta en PDF"
                            aria-label="Previsualizar nota de venta en PDF"
                            className="!m-0 !px-2 !py-2 text-xs"
                            disabled={isGeneratingPdf}
                            onClick={() => handlePreviewPDF(sale)}
                        />
                        {sale.status !== "FULLY_RETURNED" && (
                            <ButtonFuturistic
                                gradient="bg-gradient-to-r from-amber-500 to-orange-500"
                                icon={RotateCcw}
                                label="Devolver"
                                title="Registrar devolución"
                                aria-label="Registrar devolución"
                                className="!m-0 !px-2 !py-2 text-xs"
                                onClick={() => openReturnModal(sale)}
                            />
                        )}
                        <ButtonFuturistic
                            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
                            icon={Eye}
                            label="Historial"
                            title="Ver devoluciones registradas"
                            aria-label="Ver devoluciones registradas"
                            className="!m-0 !px-2 !py-2 text-xs"
                            onClick={() => viewReturns(sale)}
                        />
                    </div>
                )}
                loading={loadingSale}
                emptyStateText="No hay notas de venta para mostrar."
                searchEmptyStateText="No existe la nota de venta buscada."
            />

            <div className="lg:w-3/4 w-full">

            <ModalFuturistic
                isOpen={Boolean(pdfPreviewUrl && pdfPreviewSale)}
                onClose={() => {
                    setPdfPreviewUrl(null);
                    setPdfPreviewSale(null);
                }}
                headerless
                className="!max-w-5xl"
            >
                {pdfPreviewUrl && pdfPreviewSale && (
                    <div>
                        <iframe
                            src={pdfPreviewUrl}
                            title={`Vista previa PDF de la nota de venta ${pdfPreviewSale.operation_number}`}
                            className="h-[65vh] w-full border-0 bg-white"
                        />
                        <div className="flex justify-end p-4">
                            <a
                                href={pdfPreviewUrl}
                                download={getPDFFileName(pdfPreviewSale)}
                                aria-label={`Descargar ${getPDFFileName(pdfPreviewSale)}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                            >
                                <Download size={18} aria-hidden="true" />
                                Descargar
                            </a>
                        </div>
                    </div>
                )}
            </ModalFuturistic>
            </div>

            <div className="lg:w-3/4 w-full">
            <ModalFuturistic isOpen={returnModalOpen} onClose={() => setReturnModalOpen(false)} title="Registrar Devoluciones" className="max-w-2xl" closeButtonVariant="circle">
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
                            label={returnLoading ? "" : "Confirmar Devolución"}
                            icon={returnLoading ? LoaderPinwheel : RotateCcw}
                            onClick={handleConfirmReturn}
                            disabled={returnLoading}
                            className="w-full"
                            gradient="bg-gradient-to-r from-amber-500 to-orange-500"
                        />
                    </div>
                )}
            </ModalFuturistic>
            </div>

            <div className="lg:w-3/4 w-full">
            <ModalFuturistic isOpen={returnsViewOpen} onClose={() => setReturnsViewOpen(false)} title="" closeButtonVariant="circle" className="max-w-2xl">
                {selectedSale && (
                    <div className="-m-6">
                        <div className="bg-gray-800 dark:bg-gray-900 px-6 pr-14 py-5 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-teal-400 text-2xl font-bold tracking-wider uppercase">Devoluciones</p>
                                    <p className="text-gray-400 text-xs mt-1">Devoluci&oacute;n de nota de venta</p>
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
        </div>
    );
};

export default TicketsAdministration;
