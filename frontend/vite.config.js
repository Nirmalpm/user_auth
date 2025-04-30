import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default ({ mode }) => {
  // Load .env from parent directory (the project root)
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");
  return defineConfig({
    plugins: [react(), tailwindcss(),'tailwind-scrollbar'],
    define: {
      "import.meta.env.VITE_SERVICE_ID": JSON.stringify(env.VITE_SERVICE_ID),
      "import.meta.env.VITE_TEMPLATE_ID": JSON.stringify(env.VITE_TEMPLATE_ID),
      "import.meta.env.VITE_PUBLIC_KEY": JSON.stringify(env.VITE_PUBLIC_KEY),
    },
  });
};
