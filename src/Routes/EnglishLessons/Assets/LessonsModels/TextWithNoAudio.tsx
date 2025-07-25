import React from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { TextareaAutosize } from "@mui/material";
import TextAreaLesson from "../Functions/TextAreaLessons";
interface TextsWithTranslateLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
}

export default function TextsWithTranslateLessonModel({
  element,
}: TextsWithTranslateLessonModelProps) {
  // Debug: verificar a estrutura do elemento
  console.log('TextsWithTranslateLessonModel element:', element);
  
  // Verificar se existem audios ou outros dados para renderizar
  const dataToRender = element.audios || element.items || element.texts || [];
  
  if (!dataToRender || dataToRender.length === 0) {
    return (
      <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
        <p>Nenhum item para exibir neste elemento.</p>
        <small>Estrutura do elemento: {JSON.stringify(Object.keys(element), null, 2)}</small>
      </div>
    );
  }

  return (
    <ul
      style={{
        padding: "5px",
        margin: "10px 0",
      }}
    >
      {dataToRender.map((item: any, index: number) => {
        return (
          <li key={index} style={{ marginBottom: "10px", listStyle: "none" }}>
            <div style={{ padding: "8px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
              {/* Tentar diferentes propriedades do item */}
              {item.enusAudio && <div>{item.enusAudio}</div>}
              {item.text && <div>{item.text}</div>}
              {item.english && <div>{item.english}</div>}
              {item.content && <div>{item.content}</div>}
              {!item.enusAudio && !item.text && !item.english && !item.content && (
                <div>Item {index + 1}: {JSON.stringify(item)}</div>
              )}
            </div>
            <TextAreaLesson/>
          </li>
        );
      })}
    </ul>
  );
}
