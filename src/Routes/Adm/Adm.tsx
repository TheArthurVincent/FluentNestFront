import React, { useState } from "react";
import AllStudents from "./AdmComponents/FindStudentAssets/NewStudent";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { alwaysWhite, partnerColor } from "../../Styles/Styles";
import NewPost from "./AdmComponents/PostsManagement/NewPost";
import Helmets from "../../Resources/Helmets";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import Contract from "./AdmComponents/Contract/Contract";
import Invoice from "./AdmComponents/Invoice/Invoice";
// import AllComments from "./AdmComponents/AnswerComments/AnswerComments";
import WhiteLabelPreview from "./AdmComponents/WhiteLabel/WhiteLabel";
import { isArthurVincent, localStorageLoggedIn } from "../../App";
import { Tooltip } from "@mui/material";
import { RouteDiv } from "../../Resources/Components/RouteBox";
import FinancialResources from "./AdmComponents/FinancialResources/FinancialResources";
import Groups from "./AdmComponents/Groups/Groups";
import ArthurSection from "./AdmComponents/ArthurSection/ArthurSection";
import ResponsibleMainFile from "./AdmComponents/NewResponsible/ResponsibleMainFile";
import FindTeacher from "./AdmComponents/ArthurSection/FindTeacher";

export function Adm({ headers }: HeadersProps) {
  const { id, plan } = localStorageLoggedIn;

  const componentsToRender = [
    {
      title: "Alunos",
      displayArthur: "block",
      value: "0",
      tooltip:
        "Visualize, edite e gerencie todos os alunos cadastrados. Altere dados pessoais, permissões de acesso, redefina senhas ou exclua um aluno da plataforma quando necessário.",
      component: <AllStudents id={id} headers={headers} plan={plan} />,
    },
    {
      title: "Grupos",
      displayArthur: "block",
      value: "1",
      tooltip:
        "Visualize, edite e gerencie todos os alunos cadastrados. Altere dados pessoais, permissões de acesso, redefina senhas ou exclua um aluno da plataforma quando necessário.",
      component: <Groups id={id} headers={headers} />,
    },
    {
      title: "Financeiro",
      displayArthur: "block",
      value: "3",
      tooltip:
        "Gerencie as informações financeiras dos alunos, incluindo pagamentos, faturas e recibos.",
      component: (
        <>
          <FinancialResources id={id} headers={headers} plan={plan} />
        </>
      ),
    },
    {
      title: "Pai ou Responsável",
      displayArthur: "block",
      value: "4",
      tooltip:
        "Gerencie as informações financeiras dos alunos, incluindo pagamentos, faturas e recibos.",
      component: (
        <>
          <ResponsibleMainFile id={id} headers={headers} />
        </>
      ),
    },
    {
      title: "Postagens",
      displayArthur: "block",
      value: "5",
      tooltip:
        "Crie novas postagens para serem exibidas na página inicial de todos os alunos. Compartilhe avisos, novidades, materiais extras ou mensagens importantes.",
      component: <NewPost headers={headers} />,
    },
    {
      title: "Aparência",
      displayArthur: "block",
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
      displayArthur: "block",
    },
    {
      title: "Recibo",
      value: "8",
      tooltip:
        "Emita recibos de pagamento para os alunos. Gere documentos oficiais com os dados do aluno, valores e datas de pagamento.",
      component: <Invoice headers={headers} />,
      displayArthur: "block",
    },
    isArthurVincent && {
      title: "Teachers",
      value: "11",
      tooltip: "OUT!",
      component: <FindTeacher plan={plan} id={id} headers={headers} />,
      displayArthur: "block",
    },
    // isArthurVincent && {
    //   title: "Comentários",
    //   value: "9",
    //   tooltip:
    //     "Visualize e responda aos comentários enviados pelos alunos. Utilize este espaço para esclarecer dúvidas, dar feedbacks e manter uma comunicação ativa.",
    //   component: <AllComments headers={headers} />,
    //   displayArthur: "block",
    // },
    isArthurVincent && {
      title: "Arthur Section",
      value: "10",
      tooltip: "OUT!",
      component: <ArthurSection headers={headers} />,
      displayArthur: "block",
    },
  ].filter(Boolean); // Remove elementos false do array

  // Encontrar a primeira tab visível para inicializar o estado
  const firstVisibleTab = componentsToRender.find(
    (component) => component && component.displayArthur !== "none"
  );
  //@ts-ignore
  const [value, setValue] = useState(firstVisibleTab?.value || "1");

  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <RouteDiv>
      <Helmets text="Administrativo" />
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
                color: partnerColor(),
                "& .MuiTab-root": {
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
                    //@ts-ignore
                    title={component.tooltip}
                    placement="bottom"
                    //@ts-ignore
                    key={index + component.value}
                  >
                    <Tab
                      style={{
                        color: partnerColor(),
                        //@ts-ignore
                        fontWeight: component.value === value ? 800 : 500,
                      }}
                      //@ts-ignore
                      label={component.title}
                      //@ts-ignore
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
              //@ts-ignore
              key={index + component.value}
              //@ts-ignore
              value={component.value}
            >
              {/* @ts-ignore */}
              {component.component}
            </TabPanel>
          );
        })}
      </TabContext>
    </RouteDiv>
  );
}

export default Adm;
