import React, { useState } from "react";
import AllStudents from "./AdmComponents/FindStudentAssets/NewStudent";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { alwaysWhite, partnerColor, textTitleFont } from "../../Styles/Styles";
import NewPost from "./AdmComponents/PostsManagement/NewPost";
import NewTutoring from "./AdmComponents/ClassesManagement/NewTutoring";
import Helmets from "../../Resources/Helmets";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import Contract from "./AdmComponents/Contract/Contract";
import Invoice from "./AdmComponents/Invoice/Invoice";
import AllComments from "./AdmComponents/AnswerComments/AnswerComments";
import WhiteLabelPreview from "./AdmComponents/WhiteLabel/WhiteLabel";
import { localStorageLoggedIn } from "../../App";
import NewHomeworkAssignment from "./AdmComponents/ClassesManagement/NewHomework";
import { Tooltip } from "@mui/material";
import { RouteDiv } from "../../Resources/Components/RouteBox";

export function Adm({ headers }: HeadersProps) {
  const [value, setValue] = useState("1");

  const { id } = localStorageLoggedIn;
  const componentsToRender = [
    {
      title: "Alunos",
      value: "1",
      tooltip:
        "Visualize, edite e gerencie todos os alunos cadastrados. Altere dados pessoais, permissões de acesso, redefina senhas ou exclua um aluno da plataforma quando necessário.",
      component: <AllStudents id={id} headers={headers} />,
    },
    {
      title: "Aulas",
      value: "2",
      tooltip:
        "Agende e registre aulas particulares para os alunos. Informe o link do vídeo, materiais de apoio e data da aula. Adicione também flashcards e tarefas de casa relacionadas à aula.",
      component: <NewTutoring id={id} headers={headers} />,
    },
    {
      title: "Homework",
      value: "3",
      tooltip:
        "Crie e atribua tarefas de casa (homework) para os alunos. Defina a data de entrega, escreva as instruções e acompanhe o progresso das atividades enviadas.",
      component: <NewHomeworkAssignment id={id} headers={headers} />,
    },
    {
      title: "Comentários",
      value: "4",
      tooltip:
        "Visualize e responda aos comentários enviados pelos alunos. Utilize este espaço para esclarecer dúvidas, dar feedbacks e manter uma comunicação ativa.",
      component: <AllComments headers={headers} />,
    },
    {
      title: "Postagens",
      value: "5",
      tooltip:
        "Crie novas postagens para serem exibidas na página inicial de todos os alunos. Compartilhe avisos, novidades, materiais extras ou mensagens importantes.",
      component: <NewPost headers={headers} />,
    },
    {
      title: "Aparência",
      value: "6",
      tooltip:
        "Personalize a aparência da plataforma para os alunos. Ajuste cores, logotipo, textos e outros elementos visuais para deixar o ambiente com a identidade da sua escola.",
      component: <WhiteLabelPreview headers={headers} />,
    },
    {
      title: "Contrato",
      value: "7",
      tooltip:
        "Gere contratos personalizados para cada aluno. Preencha os dados necessários e disponibilize o documento para assinatura ou download.",
      component: <Contract headers={headers} />,
    },
    {
      title: "Recibo",
      value: "8",
      tooltip:
        "Emita recibos de pagamento para os alunos. Gere documentos oficiais com os dados do aluno, valores e datas de pagamento.",
      component: <Invoice headers={headers} />,
    },
    // {
    //   title: "Manual do aluno",
    //   value: "9",
    //   tooltip: "Acesse o manual do aluno com orientações e dicas de uso da plataforma.",
    //   component: <Manual />,
    // },
    // {
    //   title: "Timeline",
    //   value: "10",
    //   tooltip: "Acompanhe o histórico de atividades e eventos importantes do seu negócio em uma linha do tempo.",
    //   component: <TimelineComponent headers={headers} />,
    // },
  ];

  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <RouteDiv>
      <Helmets text="Adm" />
      <TabContext value={value}>
        <span className="no-print">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: alwaysWhite(),
              justifyContent: "space-between",
            }}
          >
            <TabList
              sx={{
                fontFamily: textTitleFont(),
                color: partnerColor(),
                "& .MuiTab-root": {
                  fontFamily: textTitleFont(),
                  color: partnerColor(),
                },
                "& .Mui-selected": {
                  color: partnerColor(),
                },
                "& .MuiTabs-indicator": {
                  color: partnerColor(),
                  backgroundColor: partnerColor(),
                },
              }}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {componentsToRender.map((component, index) => {
                return (
                  <Tooltip
                    key={index + component.value}
                    title={component.tooltip}
                    placement="top"
                  >
                    <Tab
                      style={{
                        color: partnerColor(),
                        fontWeight:
                          (index + 1).toString() === value ? 800 : 500,
                      }}
                      label={component.title}
                      value={component.value}
                    />
                  </Tooltip>
                );
              })}
            </TabList>
          </div>
        </span>
        {componentsToRender.map((component, index) => {
          return (
            <TabPanel
              style={{ padding: 0, margin: "1rem auto" }}
              key={index + component.value}
              value={component.value}
            >
              {component.component}
            </TabPanel>
          );
        })}
      </TabContext>
    </RouteDiv>
  );
}

export default Adm;
