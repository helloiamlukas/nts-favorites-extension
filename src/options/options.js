global.browser = require("webextension-polyfill");

import Vue from "vue";
import Options from "./Options.vue";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(Options)
});
