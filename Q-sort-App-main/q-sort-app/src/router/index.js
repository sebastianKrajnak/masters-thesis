/**
 * Routes for the application
 * @author Michal Janů
 */
import { createRouter, createWebHistory } from "vue-router"
import Sorting from "../views/Sorting.vue"
import Home from "../views/Home.vue"
import Ferewell from "../views/Ferewell.vue"

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/Sorting/:uid",
		name: "Sorting",
		component: Sorting
	},
	{
		path: "/Final",
		name: "Ferewell",
		component: Ferewell
	}

]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
