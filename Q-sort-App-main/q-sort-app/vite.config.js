import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/xkrajn05/",
  plugins: [vue()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      host: "0.0.0.0",
      port: 8080,
    },
    proxy : {
      '/api' : 'http://localhost:8080'
    }
  },
});
