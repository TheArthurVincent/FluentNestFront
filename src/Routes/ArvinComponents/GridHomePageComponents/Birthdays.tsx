import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { CakeIcon } from "@phosphor-icons/react";
import { backDomain } from "../../../Resources/UniversalComponents";

interface BirthdaysProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  studentId?: string;
  isDesktop?: boolean;
}

type BirthdayStudent = {
  picture: string;
  name: string;
  lastname: string;
  dateOfBirth: string; // "yyyy-mm-dd"
  isToday: boolean;
};

export const Birthdays: FC<BirthdaysProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
  studentId,
}) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<BirthdayStudent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canLoad = Boolean(appLoaded && studentId && actualHeaders);
    if (!canLoad) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get(
          `${backDomain}/api/v1/birthdays/${studentId}`,
          actualHeaders,
        );

        const items: BirthdayStudent[] = Array.isArray(data?.list)
          ? data.list
          : [];

        if (!cancelled) setList(items);
      } catch (e: any) {
        if (!cancelled)
          setError(e?.response?.data?.error || "Erro ao carregar aniversários");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appLoaded, studentId, actualHeaders, backDomain]);

  const formatDob = (dob: string) => {
    // yyyy-mm-dd -> dd/mm
    if (!dob || dob.length !== 10) return "";
    const [, mm, dd] = dob.split("-");
    return `${dd}/${mm}`;
  };

  const todayCount = list.reduce((acc, s) => acc + (s.isToday ? 1 : 0), 0);

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
          <CakeIcon size={20} color={"#030303"} weight="bold" />
          <span>Próximos Aniversários</span>
        </span>

        {/* discreto: só mostra se houver aniversário hoje */}
        {todayCount > 0 && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: "999px",
              background: "#f2f2f2",
              color: "#030303",
              whiteSpace: "nowrap",
            }}
          >
            Hoje: {todayCount}
          </span>
        )}
      </span>

      <div>
        <ul style={{ marginTop: "16px", paddingLeft: 0, listStyle: "none" }}>
          {loading && (
            <li style={{ fontSize: "13px", color: "#666" }}>Carregando...</li>
          )}

          {!loading && error && (
            <li style={{ fontSize: "13px", color: "#b00020" }}>{error}</li>
          )}

          {!loading && !error && list.length === 0 && (
            <li style={{ fontSize: "13px", color: "#666" }}>
              Nenhum aniversário próximo.
            </li>
          )}

          {!loading &&
            !error &&
            list.map((s, idx) => (
              <li
                key={`${s.name}-${s.lastname}-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <img
                    src={
                      s.picture ||
                      "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                    }
                    alt={`${s.name} ${s.lastname}`}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "999px",
                      objectFit: "cover",
                    }}
                  />
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {s.name} {s.lastname}
                    </span>

                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {s.isToday ? "Hoje" : formatDob(s.dateOfBirth)}
                    </span>
                  </span>
                </span>

                {/* badge discreto de hoje */}
                {s.isToday && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "#f7f7f7",
                      color: "#030303",
                    }}
                  >
                    🎂
                  </span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
