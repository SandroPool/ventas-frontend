import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale } from "../services/sales.service";
import { formatDate } from "./functionDate";
import { getCompanyLogo, getCompanyName } from "./companyConfig";

const generatePDF = async (sale: Sale) => {
    const doc: jsPDF = new jsPDF();
    const name = await getCompanyName();
    const logoBase64 = await getCompanyLogo();

    const pageWidth: number = doc.internal.pageSize.width;
    const headerHeight: number = 60;

    // Header with gradient-like effect
    doc.setFillColor(40, 44, 52);
    doc.rect(0, 0, pageWidth, headerHeight, "F");
    doc.setFillColor(0, 200, 255);
    doc.rect(0, headerHeight - 3, pageWidth, 3, "F");

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 15, 10, 30, 30);
    } else {
        doc.setDrawColor(0);
        doc.rect(15, 10, 30, 30);
        doc.setFontSize(8);
        doc.text('Logo de la empresa', 30, 27, { align: 'center' });
    }
    doc.setTextColor(0, 200, 255);
    doc.text(name || "Nombre Empresa", 70, 35);

    // Invoice Details
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("BOLETA", pageWidth - 15, 25, { align: "right" });
    doc.setFontSize(12);
    doc.text(`Fecha: ${formatDate(sale.date)}`, pageWidth - 15, 45, { align: "right" });

    // Customer Info
    doc.setTextColor(40, 44, 52);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("EMITIDO A", 15, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`${sale.customer?.name || "N/A"}, ${sale.customer?.first_surname || ""} ${sale.customer?.second_surname || ""}`, 15, 88);

    // Items Table
    autoTable(doc, {
        startY: 100,
        head: [["Producto", "Cantidad", "Precio Unitario", "Total"]],
        body: sale.details.map((detail) => [
            detail.product?.name || "Producto desconocido",
            detail?.quantity,
            `S/. ${detail.unit_price.toFixed(2)}`,
            `S/. ${(detail.quantity * detail.unit_price).toFixed(2)}`
        ]),
        foot: [[
            {
                content: "Total:",
                colSpan: 3,
                styles: {
                    halign: "right",
                    fillColor: [40, 44, 52],
                    textColor: [255, 255, 255],
                    fontSize: 11,
                    fontStyle: "bold"
                }
            },
            {
                content: `S/. ${sale.total?.toFixed(2) || "0.00"}`,
                styles: {
                    fillColor: [40, 44, 52],
                    textColor: [255, 255, 255],
                    fontSize: 11,
                    fontStyle: "bold"
                }
            }
        ]],
        theme: "grid",
        headStyles: {
            fillColor: [40, 44, 52],
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold"
        },
        bodyStyles: {
            fontSize: 10,
            cellPadding: 5
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: 25, halign: "center" },
            2: { cellWidth: 35, halign: "right" },
            3: { cellWidth: 35, halign: "right" }
        },
        styles: {
            font: "helvetica",
            lineColor: [218, 220, 224],
            lineWidth: 0.5,
        },
        margin: { top: 15, right: 15, bottom: 15, left: 15 }
    });

    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text(
        `Generado el ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
    );

    // Save the PDF
    doc.save(`BOLETA_${sale.id_sale}.pdf`);
};

export default generatePDF;