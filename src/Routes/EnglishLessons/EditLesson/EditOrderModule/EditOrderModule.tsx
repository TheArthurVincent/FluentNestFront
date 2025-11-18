import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type HeadersType = any;

type ModuleMeta = {
  id: string; // _id do módulo
  title: string; // título do módulo
  order: number; // ordem
};

interface Props {
  courseId: string;
  headers?: HeadersType;
  onSaved?: () => Promise<void> | void; // para dar refresh no pai
  /** Se quiser injetar uma lista inicial e evitar 1º GET, pode passar. */
  initialList?: ModuleMeta[];
}

const ReorderModulesButton: React.FC<Props> = ({
  courseId,
  headers,
  onSaved,
  initialList,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [list, setList] = useState<ModuleMeta[]>(initialList || []);

  /** ===== styles mínimos ===== */
  const btnStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    background: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
  };
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: "0",
    left: "0",
    margin: "0 auto",
    width: "100vw",
    height: "100vh",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };
  const modalStyle: React.CSSProperties = {
    width: "min(92vw, 560px)",
    background: "#fff",
    height: "70vh",
    borderRadius: 8,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    overflow: "hidden",
  };
  const headerStyle: React.CSSProperties = {
    padding: "12px 14px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  };
  const bodyStyle: React.CSSProperties = {
    padding: 14,
    maxHeight: "70vh",
    overflow: "auto",
  };
  const footerStyle: React.CSSProperties = {
    padding: 12,
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    background: "#fafafa",
  };
  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "32px 1fr 88px",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "#fff",
  };

  const Spinner = ({ size = 20 }: { size?: number }) => (
    <div
      style={{
        width: size,
        height: size,
        border: `${Math.max(2, Math.floor(size / 9))}px solid rgba(0,0,0,0.1)`,
        borderTopColor: partnerColor(),
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
  if (!document.getElementById("spin-kf-rmb")) {
    const st = document.createElement("style");
    st.id = "spin-kf-rmb";
    st.innerHTML = `@keyframes spin{to{transform:rotate(360deg)}}`;
    document.head.appendChild(st);
  }

  /** ===== fetch meta ===== */
  const fetchMeta = async () => {
    setLoading(true);
    try {
      // endpoint só com {id,title,order}
      const res = await axios.get<{ modules: ModuleMeta[] }>(
        `${backDomain}/api/v1/modules-meta/${courseId}`,
        { headers }
      );
      const arr = (res.data?.modules || []).slice();
      // ordena por order crescente
      arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setList(arr);
    } catch (e) {
      // fallback: tentar aproveitar endpoint existente (se quiser)
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && !initialList?.length) {
      fetchMeta();
    } else if (open && initialList?.length) {
      // normaliza/ordena inicial
      const arr = initialList
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setList(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** ===== mover itens localmente ===== */
  const move = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir > list.length - 1) return;
    setList((prev) => {
      const next = prev.slice();
      const tmp = next[idx];
      next[idx] = next[idx + dir];
      next[idx + dir] = tmp;
      return next;
    });
  };

  /** ===== salvar ===== */
  const save = async () => {
    setSaving(true);
    try {
      // gera pares normalizados de 0..n-1 (ou 1..n, se preferir)
      const pairs = list.map((m, i) => ({ id: m.id, order: i }));
      await axios.post(
        `${backDomain}/api/v1/modules/reorder`,
        { courseId, pairs },
        { headers }
      );
      setOpen(false);
      if (onSaved) await onSaved();
    } catch (e) {
      // ignore / UX pode exibir erro
    } finally {
      setSaving(false);
    }
  };

  /** ===== numbering no preview ===== */
  const preview = useMemo(
    () =>
      list.map((m, idx) => ({
        ...m,
        previewOrder: idx, // índice atual na UI
      })),
    [list]
  );

  return (
    <>
      <button
        style={btnStyle}
        onClick={() => setOpen(true)}
        title="Reordenar módulos"
      >
        <i className="fa fa-arrows-v" aria-hidden="true" /> Reordenar Módulos
      </button>

      {open && (
        <div style={overlayStyle} onClick={() => setOpen(false)}>
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={headerStyle}>
              <strong style={{ fontSize: 14 }}>Reordenar Módulos</strong>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                aria-label="Fechar"
                title="Fechar"
              >
                ✕
              </button>
            </div>

            <div style={bodyStyle}>
              {loading ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Spinner /> Carregando módulos…
                </div>
              ) : preview.length === 0 ? (
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  Nenhum módulo encontrado.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {preview.map((m, idx) => (
                    <div key={m.id} style={rowStyle}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          background: "#f1f5f9",
                          borderRadius: 6,
                          color: "#334155",
                          userSelect: "none",
                        }}
                        title="Posição atual"
                      >
                        {idx + 1}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={m.title}
                        >
                          {m.title || "(sem título)"}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>
                          order atual: {m.order}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => move(idx, -1)}
                          disabled={idx === 0}
                          title="Mover para cima"
                          style={{
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            padding: "4px 8px",
                            borderRadius: 6,
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => move(idx, +1)}
                          disabled={idx === preview.length - 1}
                          title="Mover para baixo"
                          style={{
                            border: "1px solid #e2e8f0",
                            background: "#fff",
                            padding: "4px 8px",
                            borderRadius: 6,
                            cursor:
                              idx === preview.length - 1
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={footerStyle}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving || loading || preview.length === 0}
                style={{
                  border: "1px solid transparent",
                  background: partnerColor(),
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 6,
                  cursor:
                    saving || loading || preview.length === 0
                      ? "not-allowed"
                      : "pointer",
                  fontSize: 12,
                  opacity: saving ? 0.8 : 1,
                }}
                title="Salvar nova ordem"
              >
                {saving ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReorderModulesButton;
