import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/xkrajn05/",
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
