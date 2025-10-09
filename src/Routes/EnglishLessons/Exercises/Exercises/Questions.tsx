import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar, shuffle } from "../Exercises";
import React, { useEffect, useMemo, useState } from "react";

type ElementExercise = {
  type: "exercise";
  items: string[];
  subtitle?: string;
  order?: number;
};

export function QuestionsExercise({
  exercise,
  exerciseElement,
  studentId,
  labels,
}: {
  exercise: any;
  exerciseElement: ElementExercise;
  studentId: string;
  labels: typeof defaultLabels;
}) {
  return (
    <Card>
      <div style={{ padding: "16px" }}>
        <HeaderBar title={exerciseElement.subtitle || "Exercício"} />
        <div>
          <div style={{ marginLeft: "8px" }}>
            {exerciseElement.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                style={{
                  marginBottom: "12px",
                  fontSize: "16px",
                  color: "#374151",
                  lineHeight: "1.5",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    color: partnerColor(),
                    marginRight: "8px",
                  }}
                >
                  {itemIndex + 1}.
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
