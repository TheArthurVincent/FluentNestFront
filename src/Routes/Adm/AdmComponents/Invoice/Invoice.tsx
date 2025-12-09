import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { MyButton } from "../../../../Resources/Components/ItemsLibrary";
import Helmets from "../../../../Resources/Helmets";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";
import {
  getWhiteLabel,
  isArthurVincent,
  localStorageLoggedIn,
} from "../../../../App";

export function Invoice({ headers }: HeadersProps) {
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [newID, setNewID] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [doc, setDoc] = useState<string>("");
  const [today, setDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate()))
  );
  const [fee, setFee] = useState<number>(1000);
  const [comments, setComments] = useState<string>(
    "Mensalidade de aulas particulares"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const actualHeaders = headers || {};
  const MYID = localStorageLoggedIn?.id || "";
  const primary = partnerColor();

  const handleStudentChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = event.target.value;
    setNewID(id);
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers: actualHeaders,
      });
      setName(response.data.formattedStudentData.fullname);
      setFee(response.data.formattedStudentData.fee);
      setDoc(response.data.formattedStudentData.doc);
    } catch (error) {
      alert("Erro ao encontrar aluno");
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${MYID}`,
        {
          headers: actualHeaders,
        }
      );
      setStudentsList(response.data.listOfStudents || []);
    } catch (error) {
      alert("Erro ao encontrar alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const formatSelectedDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    // @ts-ignore
    return `${day - 1}/${month}/${year}`;
  };

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  const currency = (v: number) => formatter.format(isFinite(v) ? v : 0);

  // Abre uma nova janela só com o recibo e manda imprimir
  const generatePDF = () => {
    const invoiceElement = document.querySelector(
      ".invoice"
    ) as HTMLElement | null;

    if (!invoiceElement) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1000");
    if (!printWindow) {
      window.print();
      return;
    }

    const invoiceHTML = invoiceElement.outerHTML;

    const styleForPrint = `
      :root {
        --primary: ${primary};
        --ink: #111827;
        --muted: #6b7280;
        --line: #e5e7eb;
        --bg: #ffffff;
      }

      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
        background: var(--bg);
        color: var(--ink);
      }

      .invoice { 
        max-width: 860px; 
        margin: 1.5rem auto; 
        background: var(--bg); 
        color: var(--ink); 
        border:1px solid var(--line); 
        border-radius: 4px; 
        box-shadow: 0 10px 30px rgba(0,0,0,.05); 
      }

      .invoice__inner { padding: 2rem; }

      .invoice__head { 
        display:flex; 
        align-items:center; 
        justify-content:space-between; 
        gap:1rem; 
        border-bottom:1px solid var(--line); 
        padding-bottom:1rem; 
      }

      .brand { display:grid; align-items:center; gap:1rem; }
      .brand img { height: 28px; width:auto; border-radius: 4px; }
      .brand h1 { font-size: 1.5rem; margin:0; letter-spacing:.02em; color: var(--primary); }

      .meta { text-align:right; }
      .meta .title { font-weight:600; color:var(--muted); font-size:.85rem; }
      .meta .value { font-size:1rem; }

      .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.25rem; }
      .panel { border:1px solid var(--line); border-radius: 4px; padding:1rem; }
      .panel h3 { margin:0 0 .5rem; font-size: .95rem; color: var(--muted); font-weight:600; letter-spacing:.02em; }
      .panel p { margin:.15rem 0; }

      .description-block {
        margin-top: 1.25rem;
        border: 1px dashed var(--line);
        border-radius: 12px;
        padding: 1rem;
        background: #fafafa;
      }

      .description-block label {
        display:block;
        font-size:.85rem;
        color:var(--muted);
        margin-bottom:.35rem;
        font-weight:600;
        letter-spacing:.02em;
      }

      .description-text {
        font-size:.95rem;
        line-height:1.5;
      }

      table { width:100%; border-collapse:collapse; margin-top:1.25rem; }
      th, td { text-align:left; padding:.9rem 1rem; border-bottom:1px solid var(--line); }
      th { font-size:.85rem; color:var(--muted); font-weight:600; letter-spacing:.03em; }
      tfoot td { font-weight:700; }
      .right { text-align:right; }

      .signature { margin-top:3rem; text-align:center; }
      .signature img { max-width: 10rem; display:block; margin:.5rem auto 0; }

      .issuer { 
        margin-top:1.5rem; 
        border-top:1px solid var(--line); 
        padding-top:1rem; 
        text-align:center; 
        color:var(--muted); 
        font-size:.95rem; 
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @page {
          size: A4;
          margin: 14mm 12mm;
        }
      }

      @media (max-width: 640px) {
        .invoice__inner { padding: 1.25rem; }
        .invoice__head { flex-direction: column; align-items:flex-start; }
        .meta { text-align:left; }
        .grid { grid-template-columns: 1fr; }
      }
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Pagamento</title>
          <meta charSet="utf-8" />
          <style>${styleForPrint}</style>
        </head>
        <body>
          ${invoiceHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div>
      {/* ESTILOS PARA A VERSÃO DENTRO DO APP */}
      <style>{`
        :root {
          --primary: ${primary};
          --ink: #111827;
          --muted: #6b7280;
          --line: #e5e7eb;
          --bg: #ffffff;
        }

        .invoice-toolbar {
          display: grid;
          gap: 10px;
          align-items: center;
          justify-items: center;
          grid-template-columns: 1fr 1fr;
          padding: 1rem;
        }

        .invoice-toolbar select,
        .invoice-toolbar input {
          padding: .5rem .6rem;
          border: 1px solid var(--line);
          border-radius: .5rem;
          font-size: .95rem;
          width: 100%;
          max-width: 220px;
        }

        .invoice-toolbar .value-row {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
        }

        .invoice { 
          max-width: 860px; 
          margin: 2rem auto; 
          background: var(--bg); 
          color: var(--ink); 
          border:1px solid var(--line); 
          border-radius: 4px; 
          box-shadow: 0 10px 30px rgba(0,0,0,.05); 
        }

        .invoice__inner { padding: 2rem; }

        .invoice__head { 
          display:flex; 
          align-items:center; 
          justify-content:space-between; 
          gap:1rem; 
          border-bottom:1px solid var(--line); 
          padding-bottom:1rem; 
        }

        .brand { display:grid; align-items:center; gap:1rem; }
        .brand img { height: 28px; width:auto; border-radius: 4px; }
        .brand h1 { font-size: 1.5rem; margin:0; letter-spacing:.02em; color: var(--primary); }

        .meta { text-align:right; }
        .meta .title { font-weight:600; color:var(--muted); font-size:.85rem; }
        .meta .value { font-size:1rem; }

        .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.25rem; }
        .panel { border:1px solid var(--line); border-radius: 4px; padding:1rem; }
        .panel h3 { margin:0 0 .5rem; font-size: .95rem; color: var(--muted); font-weight:600; letter-spacing:.02em; }
        .panel p { margin:.15rem 0; }

        .description-block {
          margin-top: 1.25rem;
          border: 1px dashed var(--line);
          border-radius: 12px;
          padding: 1rem;
          background: #fafafa;
        }

        .description-block label {
          display:block;
          font-size:.85rem;
          color:var(--muted);
          margin-bottom:.35rem;
          font-weight:600;
          letter-spacing:.02em;
        }

        .description-input {
          width: 100%;
          border: none;
          background: transparent;
          resize: vertical;
          min-height: 48px;
          font-size: .95rem;
          line-height: 1.5;
          outline: none;
        }

        table { width:100%; border-collapse:collapse; margin-top:1.25rem; }
        th, td { text-align:left; padding:.9rem 1rem; border-bottom:1px solid var(--line); }
        th { font-size:.85rem; color:var(--muted); font-weight:600; letter-spacing:.03em; }
        tfoot td { font-weight:700; }
        .right { text-align:right; }

        .signature { margin-top:3rem; text-align:center; }
        .signature img { max-width: 10rem; display:block; margin:.5rem auto 0; }

        .issuer { 
          margin-top:1.5rem; 
          border-top:1px solid var(--line); 
          padding-top:1rem; 
          text-align:center; 
          color:var(--muted); 
          font-size:.95rem; 
        }

        @media (max-width: 640px) {
          .invoice__inner { padding: 1.25rem; }
          .invoice__head { flex-direction: column; align-items:flex-start; }
          .meta { text-align:left; }
          .grid { grid-template-columns: 1fr; }
          .invoice-toolbar { grid-template-columns: 1fr; }
        }
      `}</style>

      {loading ? (
        <div style={{ display: "grid", placeItems: "center", padding: "3rem" }}>
          <CircularProgress style={{ color: primary }} />
        </div>
      ) : (
        <div className="no-print invoice-toolbar">
          <select onChange={handleStudentChange} name="students" value={newID}>
            <option value="" disabled>
              Selecione o aluno
            </option>
            {studentsList.map((s: any, idx: number) => (
              <option key={idx} value={s.id}>
                {`${s.name} ${s.lastname || ""}`.trim()}
              </option>
            ))}
          </select>

          <input
            type="date"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                const [year, month, day] = value.split("-").map(Number);
                setDate(new Date(year, month - 1, day + 1));
              }
            }}
          />

          <div className="value-row">
            <label>Valor</label>
            <input
              value={fee}
              type="number"
              step="0.01"
              onChange={(e) => setFee(Number(e.target.value))}
              aria-label="Valor"
            />
          </div>

          <MyButton className="btn-print" onClick={generatePDF}>
            Imprimir / PDF
          </MyButton>
        </div>
      )}

      {/* RECIBO */}
      <div className="invoice">
        <div className="invoice__inner">
          <div className="invoice__head">
            <div className="brand">
              {isArthurVincent && (
                <img
                  src={
                    getWhiteLabel.logo ||
                    "https://ik.imagekit.io/vjz75qw96/assets/logo.png?updatedAt=1717680390615"
                  }
                  alt="Logo"
                />
              )}
              <h1>Recibo de Pagamento</h1>
            </div>
            <div className="meta">
              <div className="title">Recibo Nº</div>
              <div className="value">
                {newID ? `INV-${newID}${new Date().getMilliseconds()}` : "—"}
              </div>
              <div className="title" style={{ marginTop: ".35rem" }}>
                Data
              </div>
              <div className="value">{formatSelectedDate(today)}</div>
            </div>
          </div>

          <div className="grid">
            <div className="panel">
              <h3>De</h3>
              <p>
                <strong>
                  {`${localStorageLoggedIn?.name || ""} ${
                    localStorageLoggedIn?.lastname || ""
                  }`.trim()}
                </strong>
              </p>
              {localStorageLoggedIn?.doc && (
                <p>CPF/CNPJ: {localStorageLoggedIn.doc}</p>
              )}
            </div>
            <div className="panel">
              <h3>Para</h3>
              <p>
                <strong>{name || "Aluno(a)"}</strong>
              </p>
              {doc && <p>CPF: {doc}</p>}
            </div>
          </div>

          {/* DESCRIÇÃO DENTRO DO RECIBO */}
          <div className="description-block">
            <label>Descrição / Observações</label>
            <textarea
              className="description-input"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Ex.: Mensalidade de aulas particulares — referência: Agosto/2025"
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th className="right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{comments}</td>
                <td className="right">{currency(fee)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="right">Total</td>
                <td className="right">{currency(fee)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="signature">
            {isArthurVincent && (
              <>
                <img
                  src="https://ik.imagekit.io/vjz75qw96/assets/signature.png?updatedAt=1717680390615"
                  alt="Assinatura"
                />
                <div
                  style={{
                    width: "260px",
                    margin: "0 auto",
                    borderTop: "2px solid #111",
                  }}
                />
              </>
            )}
          </div>

          <div className="issuer">
            <div>
              {`${localStorageLoggedIn?.name || ""} ${
                localStorageLoggedIn?.lastname || ""
              }`.trim()}
            </div>
            {localStorageLoggedIn?.doc && <div>{localStorageLoggedIn.doc}</div>}
            <div style={{ fontStyle: "italic", marginTop: ".25rem" }}>
              {formatSelectedDate(today)}
            </div>
          </div>
        </div>
      </div>

      <Helmets
        text={`Recibo de Pagamento de Aulas Particulares | ${name || "Aluno"}`}
      />
    </div>
  );
}

export default Invoice;
