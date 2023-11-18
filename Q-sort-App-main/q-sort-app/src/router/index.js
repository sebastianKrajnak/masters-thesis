/**
 * Routes for the application
 * @author Michal Janů
 */
import { createRouter, createWebHistory } from "vue-router";
import Sorting from "../views/Sorting.vue";
import Home from "../views/Home.vue";
import Ferewell from "../views/Ferewell.vue";

const routes = [
  {
    path: "/xkrajn05",
    name: "Home",
    component: Home,
  },
  {
    path: "/xkrajn05/Sorting/:uid",
    name: "Sorting",
    component: Sorting,
  },
  {
    path: "/xkrajn05/Final",
    name: "Ferewell",
    component: Ferewell,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
