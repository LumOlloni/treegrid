import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/",
    component: () => import("@/views/Login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/treegrid",
    name: "Treegrid",
    component: () => import("@/views/Treegrid.vue"),
    meta: {
      guest: true,
    },
  },
];

const createRouter = () =>
  new Router({
    mode: "history",
    routes: constantRoutes,
  });

const router = createRouter();

export default router;
