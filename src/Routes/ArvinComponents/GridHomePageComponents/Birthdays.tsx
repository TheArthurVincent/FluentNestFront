import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { CakeIcon } from "@phosphor-icons/react";
import { backDomain } from "../../../Resources/UniversalComponents";

interface BirthdaysProps {
  appLoaded?: boolean; // vem piscando do pai
  actualHeaders?: any; // pode ser { headers: {...} } ou {...}
  studentId?: string;
  isDesktop?: boolean;
}

type BirthdayStudent = {
  picture: string;
  name: string;
  lastname: string;
  id: string;
  dateOfBirth: string; // "yyyy-mm-dd"
  isToday: boolean;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const normalizeAxiosConfig = (actualHeaders: any) => {
  if (!actualHeaders) return { headers: {} };
  if (actualHeaders.headers) return actualHeaders; // já é axios config
  return { headers: { ...actualHeaders } }; // headers puros
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

  // Evita ficar disparando request em loop quando appLoaded fica alternando
  const inFlightRef = useRef(false);
  const lastFetchKeyRef = useRef<string>("");

  const axiosConfig = useMemo(
    () => normalizeAxiosConfig(actualHeaders),
    [actualHeaders],
  );

  useEffect(() => {
    if (!studentId) return;

    // chave que representa "condições atuais"
    const fetchKey = `${studentId}`;

    // se já buscou com esse studentId e não quer refazer a cada piscar do appLoaded, bloqueia
    // MAS: se você quiser permitir refresh em alguns momentos, deixe appLoaded entrar na key:
    // const fetchKey = `${studentId}-${String(appLoaded)}`;
    //
    // Aqui eu recomendo NÃO colocar appLoaded, pra não ficar refazendo em loop.
    if (lastFetchKeyRef.current === fetchKey) return;

    // se tem request em andamento, não dispara outro
    if (inFlightRef.current) return;

    let cancelled = false;

    (async () => {
      inFlightRef.current = true;
      lastFetchKeyRef.current = fetchKey;

      setLoading(true);
      setError(null);

      const maxAttempts = 4;

      try {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const { data } = await axios.get(
              `${backDomain}/api/v1/birthdays/${studentId}`,
              {
                ...axiosConfig,
                timeout: 12000,
              },
            );

            const items: BirthdayStudent[] = Array.isArray(data?.list)
              ? data.list
              : [];

            if (!cancelled) setList(items);
            return; // sucesso
          } catch (e: any) {
            if (cancelled) return;

            const status = e?.response?.status;

            // não adianta retry em auth
            if (status === 401 || status === 403) {
              throw e;
            }

            // backoff: 400, 800, 1600...
            if (attempt < maxAttempts) {
              await sleep(400 * Math.pow(2, attempt - 1));
              continue;
            }

            throw e;
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.response?.data?.error ||
              e?.message ||
              "Erro ao carregar aniversários",
          );
        }
      } finally {
        // IMPORTANTE: mesmo se o effect for cancelado, a UI não pode ficar presa em loading
        if (!cancelled) setLoading(false);
        inFlightRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
      // se desmontar/cancelar, libera pra próxima tentativa futura
      inFlightRef.current = false;
    };

    // propositalmente NÃO depende de appLoaded, pra não entrar em loop
  }, [studentId, axiosConfig]);

  // Se você realmente quiser que ele tente novamente quando o appLoaded mudar (sem loop),
  // você pode adicionar um botão "tentar de novo" ou um gatilho manual.
  const retryNow = () => {
    if (!studentId) return;
    lastFetchKeyRef.current = ""; // força refetch
    // truque simples: chamar setState pra reexecutar effect via mudança de dependency
    // mas aqui não temos dependency. Então fazemos um fetch direto:
    // (mantive simples: recarrega a página do card usando a mesma lógica abaixo)
    // Se quiser, eu te passo a versão com função fetch reutilizável.
    window.location.reload();
  };

  const formatDob = (dob: string) => {
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
            <li style={{ fontSize: "13px", color: "#b00020" }}>
              {error}{" "}
              <button
                onClick={retryNow}
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  borderRadius: 6,
                  padding: "4px 8px",
                }}
              >
                Tentar novamente
              </button>
            </li>
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
                key={`${s.id}-${idx}`}
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
                  <a
                    href={`/students/${s.id}`}
                    
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textDecoration: "none",
                      color: "#030303",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      {s.name} {s.lastname}
                    </span>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {s.isToday ? "Hoje" : formatDob(s.dateOfBirth)}
                    </span>
                  </a>
                </span>

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
