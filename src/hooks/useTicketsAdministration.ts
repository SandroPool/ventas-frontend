import { useEffect, useRef, useState } from "react";
import { useSalesStore } from "../store/useSalesStore";
import { useAuthStore } from "../store/useAuthStore";
import { getCompanyLogo, getCompanyName, saveCompanyLogo, saveCompanyName } from "../utils/companyConfig";
import toast from "react-hot-toast";
import { createReturn, getReturnsBySale } from "../services/return.service";

const readImageAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result === "string") {
            resolve(reader.result);
        } else {
            reject(new Error("No se pudo leer el archivo de imagen"));
        }
    };
    reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el archivo de imagen"));
    reader.readAsDataURL(file);
});

export const useTicketsAdministration = () => {
    const { sales, paginationSales, loadingSale, fetchSales } = useSalesStore();
    const { user } = useAuthStore();
    const hasLoadedSales = useRef(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [returnReason, setReturnReason] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<{ id_product: number; quantity: number; unit_price: number; maxQty: number }[]>([]);
    const [returnLoading, setReturnLoading] = useState(false);
    const [saleReturns, setSaleReturns] = useState<any[]>([]);
    const [returnsViewOpen, setReturnsViewOpen] = useState(false);
    const [saleDetailOpen, setSaleDetailOpen] = useState(false);

    const handleSaveConfig = async () => {
        setIsSavingConfig(true);
        try {
            const logoBase64 = logoFile ? await readImageAsDataUrl(logoFile) : null;
            await saveCompanyName(companyName);
            if (logoBase64) {
                await saveCompanyLogo(logoBase64);
                setLogoPreview(logoBase64);
            }
            setLogoFile(null);
            setIsConfigModalOpen(false);
            toast.success("Boleta actualizada con éxito");
        } catch (error) {
            console.error("Error al guardar la configuración de la boleta:", error);
            toast.error(error instanceof Error ? error.message : "No se pudo guardar la configuración de la boleta");
        } finally {
            setIsSavingConfig(false);
        }
    };

    useEffect(() => {
        if (!isConfigModalOpen) return;

        let isCurrent = true;
        const loadCompanyConfig = async () => {
            try {
                const [savedCompanyName, savedLogo] = await Promise.all([
                    getCompanyName(),
                    getCompanyLogo(),
                ]);
                if (!isCurrent) return;
                setCompanyName(savedCompanyName);
                setLogoPreview(savedLogo || null);
                setLogoFile(null);
            } catch (error) {
                console.error("Error al cargar la configuración de la boleta:", error);
                if (isCurrent) {
                    toast.error("No se pudo cargar la configuración de la boleta");
                }
            }
        };

        void loadCompanyConfig();
        return () => {
            isCurrent = false;
        };
    }, [isConfigModalOpen]);

    useEffect(() => {
        if (!hasLoadedSales.current) {
            hasLoadedSales.current = true;
            fetchSales();
        }
    }, [fetchSales]);

    const openReturnModal = (sale: any) => {
        setSelectedSale(sale);
        setReturnReason("");
        setSelectedProducts(
            (sale.details || []).map((d: any) => ({
                id_product: d.product?.id_product || d.id_product,
                quantity: 0,
                unit_price: d.unit_price,
                maxQty: d.quantity,
            }))
        );
        setReturnModalOpen(true);
    };

    const handleFullCancel = () => {
        setSelectedProducts(prev =>
            prev.map(p => ({ ...p, quantity: p.maxQty }))
        );
    };

    const updateReturnQty = (index: number, value: number) => {
        setSelectedProducts(prev =>
            prev.map((p, i) =>
                i === index ? { ...p, quantity: Math.max(0, Math.min(value, p.maxQty)) } : p
            )
        );
    };

    const handleConfirmReturn = async () => {
        if (!returnReason.trim()) {
            toast.error("Debe ingresar un motivo de devolución");
            return;
        }
        const details = selectedProducts.filter(p => p.quantity > 0);
        if (details.length === 0) {
            toast.error("Debe seleccionar al menos un producto");
            return;
        }

        setReturnLoading(true);
        const result = await createReturn({
            id_sale: selectedSale.id_sale,
            id_user: user?.id_user || 0,
            reason: returnReason,
            details: details.map(d => ({
                id_product: d.id_product,
                quantity: d.quantity,
                unit_price: d.unit_price,
            })),
        });
        setReturnLoading(false);

        if (result) {
            toast.success("Devolución registrada con éxito");
            setReturnModalOpen(false);
            fetchSales(paginationSales?.page ?? 1, paginationSales?.limit ?? 10, searchTerm, dateFrom, dateTo);
        } else {
            toast.error("Error al registrar devolución");
        }
    };

    const viewReturns = async (sale: any) => {
        const returns = await getReturnsBySale(sale.id_sale);
        setSaleReturns(returns || []);
        setSelectedSale(sale);
        setReturnsViewOpen(true);
    };

    const viewSaleDetail = (sale: any) => {
        setSelectedSale(sale);
        setSaleDetailOpen(true);
    };

    return {
        sales, paginationSales, loadingSale, fetchSales,
        searchTerm, setSearchTerm,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
        isConfigModalOpen, setIsConfigModalOpen,
        isSavingConfig,
        companyName, setCompanyName,
        logoFile, setLogoFile,
        logoPreview, setLogoPreview,
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
    };
};
