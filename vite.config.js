import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/system",
      "@mui/icons-material",
      "@mui/lab",
      "@emotion/react",
      "@emotion/styled"
    ],
    esbuildOptions: {
      target: "esnext"
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    }
  }
});
