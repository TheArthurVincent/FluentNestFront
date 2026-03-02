export type Lesson = {
  id: string;
  title: string;
  video?: string;
  html?: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  modules: Module[];
};

/* ================= MOCK JSON ================= */
export const mockCourse: Course = {
  id: "course-1",
  title: "ARVIN",
  modules: [
    {
      id: "module-1",
      title: "ELEMENTOS DINÂMICOS",
      lessons: [
        {
          id: "lesson-1",
          title: "Aula 1 - Introdução",
          video: "https://www.youtube.com/watch?v=KyUQRZbsz5M&t=3s",
          html: `
    <h3>Resumo do ensino geral do vídeo</h3>
    <p>O vídeo ensina como usar o botão <strong>Elementos Dinâmicos</strong> para criar e editar aulas dentro da plataforma, montando uma aula completa e organizada.</p>
    <ul>
      <li>Explica que é possível adicionar e organizar elementos como: título, idioma, tags, descrição, imagem, sentenças, vocabulário, explicações e exercícios.</li>
      <li>Mostra que o botão <strong>Elementos Dinâmicos</strong> aparece em dois lugares: dentro de <strong>Materiais</strong> (aulas fixas/reutilizáveis) e dentro de <strong>Eventos no Calendário</strong> (aulas específicas para um dia, aluno ou turma).</li>
      <li>Ensina a diferença de uso: criar conteúdo fixo em Materiais e depois replicar e ajustar para uma aula específica no Calendário.</li>
      <li>Orienta remover o conteúdo padrão que aparece automaticamente ao criar uma aula nova (o aviso de que falta conteúdo).</li>
      <li>Mostra como configurar idioma e tags para facilitar a busca, incluindo a possibilidade de gerar tags a partir do Vocabulary.</li>
      <li>Explica que título e descrição com IA só fazem sentido após adicionar elementos, para não desperdiçar tokens.</li>
      <li>Demonstra como escolher e adicionar uma imagem de capa para a aula e como salvar, cancelar ou excluir a aula.</li>
    </ul>
    <p>A ideia central é te ensinar a estruturar aulas completas e bonitas usando elementos dinâmicos, tanto para materiais permanentes quanto para aulas pontuais no calendário.</p>
  `,
        },
      ],
    },
  ],
};
