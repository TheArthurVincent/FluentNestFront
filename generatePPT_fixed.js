// Função para gerar PPT - versão corrigida
const generatePPT = async () => {
  try {
    console.log("🎯 Iniciando geração de PPT...");
    notifyAlert("Gerando PowerPoint...", partnerColor());

    const pptx = new PptxGenJS();

    // Configurações básicas
    pptx.author = "Arvin Education";
    pptx.title = sanitizeText(classTitle || "Aula de Inglês");
    pptx.subject = "Aula de Inglês";

    // Slide de título com logo
    const titleSlide = pptx.addSlide();

    // Adicionar logo do partner
    try {
      const logoUrl = logoPartner();
      if (logoUrl) {
        titleSlide.addImage({
          path: logoUrl,
          x: 1,
          y: 0.5,
          w: 2,
          h: 1,
        });
      }
    } catch (logoError) {
      console.log("⚠️ Não foi possível carregar o logo:", logoError);
    }

    const safeTitle = sanitizeText(classTitle || "Aula de Inglês", 100);
    titleSlide.addText(safeTitle, {
      x: 1,
      y: 2.5,
      w: 8,
      h: 1.5,
      fontSize: 36,
      bold: true,
      align: "center",
      color: partnerColor().replace("#", ""),
      fontFace: textTitleFont(),
    });

    const safeSubtitle = sanitizeText(`Curso: ${courseTitle}`, 80);
    titleSlide.addText(safeSubtitle, {
      x: 1,
      y: 4.5,
      w: 8,
      h: 1,
      fontSize: 24,
      align: "center",
      color: darkGreyColor().replace("#", ""),
      fontFace: textGeneralFont(),
    });

    titleSlide.addText(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, {
      x: 1,
      y: 6,
      w: 8,
      h: 1,
      fontSize: 18,
      align: "center",
      color: darkGreyColor().replace("#", ""),
      fontFace: textGeneralFont(),
    });

    // Processar elementos da aula
    if (theclass.elements && Array.isArray(theclass.elements)) {
      //@ts-ignore
      const sortedElements = theclass.elements.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      console.log(`🔄 Processando ${sortedElements.length} elementos...`);

      for (const element of sortedElements) {
        console.log(
          `📄 Processando elemento: ${element.type} - ${
            element.subtitle || "Sem título"
          }`
        );

        // Slide de subtítulo para cada elemento
        if (element.subtitle || element.description) {
          const subtitleSlide = pptx.addSlide();

          if (element.subtitle) {
            const safeSubtitle = sanitizeText(element.subtitle, 100);
            subtitleSlide.addText(safeSubtitle, {
              x: 1,
              y: 2.5,
              w: 8,
              h: 1.5,
              fontSize: 32,
              bold: true,
              align: "center",
              color: partnerColor().replace("#", ""),
              fontFace: textTitleFont(),
            });
          }

          if (element.description) {
            const safeDescription = sanitizeText(element.description, 300);
            subtitleSlide.addText(safeDescription, {
              x: 1,
              y: 4.5,
              w: 8,
              h: 2,
              fontSize: 20,
              align: "center",
              color: darkGreyColor().replace("#", ""),
              fontFace: textGeneralFont(),
            });
          }
        }

        // Processar cada tipo de elemento
        processElement(pptx, element);
      }
    }

    console.log("🎯 Gerando arquivo PPT...");

    // Gerar arquivo
    const safeFileName = sanitizeText(classTitle || "aula", 30).replace(
      /\s+/g,
      "_"
    );
    const fileName = `${safeFileName}.pptx`;

    await pptx.writeFile({ fileName });

    console.log("✅ PPT gerado com sucesso!");
    notifyAlert("PowerPoint gerado com sucesso!", "green");
  } catch (error) {
    console.error("❌ Erro ao gerar PPT:", error);
    notifyAlert("Erro ao gerar PowerPoint. Tente novamente.", "red");
  }
};

// Função auxiliar para processar cada elemento
//@ts-ignore
const processElement = (pptx, element) => {
  switch (element.type) {
    case "text":
      processTextElement(pptx, element);
      break;
    case "sentences":
      processSentencesElement(pptx, element);
      break;
    case "exercise":
      processExerciseElement(pptx, element);
      break;
    case "html":
      processHtmlElement(pptx, element);
      break;
    case "images":
      processImagesElement(pptx, element);
      break;
    default:
      processGenericElement(pptx, element);
      break;
  }
};
