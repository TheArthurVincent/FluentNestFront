import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import jsPDF from "jspdf";

type PdfType = "entradas" | "saidas" | "both";

export type FinancialReportItem = {
  description?: string;
  paidSoFar?: number | string;
  amount?: number | string;
  discount?: number | string;
  typeOfItem?: string; // "debt" ou outros
  accountFor?: boolean;
};

type Props = {
  selectedMonth: string; // ex: "10-2025" (ou o que você estiver exibindo)
  studentName?: string;
  financialReports: FinancialReportItem[];
  formatNumber: (value: any) => string;

  buttonLabel?: string;
  ignoreUnaccounted?: boolean; // default true -> respeita accountFor
};

export default function FinancialPdfButton({
  selectedMonth,
  studentName = "",
  financialReports,
  formatNumber,
  buttonLabel = `Exportar Relatório`,
  ignoreUnaccounted = true,
}: Props) {
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfType, setPDFType] = useState<PdfType>("both");

  const safeReports = useMemo(
    () => (Array.isArray(financialReports) ? financialReports : []),
    [financialReports],
  );

  const toNumber = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const shouldInclude = (item: FinancialReportItem) => {
    if (!ignoreUnaccounted) return true;
    return item.accountFor !== false; // default true/undefined => inclui
  };

  const entradas = useMemo(() => {
    return safeReports.filter(
      (item) =>
        shouldInclude(item) &&
        toNumber(item.paidSoFar) > 0 &&
        item.typeOfItem !== "debt",
    );
  }, [safeReports, ignoreUnaccounted]);

  const saidas = useMemo(() => {
    return safeReports.filter(
      (item) =>
        shouldInclude(item) &&
        toNumber(item.paidSoFar) > 0 &&
        item.typeOfItem === "debt",
    );
  }, [safeReports, ignoreUnaccounted]);

  const filtered = useMemo(() => {
    if (pdfType === "entradas") return entradas;
    if (pdfType === "saidas") return saidas;
    return [...entradas, ...saidas];
  }, [pdfType, entradas, saidas]);

  const generatePDFReport = () => {
    const pdf = new jsPDF();
    const margin = 20;
    const maxWidth = pdf.internal.pageSize.width - 2 * margin;
    const pageHeight = pdf.internal.pageSize.height;

    let yPosition = 20;

    const header = (title: string, subtitle?: string) => {
      pdf.setFontSize(18);
      pdf.text(title, margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(12);
      if (subtitle) {
        pdf.text(subtitle, margin, yPosition);
        yPosition += 10;
      } else {
        yPosition += 6;
      }

      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, maxWidth + margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.text("Descrição", margin, yPosition);
      pdf.text("Valor", margin + 100, yPosition);
      yPosition += 8;

      pdf.setLineWidth(0.2);
      pdf.line(margin, yPosition, maxWidth + margin, yPosition);
      yPosition += 6;
    };

    const addRow = (desc: string, val: string) => {
      pdf.setFontSize(10);
      pdf.text(String(desc || "-"), margin, yPosition);
      pdf.text(String(val || "-"), margin + 100, yPosition);
      yPosition += 8;

      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    let totalEntradas = 0;
    let totalSaidas = 0;

    header(
      `Relatório Financeiro - ${selectedMonth}`,
      `Tipo: ${labelPdfType(pdfType)} | Simples`,
    );

    if (pdfType === "entradas") {
      entradas.forEach((item) => {
        const val = toNumber(item.paidSoFar);
        totalEntradas += val;
        addRow(String(item.description || "-"), `R$ ${formatNumber(val)}`);
      });

      yPosition += 8;
      pdf.setFontSize(13);
      pdf.text(
        `Total Entradas: R$ ${formatNumber(totalEntradas)}`,
        margin,
        yPosition,
      );
    }

    if (pdfType === "saidas") {
      saidas.forEach((item) => {
        const val = toNumber(item.paidSoFar);
        totalSaidas += val;
        addRow(String(item.description || "-"), `R$ ${formatNumber(val)}`);
      });

      yPosition += 8;
      pdf.setFontSize(13);
      pdf.text(
        `Total Saídas: R$ ${formatNumber(totalSaidas)}`,
        margin,
        yPosition,
      );
    }

    if (pdfType === "both") {
      entradas.forEach((item) => {
        const val = toNumber(item.paidSoFar);
        totalEntradas += val;
        addRow(String(item.description || "-"), `R$ ${formatNumber(val)}`);
      });

      yPosition += 8;
      pdf.setFontSize(13);
      pdf.text(
        `Total Entradas: R$ ${formatNumber(totalEntradas)}`,
        margin,
        yPosition,
      );

      pdf.addPage();
      yPosition = margin;
      header("Saídas");

      saidas.forEach((item) => {
        const val = toNumber(item.paidSoFar);
        totalSaidas += val;
        addRow(String(item.description || "-"), `R$ ${formatNumber(val)}`);
      });

      yPosition += 8;
      pdf.setFontSize(13);
      pdf.text(
        `Total Saídas: R$ ${formatNumber(totalSaidas)}`,
        margin,
        yPosition,
      );

      pdf.addPage();
      yPosition = margin;
      pdf.setFontSize(18);
      pdf.text("Balanço Final", margin, yPosition);
      yPosition += 12;

      pdf.setFontSize(14);
      pdf.text(
        `Total Entradas: R$ ${formatNumber(totalEntradas)}`,
        margin,
        yPosition,
      );
      yPosition += 10;

      pdf.text(
        `Total Saídas: R$ ${formatNumber(totalSaidas)}`,
        margin,
        yPosition,
      );
      yPosition += 10;

      pdf.text(
        `Balanço: R$ ${formatNumber(totalEntradas - totalSaidas)}`,
        margin,
        yPosition,
      );
    }

    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addFooter(pdf, i, totalPages, studentName);
    }

    pdf.save(`Relatorio_Financeiro_${selectedMonth}.pdf`);
    setShowPDFModal(false);
  };

  return (
    <>
      <button
        className="linguee-btn linguee-btn-outline"
        onClick={() => setShowPDFModal(true)}
      >
        {buttonLabel}
      </button>

      {showPDFModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 999999,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "80px",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "6px",
                maxWidth: "350px",
                width: "100%",
                boxShadow: "0 6px 20px rgba(0,0,0,.15)",
              }}
            >
              <h3 style={{ marginBottom: "16px" }}>Opções do Relatório</h3>

              <label style={{ display: "block", marginBottom: "8px" }}>
                Tipo:
                <select
                  value={pdfType}
                  onChange={(e) => setPDFType(e.target.value as PdfType)}
                  style={{ marginLeft: "8px" }}
                >
                  <option value="both">Entradas e Saídas</option>
                  <option value="entradas">Só Entradas</option>
                  <option value="saidas">Só Saídas</option>
                </select>
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "18px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setShowPDFModal(false)}
                  style={{
                    background: "#eee",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={generatePDFReport}
                  className="linguee-btn linguee-btn-outline"
                  disabled={filtered.length === 0}
                  title={
                    filtered.length === 0
                      ? "Nenhum item com pago até aqui > 0"
                      : undefined
                  }
                >
                  Gerar PDF
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function addFooter(
  pdf: jsPDF,
  pageNum: number,
  totalPages: number,
  studentName: string,
) {
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  pdf.setFontSize(9);
  pdf.text(
    `${studentName ? studentName + "  -  " : ""}Página ${pageNum} de ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" },
  );
}

function labelPdfType(t: PdfType) {
  if (t === "entradas") return "Entradas";
  if (t === "saidas") return "Saídas";
  return "Entradas e Saídas";
}
