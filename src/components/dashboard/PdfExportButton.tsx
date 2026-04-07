"use client";

import { useState, useRef, useCallback } from "react";

interface Props {
  captureRef: React.RefObject<HTMLDivElement | null>;
}

export default function PdfExportButton({ captureRef }: Props) {
  const [exporting, setExporting] = useState(false);
  const abortRef = useRef(false);

  const handleExport = useCallback(async () => {
    if (!captureRef.current || exporting) return;
    setExporting(true);
    abortRef.current = false;

    try {
      const [html2canvasModule, jspdfModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const html2canvas = html2canvasModule.default;
      const jsPDF = jspdfModule.jsPDF;

      const el = captureRef.current;
      el.classList.add("pdf-capture");

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#FFFFFF",
        useCORS: true,
        logging: false,
      });

      el.classList.remove("pdf-capture");

      if (abortRef.current) return;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      let margin = 8;
      let contentWidth = pdfWidth - margin * 2;

      const ratio = contentWidth / canvas.width;
      let contentHeight = canvas.height * ratio;

      if (contentHeight > pdfHeight - margin * 2) {
        const scaleDown = (pdfHeight - margin * 2) / contentHeight;
        contentWidth *= scaleDown;
        contentHeight *= scaleDown;
        margin = (pdfWidth - contentWidth) / 2;
      }

      const yOffset = (pdfHeight - contentHeight) / 2;
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        margin,
        yOffset,
        contentWidth,
        contentHeight
      );

      const dateStr = new Date().toISOString().split("T")[0];
      pdf.save(`calibrate-dashboard-${dateStr}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Gagal generate PDF. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  }, [captureRef, exporting]);

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-6 py-2.5 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {exporting ? "Generating PDF..." : "Download PDF Dashboard"}
    </button>
  );
}
