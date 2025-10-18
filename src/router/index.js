import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import EventPage from "../pages/EventPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/event/:id", component: EventPage, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
