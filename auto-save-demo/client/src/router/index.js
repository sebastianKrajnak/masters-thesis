// client/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import TextBar from "../components/TextBar.vue";
import { v4 } from "uuid";

const id = v4();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: {
        name: "document",
        params: { id: id },
      },
    },
    {
      path: "/documents/:id",
      name: "document",
      component: TextBar,
    },
  ],
});

export default router;
