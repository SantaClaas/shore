import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  middleware: "src/middleware/contentSecurityPolicy.ts",
  vite: {
    plugins: [tailwindcss()],
  },
});
