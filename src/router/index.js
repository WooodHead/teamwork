import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { LocalStorage } from 'quasar'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    scrollBehavior: (to, from, savePosition) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let strActiveNav = LocalStorage.getItem('nowActivateTab')
          let objActiveNav = LocalStorage.getItem('navLastRoute') ? LocalStorage.getItem('navLastRoute')[strActiveNav] : {}
          let { name, params } = to
          if (savePosition) {
            return savePosition
          } else if (strActiveNav && objActiveNav && objActiveNav.name === name && _.isEqual(objActiveNav.params, params)) {
            return objActiveNav.location || { x: 0, y: 0 }
          } else {
            return { x: 0, y: 0 }
          }
        }, 500)
      })
      // if (savePosition) {
      //   return savePosition
      // } else {
      //   return { x: 0, y: 0 }
      // }
    },
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
