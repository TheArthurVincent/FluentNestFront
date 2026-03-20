import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";

type BoardProps = {
  headers: MyHeadersType;
  theBoard?: string;
  evendId: string;
  allowedToEdit?: boolean;
};

const Board: FC<BoardProps> = ({
  headers,
  theBoard,
  evendId,
  allowedToEdit,
}) => {
  const [editorKey, setEditorKey] = useState(0); // Force re-render key
  const [editorContent, setEditorContent] = useState<string>(theBoard || ``);
  const [newHWDescription, setNewHWDescription] = useState(theBoard || ``);
  const [loading, setLoading] = useState(false);
  const handleHWDescriptionChange = (htmlContent: any) => {
    setNewHWDescription(htmlContent);
  };

  const handleSaveBoard = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/event-board/${evendId}`,
        { board: newHWDescription, date: new Date() },
        { headers: headers as any },
      );
      setLoading(false);
      // notifyAlert("Notas salvas com sucesso!", partnerColor());
    } catch (error) {
      setLoading(false);
      console.error(error, "Erro ao buscar comentários");
    }
  };

  useEffect(() => {
    // ao clicar ctrl + s, salvar a Notas
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (allowedToEdit) {
          handleSaveBoard();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [theBoard, allowedToEdit, newHWDescription]);

  return (
    <>
      <div
        style={{
          ...cardBase,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            ...cardTitle,
            justifyContent: "space-between",
          }}
        >
          <span>Anotações da Aula</span>
        </div>
        {allowedToEdit ? (
          <div
            style={{
              marginBottom: 10,
              height: 500,
            }}
          >
            <HTMLEditor
              key={editorKey}
              initialContent={editorContent}
              onChange={handleHWDescriptionChange}
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: editorContent }} />
        )}
        {allowedToEdit && (
          <button
            onClick={handleSaveBoard}
            style={{
              padding: "8px 16px",
              backgroundColor: loading ? "#6c757d" : partnerColor(),
              color: "#fff",
              marginTop: 18,
              maxWidth: "fit-content",
              border: "none",
              marginLeft: "auto",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {loading ? "Salvando..." : "Salvar Notas"}
          </button>
        )}
      </div>
    </>
  );
};

export default Board;
