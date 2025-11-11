import {
  BookIcon,
  CalendarIcon,
  CardsIcon,
  GearIcon,
  NotebookIcon,
  SignOutIcon,
  SparkleIcon,
  TrophyIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
export type MenuItem = {
  label: string;
  path: string;
  Icon: any;
  justBottom?: boolean;
  admin?: boolean;
  isMobile?: boolean;
};
export const menuItems: MenuItem[] = [
  {
    label: "Início",
    Icon: SparkleIcon,
    path: "/",
    isMobile: true,
  },
  {
    label: "Lições & Aula",
    Icon: NotebookIcon,
    path: "/my-homework-and-lessons",
    isMobile: true,
  },
  {
    label: "Ranking",
    Icon: TrophyIcon,
    path: "/ranking",
    isMobile: false,
  },
  {
    label: "Materiais de Aula",
    Icon: BookIcon,
    path: "/teaching-materials",
    isMobile: true,
  },
  {
    label: "Flashcards",
    Icon: CardsIcon,
    path: "/flash-cards",
    isMobile: true,
  },
  {
    label: "Calendário",
    Icon: CalendarIcon,
    path: "/my-calendar",
    isMobile: true,
  },
  {
    label: "Perfil",
    Icon: UserCircleIcon,
    path: "/my-profile",
  },
  {
    label: "Configurações",
    Icon: GearIcon,
    path: "/configuracoes",
    justBottom: true,
    admin: true,
  },
  {
    label: "Sair",
    Icon: SignOutIcon,
    path: "/login",
    justBottom: true,
    isMobile: false,
  },
];
