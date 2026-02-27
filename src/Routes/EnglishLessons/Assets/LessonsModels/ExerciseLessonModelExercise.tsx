import React, { useRef, useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";

interface ExerciseLessonModelLessonProps {
  headers: MyHeadersType | null;
  item: string[];
}

export default function ExerciseLessonModelLesson({
  headers,
  item,
}: ExerciseLessonModelLessonProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef.current) {
      // Função para atualizar o tamanho
      const updateSize = () => {
        if (textRef.current) {
          setSize({
            width: textRef.current.offsetWidth,
            height: textRef.current.offsetHeight,
          });
        }
      };

      // Inicializa o tamanho
      updateSize();

      // Observer para mudanças no tamanho do conteúdo
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(textRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [item]); // Atualiza quando os itens mudam

  return (
    <div
      ref={textRef}
      style={{
        padding: "5px",
        margin: "10px 0",
        position: "relative", // Garante que o iframe fique sobreposto corretamente
      }}
    >
      <ol>
        {item && item?.map((theitem: string, index: number) => (
          <li style={{ fontSize: "1.5rem" }} key={index}>
            {theitem}
          </li>
        ))}
      </ol>

      {/* Iframe que bloqueia a seleção */}
      <iframe
        src="about:blank"
        title="blocker"
        className="absolute top-0 left-0 opacity-0 pointer-events-auto"
        style={{
          width: size.width,
          height: size.height,
          position: "absolute",
          top: 0,
          left: 0,
          border: "none",
        }}
      />
    </div>
  );
}
