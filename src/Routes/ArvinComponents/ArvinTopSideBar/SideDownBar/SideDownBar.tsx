import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { partnerColor } from "../../../../Styles/Styles";
import { onLoggOut } from "../../../../Resources/UniversalComponents";
import { menuItems } from "./menuItems";

export type MenuItem = {
  label: string;
  father?: string | null;
  showInBottomBar?: boolean;
  path: string;
  Icon: any;
  justBottom?: boolean;
  admin?: boolean;
  isMobile?: boolean;
  isJustStudent?: boolean;
  orderMobile?: number;
  currentPath?: string;
  showSideBarOnly?: boolean;
  bgActive?: string;
  orderSideBar?: number;
};

type SidebarGroup = {
  type: "group";
  label: string;
  order: number;
  items: MenuItem[];
  Icon: any;
};

type SidebarNode =
  | { type: "item"; order: number; item: MenuItem }
  | SidebarGroup;

interface ArvinSideDownBarProps {
  isDesktop?: boolean;
  admin?: boolean;
  collapsed?: boolean;
}

const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "null");
const permissions = loggedIn?.permissions; // "student" | ...
const studentId = loggedIn?.id;

function normalize(p: string) {
  return p.replace(/\/+$/, "") || "/";
}

function canShowItem(item: MenuItem, admin?: boolean) {
  if (item.admin && !admin) return false;
  if (item.isJustStudent && permissions !== "student") return false;
  return true;
}

function buildSidebarModel(items: MenuItem[], admin?: boolean): SidebarNode[] {
  const standalone: MenuItem[] = [];
  const grouped = new Map<string, MenuItem[]>();

  for (const it of items) {
    if (!canShowItem(it, admin)) continue;

    if (!it.father) standalone.push(it);
    else {
      const arr = grouped.get(it.father) || [];
      arr.push(it);
      grouped.set(it.father, arr);
    }
  }

  const groupNodes: SidebarGroup[] = Array.from(grouped.entries()).map(
    ([fatherLabel, children]) => {
      const sortedChildren = children
        .slice()
        .sort((a, b) => (a.orderSideBar || 0) - (b.orderSideBar || 0));

      return {
        type: "group",
        label: fatherLabel,
        order: sortedChildren[0]?.orderSideBar ?? 9999,
        items: sortedChildren,
        Icon: sortedChildren[0]?.Icon,
      };
    },
  );

  const standaloneNodes: SidebarNode[] = standalone
    .slice()
    .sort((a, b) => (a.orderSideBar || 0) - (b.orderSideBar || 0))
    .map((item) => ({
      type: "item",
      order: item.orderSideBar ?? 9999,
      item,
    }));

  return [...standaloneNodes, ...groupNodes].sort((a, b) => a.order - b.order);
}

// Quando colapsado: some "pai" e os subitens viram itens normais (só ícone)
function flattenIfCollapsed(
  nodes: SidebarNode[],
  collapsed?: boolean,
): SidebarNode[] {
  if (!collapsed) return nodes;

  const flat: SidebarNode[] = [];
  for (const n of nodes) {
    if (n.type === "item") {
      flat.push(n);
    } else {
      for (const child of n.items) {
        flat.push({
          type: "item",
          order: child.orderSideBar ?? 9999,
          item: child,
        });
      }
    }
  }

  return flat.sort((a, b) => a.order - b.order);
}

const ParentHeader: FC<{
  label: string;
  Icon: any;
  collapsed?: boolean;
  baseTextColor: string;
  bgHover: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({
  label,
  Icon,
  collapsed,
  baseTextColor,
  bgHover,
  expanded,
  onToggle,
}) => {
  return (
    <li
      onClick={() => {
        if (!collapsed) onToggle();
      }}
      style={{
        listStyleType: "none",
        display: "grid",
        alignItems: "center",
        borderRadius: "6px",
        padding: collapsed ? "10px 0" : "8px 12px",
        backgroundColor: "transparent",
        justifyItems: collapsed ? "center" : "stretch",
        cursor: collapsed ? "default" : "pointer",
        userSelect: "none",
        transition: "background-color 0.15s ease-in-out",
      }}
      onMouseOver={(e) => {
        if (!collapsed) e.currentTarget.style.backgroundColor = bgHover;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Icon color={baseTextColor} weight="bold" size={20} />

        {!collapsed && (
          <span
            style={{
              fontFamily: "Lato",
              fontWeight: 600,
              fontSize: 14,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: baseTextColor,
              marginLeft: 12,
              whiteSpace: "nowrap",
              opacity: 0.85,
              textTransform: "none",
            }}
          >
            {label}
          </span>
        )}

        {!collapsed && (
          <span
            style={{
              marginLeft: "auto",
              opacity: 0.55,
              fontSize: 12,
              fontFamily: "Lato",
              fontWeight: 700,
            }}
          >
            {expanded ? "–" : "+"}
          </span>
        )}
      </div>
    </li>
  );
};

const ItemRow: FC<{
  item: MenuItem;
  admin?: boolean;
  currentPath: string;
  bgActive: string;
  bgHover: string;
  baseTextColor: string;
  partnerColor: () => string;
  collapsed?: boolean;
  hideIcon?: boolean;
  compact?: boolean;
  indent?: number;
}> = ({
  item,
  admin,
  currentPath,
  bgActive,
  bgHover,
  baseTextColor,
  partnerColor,
  collapsed,
  hideIcon,
  compact,
  indent = 0,
}) => {
  const curr = normalize(currentPath);
  const target = normalize(item.path);

  const active =
    target === "/"
      ? curr === "/"
      : curr === target || curr.startsWith(`${target}/`);

  const showItem = item.admin ? !!admin : true;
  const iconSize = collapsed ? 16 : compact ? 14 : 20;

  return (
    <li
      onClick={() => {
        if (item.label === "Sair") onLoggOut();
      }}
      style={{
        listStyleType: "none",
        display: showItem ? "grid" : "none",
        alignItems: "center",
        borderRadius: "6px",
        padding: collapsed ? "4px 0" : compact ? "6px 10px" : "8px 12px",
        marginBottom: 2,
        backgroundColor: active ? bgActive : "transparent",
        transition: "background-color 0.15s ease-in-out",
        justifyItems: collapsed ? "center" : "stretch",
        marginLeft: collapsed ? 0 : indent,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = bgHover;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = active
          ? bgActive
          : "transparent";
      }}
    >
      <Link
        to={item.path}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {(!hideIcon || !!collapsed) && (
          <item.Icon
            color={active ? partnerColor() : baseTextColor}
            weight="bold"
            size={collapsed ? 12 : iconSize}
          />
        )}

        {!collapsed && (
          <span
            style={{
              fontFamily: "Lato",
              fontWeight: 600,
              fontStyle: "SemiBold",
              fontSize: compact ? 12.5 : 14,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: baseTextColor,
              marginLeft: !hideIcon || !!collapsed ? "12px" : 0,
              whiteSpace: "nowrap",
              textTransform: compact ? "capitalize" : "none",
            }}
          >
            {item.label}
          </span>
        )}
      </Link>
    </li>
  );
};

function getDefaultOpenGroups(): Record<string, boolean> {
  if (permissions === "student") return { Estudos: true };
  return { Histórico: true };
}

export const ArvinSideDownBar: FC<ArvinSideDownBarProps> = ({
  isDesktop,
  admin,
  collapsed,
}) => {
  const location = useLocation();
  const currentPath = normalize(location.pathname);

  const bgActive = `${partnerColor()}09`;
  const bgHover = `${partnerColor()}07`; // hover leve
  const baseTextColor = "#030303";

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(getDefaultOpenGroups);

  const isActivePath = (path: string) => {
    const curr = normalize(currentPath);
    const target = normalize(path);
    return target === "/"
      ? curr === "/"
      : curr === target || curr.startsWith(`${target}/`);
  };

  const topNodes = useMemo(() => {
    const topItems = menuItems.filter((it) => !(isDesktop && it.justBottom));
    return buildSidebarModel(topItems, admin);
  }, [admin, isDesktop]);

  const bottomNodes = useMemo(() => {
    const bottomItems = menuItems.filter((it) => it.justBottom);
    return buildSidebarModel(bottomItems, admin);
  }, [admin]);

  // auto-abrir turma que contém a rota atual (mas sem sobrescrever escolha do usuário)
  useEffect(() => {
    if (collapsed) return;

    const all = [...topNodes, ...bottomNodes];
    for (const node of all) {
      if (node.type !== "group") continue;

      const hasActiveChild = node.items.some((ch) => isActivePath(ch.path));

      if (hasActiveChild) {
        setOpenGroups((prev) => {
          if (prev[node.label] !== undefined) return prev;
          return { ...prev, [node.label]: true };
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, currentPath, topNodes, bottomNodes]);

  const renderNodes = (nodes: SidebarNode[]) => {
    const list = flattenIfCollapsed(nodes, collapsed);

    return list.map((node, idx) => {
      if (node.type === "item") {
        return (
          <ItemRow
            key={`node-item-${node.item.path}-${idx}`}
            item={node.item}
            admin={admin}
            currentPath={currentPath}
            bgActive={bgActive}
            bgHover={bgHover}
            baseTextColor={baseTextColor}
            partnerColor={partnerColor}
            collapsed={!!collapsed}
          />
        );
      }

      // Só chega aqui quando NÃO colapsado
      const hasActiveChild = node.items.some((ch) => isActivePath(ch.path));
      const manuallyExpanded = openGroups[node.label] ?? false;
      const expanded = manuallyExpanded;
      const shouldShowOnlyActiveChild = !manuallyExpanded && hasActiveChild;

      const visibleChildren = expanded
        ? node.items
        : shouldShowOnlyActiveChild
          ? node.items.filter((ch) => isActivePath(ch.path))
          : [];
      return (
        <li
          key={`node-group-${node.label}-${idx}`}
          style={{ listStyleType: "none", padding: 0, margin: 0 }}
        >
          <ul style={{ padding: 0, margin: 0 }}>
            <ParentHeader
              label={node.label}
              Icon={node.Icon}
              collapsed={!!collapsed}
              baseTextColor={baseTextColor}
              bgHover={bgHover}
              expanded={expanded}
              onToggle={() => {
                setOpenGroups((prev) => {
                  const isOpenNow = prev[node.label] ?? hasActiveChild;
                  if (isOpenNow) return { [node.label]: false };
                  return { [node.label]: true };
                });
              }}
            />
          </ul>

          <ul
            style={{
              display: expanded || shouldShowOnlyActiveChild ? "grid" : "none",
              padding: 0,
              margin: 0,
              gap: 6,
            }}
          >
            {visibleChildren.map((child, cidx) => (
              <ItemRow
                key={`node-child-${child.path}-${cidx}`}
                item={child}
                admin={admin}
                currentPath={currentPath}
                bgActive={bgActive}
                bgHover={bgHover}
                baseTextColor={baseTextColor}
                partnerColor={partnerColor}
                collapsed={!!collapsed}
                hideIcon
                compact
                indent={12}
              />
            ))}
          </ul>
        </li>
      );
    });
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: isDesktop ? "calc(90vh - 128px)" : "auto",
      }}
      aria-label="Menu lateral"
    >
      <ul style={{ display: "grid", padding: 0, margin: 0, gap: 6 }}>
        {renderNodes(topNodes)}
      </ul>

      <ul
        style={{
          display: isDesktop ? "grid" : "none",
          padding: 0,
          margin: 0,
          gap: 6,
        }}
      >
        {renderNodes(bottomNodes)}
      </ul>
    </nav>
  );
};
