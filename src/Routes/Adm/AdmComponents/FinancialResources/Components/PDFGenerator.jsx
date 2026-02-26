// PdfReportModal.jsx
// Modal isolado + geração do PDF (tira COMPLETAMENTE do FinancialResources)
// Requer: npm i jspdf
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";

export default function PdfReportModal({
  open,
  onClose,
  selectedMonth,
  studentName,
  financialReports,
}) {
  const [pdfType, setPDFType] = useState("both"); // both | entradas | saidas

  const safeReports = useMemo(() => {
    return Array.isArray(financialReports) ? financialReports : [];
  }, [financialReports]);

  const entradas = useMemo(() => {
    return safeReports.filter(
      (item) => Number(item?.paidSoFar) > 0 && item?.typeOfItem !== "debt",
    );
  }, [safeReports]);

  const saidas = useMemo(() => {
    return safeReports.filter(
      (item) => Number(item?.paidSoFar) > 0 && item?.typeOfItem === "debt",
    );
  }, [safeReports]);

  // ======= FÓRMULAS / HELPERS QUE VÃO PRA ESTE DOC (copie junto) =======
  // 1) filtro de entradas e saídas: paidSoFar > 0 e typeOfItem debt/não debt (acima)
  // 2) totais:
  const sumPaidSoFar = (list) =>
    list.reduce((acc, item) => acc + (Number(item?.paidSoFar) || 0), 0);

  // 3) rodapé:
  const addFooter = (pdf, pageNum, totalPages, name) => {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFontSize(9);
    pdf.text(`${name}  -  Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  };

  // 4) header/tabela:
  const writeHeader = (pdf, title, typeLabel, margin, y, maxWidth) => {
    pdf.setFontSize(18);
    pdf.text(title, margin, y);
    y += 12;

    pdf.setFontSize(12);
    pdf.text(`Tipo: ${typeLabel} | Simples`, margin, y);
    y += 10;

    pdf.setLineWidth(0.5);
    pdf.line(margin, y, maxWidth + margin, y);
    y += 8;

    pdf.setFontSize(11);
    pdf.text("Descrição", margin, y);
    pdf.text("Valor", margin + 100, y);
    y += 8;

    pdf.setLineWidth(0.2);
    pdf.line(margin, y, maxWidth + margin, y);
    y += 6;

    return y;
  };

  // 5) render de linhas com quebra de página:
  const writeRows = ({
    pdf,
    rows,
    margin,
    pageHeight,
    startY,
    pageNumStart,
    totalPages,
    name,
  }) => {
    let y = startY;
    let pageNum = pageNumStart;
    let total = 0;

    rows.forEach((item) => {
      pdf.setFontSize(10);
      pdf.text(String(item?.description || "-"), margin, y);
      pdf.text(String(item?.paidSoFar ?? "-"), margin + 100, y);

      y += 8;
      total += Number(item?.paidSoFar) || 0;

      if (y > pageHeight - 20) {
        addFooter(pdf, pageNum, totalPages, name);
        pdf.addPage();
        pageNum += 1;
        y = margin;
      }
    });

    return { y, pageNum, total };
  };

  const generatePDFReport = () => {
    const pdf = new jsPDF();

    const margin = 20;
    let yPosition = 20;
    const maxWidth = pdf.internal.pageSize.width - 2 * margin;
    const pageHeight = pdf.internal.pageSize.height;

    const typeLabel =
      pdfType === "entradas" ? "Entradas" : pdfType === "saidas" ? "Saídas" : "Entradas e Saídas";

    // ====== ENTRADAS ONLY ======
    if (pdfType === "entradas") {
      let pageNum = 1;
      const totalPages = 1; // mantém simples igual seu original

      yPosition = writeHeader(
        pdf,
        `Relatório Financeiro - ${selectedMonth}`,
        typeLabel,
        margin,
        yPosition,
        maxWidth,
      );

      const res = writeRows({
        pdf,
        rows: entradas,
        margin,
        pageHeight,
        startY: yPosition,
        pageNumStart: pageNum,
        totalPages,
        name: studentName,
      });

      yPosition = res.y + 8;
      const totalEntradas = res.total;

      pdf.setFontSize(13);
      pdf.text(`Total Entradas: R$ ${totalEntradas.toFixed(2)}`, margin, yPosition);

      addFooter(pdf, res.pageNum, totalPages, studentName);
      pdf.save(`Relatorio_Financeiro_${selectedMonth}.pdf`);
      onClose?.();
      return;
    }

    // ====== SAIDAS ONLY ======
    if (pdfType === "saidas") {
      let pageNum = 1;
      const totalPages = 1;

      yPosition = writeHeader(
        pdf,
        `Relatório Financeiro - ${selectedMonth}`,
        typeLabel,
        margin,
        yPosition,
        maxWidth,
      );

      const res = writeRows({
        pdf,
        rows: saidas,
        margin,
        pageHeight,
        startY: yPosition,
        pageNumStart: pageNum,
        totalPages,
        name: studentName,
      });

      yPosition = res.y + 8;
      const totalSaidas = res.total;

      pdf.setFontSize(13);
      pdf.text(`Total Saídas: R$ ${totalSaidas.toFixed(2)}`, margin, yPosition);

      addFooter(pdf, res.pageNum, totalPages, studentName);
      pdf.save(`Relatorio_Financeiro_${selectedMonth}.pdf`);
      onClose?.();
      return;
    }

    // ====== BOTH ======
    // Entradas -> Saídas -> Balanço (igual seu comportamento)
    let pageNum = 1;

    yPosition = writeHeader(
      pdf,
      `Relatório Financeiro - ${selectedMonth}`,
      typeLabel,
      margin,
      yPosition,
      maxWidth,
    );

    const resEntradas = writeRows({
      pdf,
      rows: entradas,
      margin,
      pageHeight,
      startY: yPosition,
      pageNumStart: pageNum,
      totalPages: pageNum + 2,
      name: studentName,
    });

    let totalEntradas = resEntradas.total;
    yPosition = resEntradas.y + 8;

    pdf.setFontSize(13);
    pdf.text(`Total Entradas: R$ ${totalEntradas.toFixed(2)}`, margin, yPosition);
    addFooter(pdf, resEntradas.pageNum, resEntradas.pageNum + 2, studentName);

    pdf.addPage();
    pageNum = resEntradas.pageNum + 1;
    yPosition = margin;

    pdf.setFontSize(18);
    pdf.text("Saídas", margin, yPosition);
    yPosition += 12;

    pdf.setFontSize(11);
    pdf.text("Descrição", margin, yPosition);
    pdf.text("Valor", margin + 100, yPosition);
    yPosition += 8;

    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition, maxWidth + margin, yPosition);
    yPosition += 6;

    const resSaidas = writeRows({
      pdf,
      rows: saidas,
      margin,
      pageHeight,
      startY: yPosition,
      pageNumStart: pageNum,
      totalPages: pageNum + 1,
      name: studentName,
    });

    let totalSaidas = resSaidas.total;
    yPosition = resSaidas.y + 8;

    pdf.setFontSize(13);
    pdf.text(`Total Saídas: R$ ${totalSaidas.toFixed(2)}`, margin, yPosition);
    addFooter(pdf, resSaidas.pageNum, resSaidas.pageNum + 1, studentName);

    pdf.addPage();
    pageNum = resSaidas.pageNum + 1;
    yPosition = margin;

    pdf.setFontSize(18);
    pdf.text("Balanço Final", margin, yPosition);
    yPosition += 12;

    pdf.setFontSize(14);
    pdf.text(`Total Entradas: R$ ${totalEntradas.toFixed(2)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Total Saídas: R$ ${totalSaidas.toFixed(2)}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Balanço: R$ ${(totalEntradas - totalSaidas).toFixed(2)}`, margin, yPosition);

    addFooter(pdf, pageNum, pageNum, studentName);

    pdf.save(`Relatorio_Financeiro_${selectedMonth}.pdf`);
    onClose?.();
  };

  if (!open) return null;

  return createPortal(
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
      onClick={onClose}
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
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: "16px" }}>Opções do Relatório</h3>

        <label style={{ display: "block", marginBottom: "8px" }}>
          Tipo:
          <select
            value={pdfType}
            onChange={(e) => setPDFType(e.target.value)}
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
            onClick={onClose}
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

          <button onClick={generatePDFReport} className="linguee-btn linguee-btn-outline">
            Gerar PDF
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}