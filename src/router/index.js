import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const constantRoutes = [
  {
    path: "/",
    redirect: () => {
      return "/login";
    },
  },
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "project-route" */ "@/views/Login.vue"),
    name: "Login",
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "project-route" */ "@/views/Register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/treegrid",
    name: "Treegrid",
    component: () =>
      import(/* webpackChunkName: "project-route" */ "@/views/Treegrid.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const createRouter = () =>
  new Router({
    mode: "history",
    routes: constantRoutes,
  });

const router = createRouter();

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!localStorage.getItem("user-token")) {
      next({ path: "/" });
    } else next();
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (!localStorage.getItem("user-token")) {
      next();
    } else next({ path: "/treegrid" });
  }
});

export default router;
