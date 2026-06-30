import { useEffect, useState } from "react";
import { useSalesStore } from "../store/useSalesStore";
import { useAuthStore } from "../store/useAuthStore";
import { getCompanyLogo, saveCompanyLogo, saveCompanyName } from "../utils/companyConfig";
import toast from "react-hot-toast";
import { createReturn, getReturnsBySale } from "../services/return.service";

export const useTicketsAdministration = () => {
    const { sales, paginationSales, loadingSale, fetchSales } = useSalesStore();
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState("");
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
        if (companyName) await saveCompanyName(companyName);

        if (logoFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                await saveCompanyLogo(base64String);
                setIsConfigModalOpen(false);
                toast.success("Boleta actualizada con éxito");
                setIsSavingConfig(false);
            };
            reader.onerror = () => {
                toast.error("Error al leer el archivo");
                setIsSavingConfig(false);
            };
            reader.readAsDataURL(logoFile);
        } else {
            setIsConfigModalOpen(false);
            toast.success("Boleta actualizada con éxito");
            setIsSavingConfig(false);
        }
    };

    useEffect(() => {
        if (isConfigModalOpen) {
            getCompanyLogo().then(setLogoPreview);
        }
    }, [isConfigModalOpen]);

    useEffect(() => {
        if (sales.length === 0) fetchSales();
    }, [fetchSales, sales.length]);

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
            fetchSales();
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
