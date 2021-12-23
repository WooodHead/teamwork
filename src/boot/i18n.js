import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '../i18n'
// when not selecting to import all Quasar components:
import { Quasar } from 'quasar'
// OTHERWISE:
// import Quasar from 'quasar'
class TwI18n extends VueI18n {
  /** 当key没有找到时，aa.bb.cc的path只取Cc */
  t (key, values) {
    let translateResult = super.t(key, values)
    if (translateResult === key) {
      translateResult = key.split('.')[key.split('.').length - 1]
      translateResult = translateResult.charAt(0).toUpperCase() + translateResult.slice(1)
    }
    return translateResult
  }
}

Vue.use(TwI18n)

const i18n = new TwI18n({
  locale: Quasar.lang.isoName, // i18n跟随quasar的语言类型自动转换
  fallbackLocale: Quasar.lang.isoName,
  silentFallbackWarn: true,
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }
