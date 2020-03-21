global.browser = require('webextension-polyfill')

import Vue from 'vue'
import Favorites from './Favorites.vue'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(Favorites)
})
