import React, { FC, useState } from "react";
import axios from "axios";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

type BoardProps = {
  headers: MyHeadersType;
  theBoard?: string;
  evendId: string;
  date?: string;
};

const Board: FC<BoardProps> = ({ headers, theBoard, evendId, date }) => {
  const [editorKey, setEditorKey] = useState(0); // Force re-render key
  const [editorContent, setEditorContent] = useState<string>(
    theBoard || `Aula do dia ${date}`
  );
  const [newHWDescription, setNewHWDescription] = useState(
    theBoard || `Aula do dia ${date}`
  );
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
        { headers: headers as any }
      );
      setLoading(false);
      notifyAlert("Lousa salva com sucesso!", partnerColor());
    } catch (error) {
      setLoading(false);
      console.error(error, "Erro ao buscar comentários");
    }
  };

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
          <span>Lousa da Aula</span>
        </div>
        <div
          style={{
            marginBottom: 10,
            height: 300,
          }}
        >
          <HTMLEditor
            key={editorKey}
            initialContent={editorContent}
            onChange={handleHWDescriptionChange}
          />
        </div>
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
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {loading ? "Salvando..." : "Salvar lousa"}
        </button>
      </div>
    </>
  );
};

export default Board;
