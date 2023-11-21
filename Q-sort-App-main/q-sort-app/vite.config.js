import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/xkrajn05/",
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: 8080,
    watch: {
      usePolling: true,
    },
    // hmr: {
    //   host: "localhost",
    //   port: 8080,
    // },
    proxy : {
      '/api' : 'http://localhost:8080'
    }
  },
});
