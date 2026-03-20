import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import ListOfStudentsHWToClick from "./StudentsHWList";
import AllPendingHomeworkAssignments from "../../../Homework/AllPendingHomeworkAssignments";

type HWUpProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  actualHeaders?: any;
};

export const newArvinTitleStyle: React.CSSProperties = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: 24,
  letterSpacing: "0%",
};

type TabKey = "students" | "pending";

export function HWUp({
  actualHeaders,
  change = false,
  setChange,
  isDesktop,
}: HWUpProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("students");

  const tabs = useMemo(
    () => [
      { key: "students" as const, label: "Alunos" },
      { key: "pending" as const, label: "Pendências" },
    ],
    [],
  );

  const cardStyle: React.CSSProperties = {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "14px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    margin: !isDesktop ? "12px" : "0px",
    border: "1px solid #e8eaed",
    padding: "10px",
  };

  const tabBarWrap: React.CSSProperties = {
    display: "flex",
    gap: 8,
    padding: 6,
    borderRadius: 12,
    border: "1px solid #e8eaed",
    backgroundColor: "#fafafa",
    marginBottom: 10,
  };

  const tabButtonBase: React.CSSProperties = {
    flex: 1,
    borderRadius: 10,
    border: "1px solid transparent",
    padding: "10px 12px",
    cursor: "pointer",
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 700,
    fontSize: 13,
    transition: "all 160ms ease",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    lineHeight: 1,
  };

  const activeBtn: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #e8eaed",
    boxShadow: "0px 6px 18px rgba(0,0,0,0.06)",
    color: "#111827",
  };

  const inactiveBtn: React.CSSProperties = {
    backgroundColor: "transparent",
    color: "#6b7280",
  };

  const topTitleWrap: React.CSSProperties = {
    paddingTop: 29,
    paddingBottom: 17,
    display: "flex",
    alignItems: "center",
  };

  const topTitleSection: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "8px",
    width: "100%",
    fontSize: "1.5rem",
  };

  return (
    <div style={{ margin: !isDesktop ? "0px" : "0px 16px 0px 0px" }}>
      {isDesktop && (
        <div style={topTitleWrap}>
          <section style={topTitleSection}>
            <span style={newArvinTitleStyle}>Lição de Casa</span>
          </section>
        </div>
      )}

      <div style={cardStyle}>
        {/* Tabs do portal (sem MUI) */}
        <div style={tabBarWrap}>
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                style={{
                  ...tabButtonBase,
                  ...(isActive ? activeBtn : inactiveBtn),
                }}
                onMouseEnter={(e) => {
                  if (isActive) return;
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(255,255,255,0.65)";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "1px solid rgba(232,234,237,1)";
                }}
                onMouseLeave={(e) => {
                  if (isActive) return;
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "1px solid transparent";
                }}
                aria-pressed={isActive}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        {activeTab === "students" ? (
          <ListOfStudentsHWToClick
            headers={actualHeaders}
            actualHeaders={actualHeaders}
            change={change}
            setChange={setChange}
            isDesktop={isDesktop}
          />
        ) : (
          <AllPendingHomeworkAssignments
            headers={actualHeaders}
            setChange={setChange}
            change={change}
            isDesktop={isDesktop}
          />
        )}
      </div>

      {isDesktop && (
        <div style={{ minHeight: 200 }}>
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default HWUp;
