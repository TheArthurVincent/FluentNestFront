import React from "react";
import { HTwo } from "../../Resources/Components/RouteBox";

export const contentFaq = [
  {
    instruction: "Como estudar eficientemente?",
    tags: [
      "estudar",
      "estudo",
      "estudo ativo",
      "estudo passivo",
      "ativo",
      "passivo",
      "estudando",
      "tempo",
    ],
    explanation: (
      <>
        <HTwo>📌 Estudo Ativo (2x por semana)</HTwo>
        <p>
          O estudo ativo é quando você se envolve de maneira intencional com o
          idioma, mesmo que não seja todos os dias. Aqui estão algumas formas:
        </p>
        <ul>
          <li>Estude as aulas dos cursos pelo menos 2 vezes por semana.</li>
          <li>Faça aulas particulares (1 a 2 vezes por semana).</li>
          <li>Participe de aulas da turma (1 a 2 vezes por semana).</li>
          <li>Realize as lições de casa e atividades propostas.</li>
        </ul>

        <HTwo>📆 Estudo Passivo (Diariamente)</HTwo>
        <p>
          Estudo passivo é o contato diário com o idioma, de forma leve e
          contínua. Isso ajuda a reforçar o que foi aprendido:
        </p>
        <ul>
          <li>
            Revise{" "}
            <a
              href="/flash-cards"
              
            >
              flashcards
            </a>{" "}
            por pelo menos 10 minutos por dia.
          </li>
          <li>
            Se exponha ao idioma com:
            <ul>
              <li>Músicas</li>
              <li>Filmes</li>
              <li>Séries</li>
              <li>Documentários</li>
            </ul>
          </li>
        </ul>

        <p>
          ✅ A chave é a consistência! Combine estudo ativo durante a semana com
          exposição diária ao idioma para maximizar seu progresso.
        </p>
      </>
    ),
  },
  {
    instruction: "Como fazer mineração de sentenças?",
    tags: ["Vocabulário", "vocabulary", "study", "estudar"],
    explanation: (
      <div>
        Minerar sentenças é uma das formas mais eficazes de reforçar
        vocabulário. O objetivo é encontrar palavras em contextos reais e
        registrar essas frases. Recomendamos os seguintes recursos:
        <br />
        <br />
        🔍 Nossa plataforma:{" "}
        <a
          href="/sentence-mining"
          
        >
          Sentence Mining
        </a>
        <br />
        🌐 Outros sites úteis:
        <ul>
          <li>
            <a href="https://www.linguee.com/" >
              Linguee
            </a>
          </li>
          <li>
            <a href="https://youglish.com/" >
              YouGlish
            </a>
          </li>
          <li>
            <a href="https://context.reverso.net/traducao/" >
              Reverso
            </a>
          </li>
        </ul>
        <p>
          Pesquise as palavras novas e extraia frases reais em que elas
          aparecem. Isso reforça o uso correto e contextual do vocabulário.
        </p>
      </div>
    ),
  },
  {
    instruction: "Sou obrigado a participar das aulas da turma?",
    tags: ["aula", "turma", "vivo", "group", "live"],
    explanation: (
      <div>
        Não é obrigatório, mas é altamente recomendado! 💡 As aulas da turma
        ajudam a consolidar o aprendizado, oferecem interação com outros alunos
        e... valem pontos extras! 😉
      </div>
    ),
  },
  {
    instruction: "E se minha aula cair num feriado?",
    tags: ["feriado", "reposição", "vivo", "live", "holiday"],
    explanation: (
      <div>
        As aulas particulares não acontecem em feriados. Mas você não fica na
        mão! 👇
        <br />
        <br />✅ As <strong>aulas da turma</strong> funcionam como reposição em
        casos de feriado ou ausência.
        <br />
        Por exemplo: se você tem 1 aula particular por semana, pode participar
        de até <strong>2 aulas da turma extras</strong> por semana, como
        reposição ou bônus. Assim, você nunca fica sem estudar!
      </div>
    ),
  },
  {
    instruction: "Preciso estudar todos os dias?",
    tags: ["frequência", "estudo", "tempo", "rotina"],
    explanation: (
      <div>
        Não é obrigatório estudar todos os dias, mas o contato diário com o
        idioma acelera muito seu progresso. Mesmo que por apenas 10 minutos,
        mantenha o hábito!
      </div>
    ),
  },
  {
    instruction: "Quantas horas por semana devo estudar?",
    tags: ["tempo", "organização", "rotina", "foco"],
    explanation: (
      <div>
        Recomendamos um mínimo de 3 horas por semana. Isso pode ser distribuído
        entre aulas, lições de casa, flashcards e listening. Quanto mais
        exposição ao idioma, mais rápido o progresso.
      </div>
    ),
  },
  {
    instruction: "O que são flashcards?",
    tags: ["flashcards", "memorização", "vocabulário", "revisão"],
    explanation: (
      <div>
        Flashcards são cartões de estudo com perguntas na frente (como uma
        palavra ou frase) e a resposta no verso. Eles são usados como uma{" "}
        <strong>ferramenta de revisão diária</strong> para reforçar a
        memorização e facilitar a retenção de vocabulário e frases.
        <br />
        <br />
        Acesse seus flashcards aqui:{" "}
        <a
          href="/flash-cards"
          
        >
          Flashcards
        </a>
      </div>
    ),
  },
  {
    instruction: "Como funcionam as aulas da turma?",
    tags: ["aulas", "turma", "interação", "coletivo"],
    explanation: (
      <div>
        São encontros online com outros alunos, focados em conversação, revisão
        e aplicação prática. Você pode participar mesmo que não tenha aula
        particular naquela semana.
      </div>
    ),
  },
  {
    instruction: "Como remarcar uma aula particular?",
    tags: ["remarcar", "particular", "agenda", "aviso"],
    explanation: (
      <div>
        Para remarcar, avise com pelo menos 24h de antecedência. Reposições
        dependem da disponibilidade e devem ser combinadas diretamente com o
        professor.
      </div>
    ),
  },
  {
    instruction: "E se eu faltar na aula particular?",
    tags: ["falta", "reposicao", "aviso", "presença"],
    explanation: (
      <div>
        A ausência sem aviso prévio de 24h pode contar como aula dada. Mas você
        sempre pode repor com as aulas da turma!
      </div>
    ),
  },
  {
    instruction: "Como acesso os cursos gravados?",
    tags: ["cursos", "gravado", "aula", "video", "plataforma"],
    explanation: (
      <div>
        Acesse os cursos gravados através deste link:{" "}
        <a
          href="/teaching-materials"
          
        >
          Cursos Gravados
        </a>
      </div>
    ),
  },
  {
    instruction: "Onde encontro as lições de casa?",
    tags: ["lição", "dever", "exercício", "tarefas"],
    explanation: (
      <div>
        As lições de casa são indicadas nas aulas particulares ou no turma do
        WhatsApp. Você também pode revisar os conteúdos indicados nos cursos da
        plataforma.
      </div>
    ),
  },
  {
    instruction: "Posso estudar pelo celular?",
    tags: ["celular", "mobile", "app", "dispositivo"],
    explanation: (
      <div>
        Sim! A plataforma funciona normalmente em dispositivos móveis. Basta
        acessar pelo navegador do celular.
      </div>
    ),
  },
  {
    instruction: "O que é o painel de progresso e como usá-lo?",
    tags: ["progresso", "painel", "evolução", "desempenho"],
    explanation: (
      <div>
        O painel de progresso mostra seu desempenho com base nas tarefas e
        cursos completados. Use-o para acompanhar sua evolução semanal.
      </div>
    ),
  },
  {
    instruction: "Em quanto tempo consigo falar inglês?",
    tags: ["tempo", "fluência", "aprendizado", "objetivo"],
    explanation: (
      <div>
        Isso depende da sua dedicação e ritmo. Com 3 a 5 horas semanais de
        estudo consistente, é possível manter conversas básicas em 6 meses e
        avançar significativamente em 1 ano.
      </div>
    ),
  },
  {
    instruction: "Como manter a motivação nos estudos?",
    tags: ["motivação", "estudo", "dicas", "progresso"],
    explanation: (
      <div>
        Dicas:
        <ul>
          <li>Estabeleça metas claras e curtas.</li>
          <li>Use conteúdos que você gosta (música, séries).</li>
          <li>Compare seu progresso mensal, não diário.</li>
          <li>Participe das aulas da turma para se inspirar.</li>
        </ul>
      </div>
    ),
  },
  {
    instruction: "Como saber se estou evoluindo?",
    tags: ["evolução", "progresso", "medir", "resultado"],
    explanation: (
      <div>
        Alguns sinais:
        <ul>
          <li>Você entende mais frases naturalmente.</li>
          <li>Precisa de menos traduções mentais.</li>
          <li>Comete menos erros ao falar.</li>
          <li>Faz atividades da plataforma com mais facilidade.</li>
        </ul>
      </div>
    ),
  },
  {
    instruction: "Quais sites extras você recomenda além da plataforma?",
    tags: ["sites", "recurso", "extra", "suplementar"],
    explanation: (
      <div>
        Sugestões complementares:
        <ul>
          <li>
            <a href="https://www.bbc.co.uk/learningenglish" >
              BBC Learning English
            </a>{" "}
            – vídeos e notícias
          </li>
          <li>
            <a href="https://www.ted.com/" >
              TED
            </a>{" "}
            – palestras com legendas
          </li>
        </ul>
      </div>
    ),
  },
  {
    instruction: "Posso usar ChatGPT para estudar inglês?",
    tags: ["chatgpt", "inteligência artificial", "ajuda", "estudo"],
    explanation: (
      <div>
        Sim! Algumas formas de usar:
        <ul>
          <li>Peça explicações de gramática.</li>
          <li>Pratique conversação simulada.</li>
          <li>Peça traduções com explicações.</li>
          <li>Crie frases com palavras novas que aprendeu.</li>
        </ul>
      </div>
    ),
  },
];
