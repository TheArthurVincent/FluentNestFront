import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { ChartBarIcon } from "@phosphor-icons/react";

interface WeeklyProgressProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
  studentId: string;
}

export const WeeklyProgress: FC<WeeklyProgressProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
  studentId,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<any[]>([]);
  const [category, setCategory] = React.useState("total");
  const [CATEGORIES, setCATEGORIES] = React.useState<
    { label: string; value: string }[]
  >([
    {
      label: "Total",
      value: "total",
    },
  ]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/history/${studentId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );
      const data = response.data.data || [];
      setProgress(data);

      // Extrair categorias únicas de todos os perDay
      const typesSet = new Set<string>();
      data.forEach((d: any) => {
        if (Array.isArray(d.perDay)) {
          d.perDay.forEach((p: any) => {
            if (p.type && p.type !== "25Flashcards") {
              typesSet.add(p.type);
            }
          });
        }
      });
      // Sempre incluir "total" como primeira opção
      const categoriesArr = [
        { label: "Total", value: "total" },
        ...Array.from(typesSet)
          .filter((t) => t !== "total")
          .map((t) => ({
            label: t.charAt(0).toUpperCase() + t.slice(1),
            value: t,
          })),
      ];
      setCATEGORIES(categoriesArr);
      // Se a categoria atual não existir mais, resetar para total
      if (!categoriesArr.find((c) => c.value === category)) {
        setCategory("total");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
    // eslint-disable-next-line
  }, [studentId, appLoaded]);

  // Mapear dias da semana para datas recebidas
  const weekDays = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  // Montar array de datas da semana
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  // Montar array de valores por dia
  const values = weekDates.map((date) => {
    const dayData = progress.find((d) => d.date === date);
    if (!dayData) return 0;
    const cat = dayData.perDay.find(
      (p: any) => p.type.toLowerCase() === category.toLowerCase()
    );
    return cat ? cat.totalScore : 0;
  });

  const maxValue = Math.max(...values, 1);

  return (
    <>
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "600",
            color: "#030303",
          }}
        >
          <ChartBarIcon size={20} color={"#030303"} weight="bold" />
          <span onClick={fetchProgress} style={{ cursor: "pointer" }}>
            Progresso Semanal
          </span>
        </span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            fontWeight: 600,
            borderRadius: 4,
            border: "1px solid #ccc",
            padding: "2px 8px",
            fontSize: 12,
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </span>
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "16px",
          justifyContent: "space-between",
        }}
      >
        {weekDays.map((day, index) => (
          <div
            key={index + day}
            style={{
              fontFamily: "Inter",
              fontWeight: 500,
              borderRadius: 4,
              fontStyle: "Medium",
              fontSize: "12px",
              lineHeight: "100%",
              color: "#65748C",
              textAlign: "center",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {day}
            <div
              style={{
                width: 35,
                marginTop: 8,
                height: 80,
                background: `linear-gradient(to top, ${partnerColor()} ${
                  (values[index] / maxValue) * 100
                }%, #e0e0e0 ${(values[index] / maxValue) * 100}%)`,
                borderRadius: 4,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                transition: "background 0.3s",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "#222",
                  fontWeight: 600,
                  marginBottom: 4,
                  position: "absolute",
                  width: 35,
                  textAlign: "center",
                }}
              >
                {values[index] > 0 ? values[index] : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
