import React, { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { createPortal } from "react-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { pillStatus } from "../../Students/TheStudent/types/studentPage.styles";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";

type DeleteClassProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
  lastLesson?: any;
  evendId?: string;
  allowedToEdit?: boolean;
};

const DeleteClass: FC<DeleteClassProps> = ({
  headers,
  isDesktop,
  lastLesson,
  evendId,
  allowedToEdit,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteModal = () => {
    if (!allowedToEdit || !evendId) return;
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!evendId) {
      notifyAlert("ID do evento não encontrado.", partnerColor());
      return;
    }

    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;

    if (thePermissions !== "superadmin" && thePermissions !== "teacher") {
      notifyAlert(
        "Você não tem permissão para excluir esta aula.",
        partnerColor(),
      );
      return;
    }

    try {
      setIsDeleting(true);

      await axios.delete(`${backDomain}/api/v1/event/${evendId}`, {
        headers: headers as any,
      });

      notifyAlert("Aula excluída com sucesso.", partnerColor());
      window.location.assign("/my-calendar");
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao excluir a aula.", partnerColor());
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const deleteModal =
    showDeleteModal &&
    createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
        }}
        onClick={handleCloseDeleteModal}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 10,
            padding: 20,
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            fontFamily: "Plus Jakarta Sans",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Excluir aula?
          </h3>

          <p
            style={{
              fontSize: 13,
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            Tem certeza de que deseja excluir esta aula? Essa ação não pode ser
            desfeita.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 8,
            }}
          >
            <button
              onClick={handleCloseDeleteModal}
              disabled={isDeleting}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "#DC2626",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                opacity: isDeleting ? 0.7 : 1,
              }}
            >
              {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {allowedToEdit && evendId && (
        <button
          style={{
            borderRadius: 8,
            backgroundColor: "#DC2626",
            color: "#FFFFFF",
            fontWeight: 600,
            border: "none",
            maxWidth: "fit-content",
            maxHeight: "fit-content",
            cursor: "pointer",
            padding: "6px 12px",
            fontSize: 12,
          }}
          onClick={handleOpenDeleteModal}
        >
          Excluir esta aula
        </button>
      )}
      {isDesktop && (
        <div
          style={{
            minHeight: 200,
          }}
        >
          <Outlet />
        </div>
      )}
      {deleteModal}
    </>
  );
};

export default DeleteClass;
