// src/Resources/imageUpload.ts
import axios from "axios";
import { backDomain } from "./UniversalComponents";

export const fileToBase64NoPrefix = (
  file: File
): Promise<{ base64NoPrefix: string; mime: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string; // "data:image/jpeg;base64,...."
      const [meta, raw] = dataUrl.split(",");
      const mime = meta.match(/^data:(.*?);base64$/)?.[1] || "image/jpeg";
      resolve({ base64NoPrefix: raw, mime });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

/**
 * Sobe a imagem para seu backend genérico, que envia ao ImageKit.
 * Retorna a URL final da imagem.
 */
export async function uploadImageViaBackend(
  file: File,
  opts?: {
    folder?: string; // ex: "/lessons" (default: "/misc")
    fileName?: string; // ex: "lesson_123_main.jpg"
    headers?: any; // ex: auth headers
  }
): Promise<string> {
  const { base64NoPrefix, mime } = await fileToBase64NoPrefix(file);

  const payload = {
    file: `data:${mime};base64,${base64NoPrefix}`, // pode enviar dataURL completa
    folder: opts?.folder ?? "/misc",
    fileName: opts?.fileName ?? `upload_${Date.now()}.jpg`,
  };

  const res = await axios.post(`${backDomain}/api/v1/upload-image`, payload, {
    headers: opts?.headers,
  });

  // espera { url }
  if (!res?.data?.url) throw new Error("Upload falhou: resposta sem URL.");
  return res.data.url;
}
