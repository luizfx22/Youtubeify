import Vue from "vue";
import VueRouter from "vue-router";
import SettingsRoutes from "./settings";
import PlaylistsRoutes from "./playlists";

import Home from "../views/Home.vue";
import Search from "../views/Search.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/search",
    name: "Song results",
    component: Search,
  },
  ...SettingsRoutes,
  ...PlaylistsRoutes,
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
