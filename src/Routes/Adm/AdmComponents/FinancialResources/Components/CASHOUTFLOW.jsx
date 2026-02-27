import React, { useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Paleta “infinita” (HSV -> HSL) pra cada item ter uma cor diferente
function colorFromIndex(i) {
  const hue = (i * 47) % 360; // passo bom pra espalhar cores
  return `hsl(${hue} 75% 45%)`;
}

function formatBRL(n) {
  return `R$ ${Number(n || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * DonutChartSaidasByItem
 * - cada report (debt) vira uma fatia com cor própria
 * - hover mostra tooltip com descrição + valores + status
 * - opcional: clique no slice chama onSliceClick(report)
 */
export function DonutChartSaidasByItem({
  financialReports = [],
  size = 140,
  strokeWidth = 16,
  minSliceFraction = 0.006, // evita fatias “invisíveis” quando valor muito pequeno
  showCenterTotal = true,
  onSliceClick,
  // define o valor da fatia:
  // "total" => abs(amount) - discount
  // "paidSoFar" => paidSoFar
  valueMode = "total",
}) {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    html: "",
  });
  const containerRef = useRef(null);

  const { slices, total } = useMemo(() => {
    const debts = (financialReports || []).filter(
      (r) => r && r.typeOfItem === "debt",
    );

    const getTotal = (r) =>
      Math.max(0, Math.abs(r.amount || 0) - (r.discount || 0));
    const getValue = (r) =>
      valueMode === "paidSoFar" ? Math.max(0, r.paidSoFar || 0) : getTotal(r);

    // Ordena pra manter cores estáveis (mesmo dataset)
    const ordered = debts
      .slice()
      .sort((a, b) =>
        String(a.description || "").localeCompare(String(b.description || "")),
      );

    const mapped = ordered.map((r, idx) => {
      const totalValue = getTotal(r);
      const sliceValue = getValue(r);

      const status = r.accountFor ? "Contabilizada" : "Não contabilizada";
      const key = `${r._id || r.id || r.studentId || idx}-${idx}`;

      return {
        key,
        report: r,
        label: r.description || "Sem descrição",
        status,
        color: colorFromIndex(idx),
        value: sliceValue,
        totalValue,
      };
    });

    const sum = mapped.reduce((acc, s) => acc + (s.value || 0), 0);

    return {
      total: sum,
      slices: mapped.filter((s) => (s.value || 0) > 0),
    };
  }, [financialReports, valueMode]);

  // 1rem ~ 16px (se quiser mais folga, aumente)
  const CENTER_PADDING_PX = 16;

  // garante um "buraco" mínimo para o centro respirar
  const minInnerDiameter = CENTER_PADDING_PX * 2 + 28; // 28 = espaço mínimo pro texto não ficar esmagado
  const minInnerRadius = minInnerDiameter / 2;

  // stroke máximo permitido para sobrar innerRadius >= minInnerRadius
  const maxStrokeAllowed = Math.max(6, size / 2 - minInnerRadius);

  // se strokeWidth vier grande demais p/ um size pequeno, reduz automaticamente
  const effectiveStrokeWidth = Math.min(strokeWidth, maxStrokeAllowed);

  // raio do arco (center line do stroke)
  const radius = (size - effectiveStrokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  // raio interno real (buraco do donut)
  const innerRadius = radius - effectiveStrokeWidth / 2;

  const arcs = useMemo(() => {
    if (!total || slices.length === 0) return [];

    // aplica minSliceFraction pra ficar hoverável mesmo com valores pequenos
    const rawFractions = slices.map((s) => s.value / total);
    const boosted = rawFractions.map((f) => Math.max(f, minSliceFraction));
    const boostedSum = boosted.reduce((a, b) => a + b, 0);
    const norm = boosted.map((f) => f / boostedSum);

    let accDash = 0;

    return slices.map((s, i) => {
      const fraction = norm[i];
      const dash = fraction * circumference;
      const dashoffset = circumference - dash - accDash;
      accDash += dash;

      return {
        ...s,
        fraction,
        dash,
        dashoffset,
      };
    });
  }, [slices, total, circumference, minSliceFraction]);

  function showTooltip(e, arc) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const r = arc.report;
    const totalPlanned = Math.max(
      0,
      Math.abs(r.amount || 0) - (r.discount || 0),
    );

    const paid = Math.max(0, r.paidSoFar || 0);
    const discount = Math.max(0, r.discount || 0);

    const html = `
      <div style="font-weight:700;margin-bottom:6px;">${escapeHtml(
        arc.label,
      )}</div>
      <div style="font-size:12px;color:#374151;margin-bottom:6px;">
        <span style="font-weight:600;">${escapeHtml(arc.status)}</span>
      </div>
      <div style="font-size:12px;color:#111827;">
        <div><span style="color:#6b7280;">Total:</span> ${formatBRL(
          totalPlanned,
        )}</div>
        ${
          discount > 0
            ? `<div><span style="color:#6b7280;">Desconto:</span> ${formatBRL(
                discount,
              )}</div>`
            : ""
        }
        <div><span style="color:#6b7280;">Pago até agora:</span> ${formatBRL(
          paid,
        )}</div>
      </div>
    `;

    setTooltip({
      visible: true,
      x,
      y,
      html,
    });
  }

  function moveTooltip(e) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip((prev) =>
      prev.visible
        ? {
            ...prev,
            x,
            y,
          }
        : prev,
    );
  }

  function hideTooltip() {
    setTooltip((prev) => ({ ...prev, visible: false }));
    setHoveredKey(null);
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: size,
        height: size,
        userSelect: "none",
      }}
      onMouseMove={moveTooltip}
      onMouseLeave={hideTooltip}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* trilho */}
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={effectiveStrokeWidth}
          />

          {arcs.map((a) => {
            const isHovered = hoveredKey === a.key;
            const width = isHovered
              ? effectiveStrokeWidth + 3
              : effectiveStrokeWidth;
            const opacity = isHovered ? 1 : 0.88;

            return (
              <circle
                key={a.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={a.color}
                strokeWidth={width}
                strokeLinecap="round"
                strokeDasharray={`${a.dash} ${circumference - a.dash}`}
                strokeDashoffset={a.dashoffset}
                style={{
                  cursor: onSliceClick ? "pointer" : "default",
                  transition: "opacity 120ms ease, stroke-width 120ms ease",
                  opacity,
                }}
                onMouseEnter={(e) => {
                  setHoveredKey(a.key);
                  showTooltip(e, a);
                }}
                onClick={() => onSliceClick?.(a.report)}
              />
            );
          })}
        </g>
      </svg>

      {/* centro */}
      {showCenterTotal && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              // aqui é o "padding" real do centro
              padding: "1rem",
              // limita a área do texto ao buraco do donut
              width: Math.max(0, innerRadius * 2),
              maxWidth: Math.max(0, innerRadius * 2),
              textAlign: "center",
              lineHeight: 1.15,
              display: "grid",
              gap: 2,
            }}
          >
            <div
              style={{ fontSize: Math.max(9, size * 0.08), color: "#6b7280" }}
            >
              Saídas
            </div>

            <div
              style={{
                fontSize: Math.max(10, size * 0.09),
                fontWeight: 800,
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={formatBRL(total)} // se cortar, o usuário vê no hover nativo
            >
              {formatBRL(total)}
            </div>

            <div
              style={{ fontSize: Math.max(8, size * 0.075), color: "#9ca3af" }}
            >
              {slices.length} itens
            </div>
          </div>
        </div>
      )}
      {/* tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: clamp(tooltip.x + 12, 8, size - 8),
            top: clamp(tooltip.y + 12, 8, size - 8),
            transform: "translate(0, 0)",
            background: "rgba(17,24,39,0.95)",
            color: "#fff",
            padding: "10px 12px",
            borderRadius: 5,
            fontSize: 12,
            width: 220,
            boxShadow: "0 10px 25px rgba(0,0,0,0.22)",
            zIndex: 10,
            pointerEvents: "none",
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.html }}
        />
      )}
    </div>
  );
}

// evita quebrar tooltip com caracteres especiais
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
