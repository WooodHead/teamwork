// import something here
import Vue from 'vue'
const config = require('app/app.config.js'),
  ins = config.name.includes('jd') ? '' : `-${config.name}`

const logo = {
  'apple-icon-120x120.png': `icons${ins}/logo/apple-icon-120x120.png`,
  'apple-icon-152x152.png': `icons${ins}/logo/apple-icon-152x152.png`,
  'apple-icon-167x167.png': `icons${ins}/logo/apple-icon-167x167.png`,
  'favicon-16x16.png': `icons${ins}/logo/favicon-16x16.png`,
  'favicon-32x32.png': `icons${ins}/logo/favicon-32x32.png`,
  'favicon-96x96.png': `icons${ins}/logo/favicon-96x96.png`,
  'favicon-120x120.png': `icons${ins}/logo/favicon-120x120.png`,
  'favicon-128x128.png': `icons${ins}/logo/favicon-128x128.png`,
  'favicon-in-toolbar.png': `icons${ins}/logo/favicon-in-toolbar.png`,
  'favicon-with-name-white.png': `icons${ins}/logo/favicon-with-name-white.png`,
  'favicon-with-name-white.svg': `icons${ins}/logo/favicon-with-name-white.svg`,
  'favicon-login.png': `icons${ins}/logo/favicon-login.png`,
  'favicon.ico': `icons${ins}/logo/favicon.ico`,
  'icon-128x128.png': `icons${ins}/logo/icon-128x128.png`,
  'icon-192x192.png': `icons${ins}/logo/icon-192x192.png`,
  'icon-256x256.png': `icons${ins}/logo/icon-256x256.png`,
  'icon-384x384.png': `icons${ins}/logo/icon-384x384.png`,
  'favicon-512x512.png': `icons${ins}/logo/favicon-512x512.png`,
  'ms-icon-144x144.png': `icons${ins}/logo/ms-icon-144x144.png`,
  'logo.png': `icons${ins}/logo.png`
}
Vue.prototype.$logo = logo

export default logo
