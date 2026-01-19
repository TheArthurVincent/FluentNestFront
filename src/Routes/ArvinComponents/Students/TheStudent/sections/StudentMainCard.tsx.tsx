// Routes/ArvinComponents/Students/sections/StudentMainCard.tsx
import React, { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";

import { StudentItem } from "../types/studentsTypes";
import { cardBase } from "../types/studentPage.styles";
import { partnerColor } from "../../../../../Styles/Styles";
import { backDomain } from "../../../../../Resources/UniversalComponents";

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  ...inputProps
}) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: "#334155",
        cursor: inputProps.disabled ? "not-allowed" : "pointer",
      }}
    >
      <input
        type="checkbox"
        {...inputProps}
        style={{
          width: 16,
          height: 16,
          cursor: inputProps.disabled ? "not-allowed" : "pointer",
        }}
      />
      <span>{label}</span>
    </label>
  );
};

interface StudentMainCardProps {
  student: StudentItem;
  headers?: Record<string, string>;
  /** opcional: atualiza o aluno no pai após salvar */
  onStudentUpdated?: (student: StudentItem) => void;
}

export const StudentMainCard: FC<StudentMainCardProps> = ({
  student,
  headers,
  onStudentUpdated,
}) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editName, setEditName] = useState(student.name || "");
  const [editLastname, setEditLastname] = useState(student.lastname || "");
  const [editEmail, setEditEmail] = useState(student.email || "");
  const [editAddress, setEditAddress] = useState(student.address || "");
  const [editPhone, setEditPhone] = useState(student.phoneNumber || "");
  const [editDoc, setEditDoc] = useState((student as any).doc || "");
  const [editDateOfBirth, setEditDateOfBirth] = useState<string>("");
  const [editFee, setEditFee] = useState(student.fee || 0);
  const [editUpToDate, setEditUpToDate] = useState(
    student.feeUpToDate || false,
  );
  const [googleDriveLink, setGoogleDriveLink] = useState(
    student.googleDriveLink || "",
  );
  const [onHold, setOnHold] = useState(student.onHold || false);

  // ====== estados pro modal de senha ======
  const [openPwd, setOpenPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ====== DELETE (danger zone) ======
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const firstFocusableRef = useRef<HTMLInputElement | null>(null);
  const firstPwdRef = useRef<HTMLInputElement | null>(null);

  const studentFirstName = (student?.name || "")
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  const isDeleteConfirmValid =
    deleteConfirmText.trim().toLowerCase() === studentFirstName;

  // Inicializa a data de nascimento em formato yyyy-MM-dd (para <input type="date" />)
  useEffect(() => {
    console.log(student);
    const raw = (student as any).dateOfBirth;
    if (!raw) return;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setEditDateOfBirth(`${yyyy}-${mm}-${dd}`);
    }
  }, [student]);

  // ESC para fechar e Ctrl+Enter / Cmd+Enter para salvar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (open && !saving && !deleting) setOpen(false);
        if (openPwd && !savingPwd) setOpenPwd(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        if (open && !saving) {
          handleSave();
        }
        if (openPwd && !savingPwd) {
          handleSavePassword();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    if (open) {
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
    }
    if (openPwd) {
      setTimeout(() => firstPwdRef.current?.focus(), 0);
    }
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, saving, openPwd, savingPwd, deleting]);

  const openModal = () => {
    setErrorMsg(null);

    // reset delete flow
    setDeleteMode(false);
    setDeleteError(null);
    setDeleteConfirmText("");
    setDeleting(false);

    setEditName(student.name || "");
    setEditFee(student.fee || 0);
    setEditUpToDate(student.feeUpToDate || false);
    setGoogleDriveLink(student.googleDriveLink || "");
    setOnHold(student.onHold || false);
    setEditLastname(student.lastname || "");
    setEditEmail(student.email || "");
    setEditAddress(student.address || "");
    setEditPhone(student.phoneNumber || "");
    setEditDoc((student as any).doc || "");

    const raw = (student as any).dateOfBirth;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setEditDateOfBirth(`${yyyy}-${mm}-${dd}`);
      }
    } else {
      setEditDateOfBirth("");
    }

    setOpen(true);
  };

  const closeModal = () => {
    if (saving || deleting) return;
    setOpen(false);
    setDeleteMode(false);
    setDeleteError(null);
    setDeleteConfirmText("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);

      const payload: any = {
        name: editName,
        lastname: editLastname,
        fee: editFee,
        feeUpToDate: editUpToDate,
        googleDriveLink: googleDriveLink,
        onHold: onHold,
        email: editEmail,
        address: editAddress,
        phoneNumber: editPhone,
        dateOfBirth: editDateOfBirth || null,
        doc: editDoc,
      };

      const url = `${backDomain}/api/v1/students/${student.id}`;

      const response = await axios.put(url, payload, {
        headers: headers ? { ...headers } : {},
      });

      const updatedUser = response.data?.updatedUser || null;

      if (updatedUser && onStudentUpdated) {
        onStudentUpdated(updatedUser);
      }

      setOpen(false);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao salvar alterações do aluno.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
      window.location.reload();
    }
  };

  // ====== PASSWORD MODAL HANDLERS ======
  const openPasswordModal = () => {
    setPwdError(null);
    setPwdSuccess(null);
    setNewPassword("");
    setConfirmPassword("");
    setOpenPwd(true);
  };

  const closePasswordModal = () => {
    if (savingPwd) return;
    setOpenPwd(false);
  };

  const handleSavePassword = async () => {
    try {
      setPwdError(null);
      setPwdSuccess(null);

      if (!newPassword || !confirmPassword) {
        setPwdError("Preencha os dois campos de senha.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPwdError("As senhas não conferem.");
        return;
      }
      if (newPassword.length < 6) {
        setPwdError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      setSavingPwd(true);

      const url = `${backDomain}/api/v1/studentpassword/${student.id}`;

      const response = await axios.put(
        url,
        { newPassword },
        {
          headers: headers ? { ...headers } : {},
        },
      );

      const msg = response.data?.message || "Senha editada com sucesso.";
      setPwdSuccess(msg);

      setTimeout(() => {
        setOpenPwd(false);
      }, 800);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao editar senha do aluno.";
      setPwdError(msg);
    } finally {
      setSavingPwd(false);
    }
  };

  // ====== DELETE FLOW HANDLERS ======
  const startDeleteFlow = () => {
    if (saving) return;
    setDeleteError(null);
    setDeleteConfirmText("");
    setDeleteMode(true);
  };

  const cancelDeleteFlow = () => {
    if (deleting) return;
    setDeleteError(null);
    setDeleteConfirmText("");
    setDeleteMode(false);
  };

  const handleDeleteStudent = async () => {
    try {
      if (!isDeleteConfirmValid) return;

      setDeleting(true);
      setDeleteError(null);

      const url = `${backDomain}/api/v1/students/${student.id}`;
      await axios.delete(url, { headers: headers ? { ...headers } : {} });

      setOpen(false);
      window.location.assign("/students");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao excluir aluno.";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const renderModal = () => {
    if (typeof document === "undefined") return null;
    if (!open) return null;

    const modal = (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-student-title"
        onClick={(e) => {
          if (e.target === e.currentTarget && !saving && !deleting)
            closeModal();
        }}
        style={{
          position: "fixed",
          inset: 0,
          top: 0,
          left: 0,
          margin: "0 auto",
          width: "100vw",
          height: "100vh",
          background: "rgba(17,24,39,0.45)",
          display: "grid",
          placeItems: "center",
          zIndex: 99999,
          padding: "16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #eef2f7",
              background: "#f8fafc",
            }}
          >
            <h3
              id="edit-student-title"
              style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}
            >
              {deleteMode ? "Excluir Aluno" : "Editar Aluno"}
            </h3>
            <button
              onClick={() => !saving && !deleting && closeModal()}
              aria-label="Fechar"
              style={{
                border: "none",
                background: "transparent",
                cursor: saving || deleting ? "not-allowed" : "pointer",
                padding: "6px",
                color: "#64748b",
              }}
            >
              <i className="fa fa-times" />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "16px", display: "grid", gap: "12px" }}>
            {!deleteMode ? (
              <>
                {errorMsg && (
                  <div
                    role="alert"
                    style={{
                      background: "#fef2f2",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "13px",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Nome + Sobrenome */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <Field
                    label="Nome"
                    ref={firstFocusableRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={saving}
                    placeholder="Nome"
                  />
                  <Field
                    label="Sobrenome"
                    type="text"
                    value={editLastname}
                    onChange={(e) => setEditLastname(e.target.value)}
                    disabled={saving}
                    placeholder="Sobrenome"
                  />
                </div>

                {/* Data de nascimento + CPF */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <Field
                    label="Data de nascimento"
                    type="date"
                    value={editDateOfBirth}
                    onChange={(e) => setEditDateOfBirth(e.target.value)}
                    disabled={saving}
                  />
                  <Field
                    label="CPF"
                    type="text"
                    value={editDoc}
                    onChange={(e) => setEditDoc(e.target.value)}
                    disabled={saving}
                    placeholder="000.000.000-00"
                  />
                </div>

                {/* Endereço */}
                <Field
                  label="Endereço"
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  disabled={saving}
                  placeholder="Rua, número, bairro, cidade"
                />

                {/* Email */}
                <Field
                  label="Email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={saving}
                  placeholder="email@exemplo.com"
                />

                {/* Telefone */}
                <Field
                  label="Telefone"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  disabled={saving}
                  placeholder="(11) 99999-9999"
                />

                {/* Mensalidade */}
                <Field
                  label="Mensalidade (R$)"
                  type="number"
                  value={editFee}
                  onChange={(e) => setEditFee(Number(e.target.value))}
                  disabled={saving}
                  placeholder="0,00"
                />

                {/* Flags: em dia / em pausa */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  <CheckboxField
                    label="Mensalidade em dia"
                    checked={editUpToDate}
                    onChange={(e) => setEditUpToDate(e.target.checked)}
                    disabled={saving}
                  />
                  <CheckboxField
                    label="Aluno em pausa (on hold)"
                    checked={onHold}
                    onChange={(e) => setOnHold(e.target.checked)}
                    disabled={saving}
                  />
                </div>

                {/* Link Google Drive */}
                <Field
                  label="Link do Google Drive"
                  type="url"
                  value={googleDriveLink}
                  onChange={(e) => setGoogleDriveLink(e.target.value)}
                  disabled={saving}
                  placeholder="https://drive.google.com/..."
                />
              </>
            ) : (
              <>
                <div
                  role="alert"
                  style={{
                    background: "#fff1f2",
                    color: "#9f1239",
                    border: "1px solid #fecdd3",
                    borderRadius: "12px",
                    padding: "14px 14px",
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong style={{ fontSize: 14 }}>
                      Você está prestes a excluir este aluno.
                    </strong>
                    <span style={{ fontSize: 13, color: "#881337" }}>
                      Todas as aulas pendentes, flashcards e conteúdos serão
                      excluídos. Essa ação não pode ser desfeita.
                    </span>
                  </div>

                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #ffe4e6",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      fontSize: 13,
                      color: "#4c0519",
                    }}
                  >
                    Para confirmar, digite o <strong>primeiro nome</strong> do
                    aluno:{" "}
                    <strong style={{ textTransform: "none" }}>
                      {student?.name?.trim().split(/\s+/)[0] || ""}
                    </strong>
                  </div>

                  <Field
                    label="Digite o primeiro nome para confirmar"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    disabled={deleting}
                    placeholder="Ex: Maria"
                  />

                  {deleteError && (
                    <div
                      role="alert"
                      style={{
                        background: "#fef2f2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "13px",
                      }}
                    >
                      {deleteError}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              padding: "12px 16px",
              borderTop: "1px solid #eef2f7",
              background: "#fafafa",
            }}
          >
            {!deleteMode ? (
              <>
                <button
                  type="button"
                  onClick={startDeleteFlow}
                  disabled={saving}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: "#dc2626",
                    color: "#fff",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Excluir Aluno
                </button>

                <button
                  onClick={closeModal}
                  disabled={saving}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    color: "#334155",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: `1px solid ${partnerColor()}`,
                    background: saving
                      ? `${partnerColor()}50`
                      : `${partnerColor()}`,
                    color: "white",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  {saving ? (
                    <>
                      <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check" aria-hidden="true" />
                      Salvar alterações
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelDeleteFlow}
                  disabled={deleting}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    color: "#334155",
                    cursor: deleting ? "not-allowed" : "pointer",
                    fontSize: "14px",
                  }}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleDeleteStudent}
                  disabled={deleting || !isDeleteConfirmValid}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    background:
                      deleting || !isDeleteConfirmValid ? "#fca5a5" : "#b91c1c",
                    color: "white",
                    cursor:
                      deleting || !isDeleteConfirmValid
                        ? "not-allowed"
                        : "pointer",
                    fontSize: "14px",
                  }}
                >
                  {deleting ? (
                    <>
                      <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-trash" aria-hidden="true" />
                      Excluir definitivamente
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );

    return createPortal(modal, document.body);
  };

  const renderPasswordModal = () => {
    if (typeof document === "undefined") return null;
    if (!openPwd) return null;

    const modal = (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-password-title"
        onClick={(e) => {
          if (e.target === e.currentTarget && !savingPwd) closePasswordModal();
        }}
        style={{
          position: "fixed",
          inset: 0,
          top: 0,
          left: 0,
          margin: "0 auto",
          width: "100vw",
          height: "100vh",
          background: "rgba(17,24,39,0.45)",
          display: "grid",
          placeItems: "center",
          zIndex: 99999,
          padding: "16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #eef2f7",
              background: "#f8fafc",
            }}
          >
            <h3
              id="edit-password-title"
              style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}
            >
              Editar senha
            </h3>
            <button
              onClick={() => !savingPwd && closePasswordModal()}
              aria-label="Fechar"
              style={{
                border: "none",
                background: "transparent",
                cursor: savingPwd ? "not-allowed" : "pointer",
                padding: "6px",
                color: "#64748b",
              }}
            >
              <i className="fa fa-times" />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "16px", display: "grid", gap: "12px" }}>
            {pwdError && (
              <div
                role="alert"
                style={{
                  background: "#fef2f2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "13px",
                }}
              >
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div
                role="status"
                style={{
                  background: "#ecfdf3",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "13px",
                }}
              >
                {pwdSuccess}
              </div>
            )}

            <Field
              label="Nova senha"
              ref={firstPwdRef}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={savingPwd}
            />
            <Field
              label="Confirmar nova senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={savingPwd}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              padding: "12px 16px",
              borderTop: "1px solid #eef2f7",
              background: "#fafafa",
            }}
          >
            <button
              onClick={closePasswordModal}
              disabled={savingPwd}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#334155",
                cursor: savingPwd ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleSavePassword}
              disabled={savingPwd}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `1px solid ${partnerColor()}`,
                background: savingPwd
                  ? `${partnerColor()}50`
                  : `${partnerColor()}`,
                color: "white",
                cursor: savingPwd ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              {savingPwd ? (
                <>
                  <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="fa fa-key" aria-hidden="true" />
                  Salvar senha
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );

    return createPortal(modal, document.body);
  };

  return (
    <>
      <div style={cardBase}>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E0ECFF 0%, #F4E8FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {student.picture ? (
              <img
                src={student.picture}
                alt={student.fullname}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: partnerColor(),
                }}
              >
                {student.name?.[0]}
              </span>
            )}
          </div>
          <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {student.fullname}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#9CA3AF",
              }}
            >
              {student.email}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 8,
            paddingTop: 10,
            borderTop: "1px dashed #E5E7EB",
            display: "grid",
            gap: 8,
            fontSize: 13,
            color: "#4B5563",
          }}
        >
          <Row label="Telefone" value={student.phoneNumber || "-"} />
          <Row label="Endereço" value={student.address || "-"} />
          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                width: 60,
                fontWeight: 600,
                color: "#9CA3AF",
              }}
            >
              Drive
            </span>
            <span style={{ flex: 1 }}>
              {student.googleDriveLink ? (
                <a
                  href={student.googleDriveLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: partnerColor(),
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir pasta
                </a>
              ) : (
                "-"
              )}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            alignContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={openModal}
            style={{
              borderRadius: 8,
              padding: "8px 16px",
              border: "none",
              backgroundColor: partnerColor(),
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Editar aluno
          </button>
          <button
            type="button"
            onClick={openPasswordModal}
            style={{
              borderRadius: 8,
              padding: "8px 16px",
              border: "none",
              backgroundColor: `${partnerColor()}30`,
              color: "#000",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Editar senha
          </button>
        </div>
      </div>

      {renderModal()}
      {renderPasswordModal()}
    </>
  );
};

const Row: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", gap: 8 }}>
    <span
      style={{
        width: 60,
        fontWeight: 600,
        color: "#9CA3AF",
      }}
    >
      {label}
    </span>
    <span style={{ flex: 1 }}>{value}</span>
  </div>
);

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, ...inputProps }, ref) => (
    <label
      style={{
        display: "grid",
        gap: "6px",
        fontSize: "13px",
        color: "#334155",
      }}
    >
      {label}
      <input
        ref={ref}
        {...inputProps}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          outline: "none",
          boxSizing: "border-box",
          ...(inputProps.style || {}),
        }}
      />
    </label>
  ),
);
Field.displayName = "Field";
