import React, { useState } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { alwaysWhite, partnerColor } from "../../Styles/Styles";
import Helmets from "../../Resources/Helmets";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import Contract from "./AdmComponents/Contract/Contract";
import Invoice from "./AdmComponents/Invoice/Invoice";
import WhiteLabelPreview from "./AdmComponents/WhiteLabel/WhiteLabel";
import { isArthurVincent, localStorageLoggedIn } from "../../App";
import { Tooltip } from "@mui/material";
import ArthurSection from "./AdmComponents/ArthurSection/ArthurSection";
import FindTeacher from "./AdmComponents/ArthurSection/FindTeacher";

export function Adm({ headers }: HeadersProps) {
  const { id, plan } = localStorageLoggedIn;
  const componentsToRender = [
    {
      title: "Aparência",
      displayArthur: "block",
      value: "1",
      tooltip:
        "Personalize a aparência da plataforma para os alunos. Ajuste cores, logotipo, textos e outros elementos visuais para deixar o ambiente com a identidade da sua escola.",
      component: <WhiteLabelPreview headers={headers} />,
    },
    {
      title: "Contrato",
      value: "2",
      tooltip:
        "Gere contratos personalizados para cada aluno. Preencha os dados necessários e disponibilize o documento para assinatura ou download.",
      component: <Contract headers={headers} />,
      displayArthur: "block",
    },
    {
      title: "Recibo",
      value: "3",
      tooltip:
        "Emita recibos de pagamento para os alunos. Gere documentos oficiais com os dados do aluno, valores e datas de pagamento.",
      component: <Invoice headers={headers} />,
      displayArthur: "block",
    },
    isArthurVincent && {
      title: "Teachers",
      value: "4",
      tooltip: "OUT!",
      component: <FindTeacher plan={plan} id={id} headers={headers} />,
      displayArthur: "block",
    },
    isArthurVincent && {
      title: "Arthur Section",
      value: "5",
      tooltip: "OUT!",
      component: <ArthurSection headers={headers} />,
      displayArthur: "block",
    },
  ].filter(Boolean); // Remove elementos false do array

  // Encontrar a primeira tab visível para inicializar o estado
  const firstVisibleTab = componentsToRender.find(
    (component) => component && component.displayArthur !== "none",
  );
  //@ts-ignore
  const [value, setValue] = useState(firstVisibleTab?.value || "1");

  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  return (
    <div
      style={{
        fontFamily: "Plus Jakarta Sans",
        margin: "1.6rem auto",
        fontWeight: 600,
        fontStyle: "SemiBold",
        fontSize: "14px",
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        width: "95%",
        border: "1px solid #e8eaed",
        padding: "10px",
      }}
    >
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
    </div>
  );
}

export default Adm;
