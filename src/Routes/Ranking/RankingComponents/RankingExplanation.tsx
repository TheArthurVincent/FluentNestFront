import React from "react";
import RankingList from "./RankingList";
import RankingExplanationComponent from "./RankingExplanationComponents/RankingExplanationComponents";
import { textGeneralFont } from "../../../Styles/Styles";

export default function RankingExplanation() {
  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <div
        className="box-shadow-white"
        style={{
          padding: "1.5rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
          maxWidth: "800px",
          margin: "2rem auto",
          fontFamily: textGeneralFont(),
          color: "#333",
          lineHeight: "1.6",
        }}
      >
        <h2
          style={{ textAlign: "center", color: "#333", marginBottom: "1rem" }}
        >
          Como funciona o sistema de pontuação?
        </h2>
        <p>
          O sistema de pontuação é projetado para medir seu progresso e
          engajamento com base em diferentes critérios. Esses critérios garantem
          que os esforços em várias atividades sejam recompensados. Abaixo,
          explicamos cada critério utilizado:
        </p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Total Score:</strong> Este é o principal critério e reflete
            a soma de todos os pontos acumulados durante suas atividades no
            sistema.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Homeworks Feitos:</strong> Cada tarefa concluída adiciona
            pontos extras ao seu progresso. Este critério recompensa
            consistência no cumprimento das atividades propostas.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Dias com Revisões de 25 Cards:</strong> Para reforçar o
            hábito de revisão, você ganha pontos sempre que completa pelo menos
            25 revisões de flashcards em um único dia.
          </li>
        </ul>
        <p>
          Cada nível é alcançado ao atingir metas específicas nos três critérios
          mencionados acima. Por exemplo, para subir de nível, você pode
          precisar de uma combinação de:
        </p>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            Um número mínimo de <strong>pontos totais</strong>.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Um número definido de <strong>tarefas completas</strong>.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Um número específico de <strong>dias com revisões</strong>.
          </li>
        </ul>
        <p>
          Este sistema incentiva um equilíbrio entre pontuação total,
          consistência nas tarefas e revisões diárias, promovendo um aprendizado
          contínuo e eficiente.
        </p>
        <div
          style={{
            backgroundColor: "#e8f5e9",
            borderLeft: "4px solid #66bb6a",
            padding: "1rem",
            marginTop: "1rem",
            borderRadius: "4px",
          }}
        >
          <strong>Dica:</strong> Para subir de nível mais rapidamente, tente
          revisar pelo menos 25 flashcards por dia e complete suas tarefas
          regularmente!
        </div>
      </div>
      <RankingExplanationComponent />

      <div style={{ display: "grid", gap: "1rem", padding: "3px" }}>
        <RankingList />
      </div>
    </div>
  );
}
