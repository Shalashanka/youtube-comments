import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/youtube-comments/",  // This should match your GitHub repository name
});
