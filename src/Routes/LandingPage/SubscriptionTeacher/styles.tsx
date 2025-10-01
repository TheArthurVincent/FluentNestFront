import silver from "./assets/teacherssilver.png";
import gold from "./assets/goldteacher.png";
import { partnerColor } from "../../../Styles/Styles";

export const planCardBase = {
  flex: 1,
  padding: "20px",
  borderRadius: "4px",
  textAlign: "center",
  transition: "all 0.3s ease",
};

export const selectedStyle = {
  border: `2px solid #ed5914`,
  backgroundColor: "#ed5914",
  color: "#fff",
};

export const unselectedStyle = {
  border: "1px solid #ccc",
  backgroundColor: "#fafafa",
};

const cardBase = {
  position: "relative" as const,
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  textAlign: "center" as const,
  minHeight: 190,
  userSelect: "none" as const,
  outline: "none" as const,
};

const cardSelected = {
  border: "1px solid #ed5914",
  boxShadow: "0 10px 22px #ff510048",
};

const imgBase = {
  width: 85,
  height: 85,
  objectFit: "contain" as const,
};

const priceBase = {
  fontSize: 16,
  color: "#475569",
  marginTop: 6,
};

const badgeBase = {
  position: "absolute" as const,
  top: 10,
  right: 10,
  fontSize: 11,
  background: "#ed5914",
  color: "#fff",
  borderRadius: "4px",
  padding: "4px 8px",
};

// ✅ 2) Agora crie seu objeto de estilos final SEM usar ...styles dentro dele
export const styles: any = {
  // bases reaproveitáveis
  cardBase,
  cardSelected,
  img: imgBase,
  price: priceBase,
  badge: badgeBase,

  // container geral
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  },

  // grid antigo (se precisar manter)
  planContainer: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    justifyContent: "center",
    marginBottom: "20px",
  },
  planContainer2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    alignItems: "stretch",
  },

  // ✅ novos para os botões lado a lado
  planButtonsRow: {
    display: "flex",
    flexWrap: "nowrap",
    gap: 16,
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 16,
  },
  tierButtonMinimal: {
    ...cardBase,
    width: 150,
    minHeight: 150,
    padding: 12,
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  },
  tierTitle: {
    fontWeight: 500,
    fontSize: 24,
    fontFamily: "Teko",
    color: "#111827",
  },
  tierPriceMini: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  detailsPanel: {
    padding: "20px 0",
  },

  // outros que você já tinha
  planCard: {
    flex: 1,
    padding: "20px",
    borderRadius: "4px",
    textAlign: "center",
    transition: "all 0.3s ease",
    backgroundColor: "#fafafa",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "100%",
    maxWidth: "1100px",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr", gap: "5px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr", gap: "5px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr", gap: "5px" },
  column: {
    display: "flex",
    flexDirection: "column",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "4px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: "auto",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#ed5914",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "20px",
    textDecoration: "none",
  },
  error: { color: "red", fontSize: 20, fontWeight: 600, marginTop: "10px" },
  responsiveGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "5px" },
};

export const theTitle = {
  fontFamily: "Teko, sans-serif",
  fontSize: "32px",
  marginBottom: "20px",
  color: partnerColor(),
};
export function formatDate(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 8);
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];
    let formatted = day;
    if (month) formatted += "/" + month;
    if (year) formatted += "/" + year;
    return formatted;
  }
  return cleaned;
}
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}.${match[3]}-${match[4]}`;
  }
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 3) return `(${cleaned.slice(0, 2)}) ${cleaned[2]}`;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)}.${cleaned.slice(
      3
    )}`;
  if (cleaned.length <= 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)}.${cleaned.slice(
      3,
      7
    )}-${cleaned.slice(7)}`;
  return value;
}
export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
    6,
    9
  )}-${cleaned.slice(9)}`;
}

export type PlanTier = "silver" | "gold";

export const PRICES = {
  silver: { monthly: 89.99, yearly: 899.99 },
  gold: { monthly: 149.99, yearly: 1499.99 },
};
export const monthlyPrice = (planTier: PlanTier) => PRICES[planTier].monthly;
export const yearlyPrice = (planTier: PlanTier) => PRICES[planTier].yearly;
export const formatBRL = (v: number) =>
  Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export const inputStyle = {
  "& .MuiOutlinedInput-root": {
    fontSize: "0.9rem",
    "& fieldset": {
      borderColor: "#ed5914",
    },
    "&:hover fieldset": {
      borderColor: "#ed5914",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ed5914",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#ed5914",
    fontSize: "0.85rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#ed5914",
  },
};

type InputField = {
  label: string;
  name: FieldName;
  type?: React.InputHTMLAttributes<unknown>["type"];
  inputProps?: React.InputHTMLAttributes<unknown>;
};
export const inputFields = [
  { label: "Nome", name: "name" },
  { label: "Sobrenome", name: "lastname" },
  { label: "Telefone (com DDD)", name: "phoneNumber", type: "tel" },
  { label: "E-mail", name: "email", inputProps: { inputMode: "email" } },
  {
    label: "Data de Nascimento (DD/MM/AAAA)",
    name: "dateOfBirth",
    inputProps: { maxLength: 10, inputMode: "numeric" },
  },
  {
    label: "CPF",
    name: "doc",
    inputProps: { maxLength: 15, inputMode: "numeric" },
  },
  {
    label: "Número do Cartão",
    name: "creditCardNumber",
    inputProps: { maxLength: 19, inputMode: "numeric" },
  },
  { label: "Nome Impresso no Cartão", name: "creditCardHolderName" },
  {
    label: "Mês de Expiração (MM)",
    name: "creditCardExpiryMonth",
    inputProps: { maxLength: 2, inputMode: "numeric" },
  },
  {
    label: "Ano de Expiração (AAAA)",
    name: "creditCardExpiryYear",
    inputProps: { maxLength: 4, inputMode: "numeric" },
  },
  {
    label: "CVV",
    name: "creditCardCcv",
    inputProps: { maxLength: 4, inputMode: "numeric" },
  },
  {
    label: "CEP",
    name: "zip",
    inputProps: { maxLength: 8, inputMode: "numeric" },
  },
  { label: "Rua", name: "address" },
  { label: "Número", name: "addressNumber" },
  { label: "Bairro", name: "neighborhood" },
  { label: "Cidade", name: "city" },
  { label: "Estado (UF)", name: "state" },
  {
    label: "Senha (mínimo 8 caracteres)",
    name: "password",
    type: "password",
    inputProps: { maxLength: 15 },
  },
  {
    label: "Confirme sua Senha (mínimo 8 caracteres)",
    name: "confirmPassword",
    type: "password",
    inputProps: { maxLength: 15 },
  },
] satisfies ReadonlyArray<InputField>;

type PaymentMethod = "CREDIT_CARD" | "PIX" | "BOLETO";

export interface Form {
  name: string;
  promoCode: string;
  lastname: string;
  phoneNumber: string;
  doc: string;
  email: string;
  dateOfBirth: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  addressNumber: string;
  zip: string;
  creditCardNumber: string;
  creditCardHolderName: string;
  creditCardExpiryMonth: string;
  creditCardExpiryYear: string;
  creditCardCcv: string;
  password: string;
  confirmPassword: string;
}

export type FieldName = keyof Form;

export type Props = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paymentMethod: PaymentMethod;
};

export const requiredIfCC = new Set<FieldName>([
  "creditCardNumber",
  "creditCardHolderName",
  "creditCardExpiryMonth",
  "creditCardExpiryYear",
  "creditCardCcv",
  "zip",
  "address",
  "addressNumber",
  "neighborhood",
  "city",
  "state",
]);

export const getWhatsAppLink = (selectedPlan: string) => {
  const message = `Olá, gostaria de fazer o pagamento da plataforma Arvin no plano ${selectedPlan} Gold à vista via PIX.`;
  return `https://wa.me/5511972369299?text=${encodeURIComponent(message)}`;
};

export const FEATURES: Record<
  "silver" | "gold",
  { title: string; value: string | number; status?: string | number }[]
> = {
  silver: [
    { title: "Limite de alunos particulares", value: 30 },
    { title: "Aulas prontas para lecionar", value: "", status: "Sim" },
    {
      title: "Materiais disponíveis para os alunos",
      value: "",
      status: "Não",
    },
    { title: "Gerenciamento de alunos", value: "", status: "Sim" },
    {
      title: "Curso para professores particulares",
      value: "",
      status: "Sim",
    },
    { title: "Gestão Financeira", value: "", status: "Sim" },

    { title: "Limite de revisão de flashcards/dia", value: 25 },
    { title: "Área de responsáveis", value: "", status: "Não" },
    // { title: "Listening exercise", value: "", status: "Não" },
    // { title: "Cadastro de subteachers", value: "", status: "Não" },
    { title: "Emissão de contratos", value: "", status: "Não" },
    {
      title: "Personalização Visual da Plataforma",
      value: "",
      status: "Não",
    },
    { title: "Emissão de recibos", value: "", status: "Sim" },
    { title: "Assistente de IA (Acumulativo)", value: "25 tokens/mês" },
  ],
  gold: [
    {
      title: "Limite de alunos particulares",
      value: "100 (com a possibilidade de adquirir mais)",
    },
    { title: "Aulas prontas para lecionar", value: "", status: "Sim" },
    {
      title: "Materiais disponíveis para os alunos",
      value: "",
      status: "Sim",
    },
    { title: "Gerenciamento de alunos", value: "", status: "Sim" },
    {
      title: "Curso para professores particulares",
      value: "",
      status: "Sim",
    },
    { title: "Gestão Financeira", value: "", status: "Sim" },
    { title: "Limite de revisão de flashcards/dia", value: "Sem limites" },
    { title: "Área de responsáveis", value: "", status: "Sim" },
    // { title: "Listening exercise", value: "", status: "Sim" },
    // { title: "Cadastro de subteachers", value: "", status: "Sim" },
    { title: "Emissão de contratos", value: "", status: "Sim" },
    {
      title: "Personalização Visual da Plataforma",
      value: "",
      status: "Sim",
    },
    { title: "Emissão de recibos", value: "", status: "Sim" },
    { title: "Assistente de IA (Acumulativo)", value: "1.200 tokens/mês" },
  ],
};

export const TIER_META: Record<
  "silver" | "gold",
  { title: string; img: string; bg: string; price: number }
> = {
  silver: { title: "Silver", img: silver, bg: "#c0c0c055", price: 899.99 },
  gold: {
    title: "Gold",
    img: gold,
    bg: "#ffd90064",

    price: 1499.99,
  },
};
