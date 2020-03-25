global.browser = require("webextension-polyfill");

import Vue from "vue";
import Favorites from "./Favorites.vue";
import vueDebounce from "vue-debounce";
Vue.use(vueDebounce, {
  listenTo: "input",
  fireOnEmpty: true
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(Favorites)
});
