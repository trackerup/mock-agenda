import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: getDefaultLanguage(),
  messages: {
    en: require('./en.json'),
    es: require('./es.json'),
    pt: require('./pt.json')
  },
  silentTranslationWarn: true
})

function getDefaultLanguage () {
  if (typeof navigator != 'undefined') {
    const current = navigator.language
    if (current.includes('es')) {
      return 'es'
    } else if (current.includes('en')) {
      return 'en'
    }
  }
  return 'pt'
}

/**
 * The function that set validation localize
 *
 * @param {String} locale The current locale
 *
 * @returns {void}
 */
export function loadMessages (locale) {
  if (Object.keys(i18n.getLocaleMessage(locale)).length == 0) {
    i18n.setLocaleMessage(locale, i18n.messages[locale])
  }

  if (i18n.locale != locale) {
    i18n.locale = locale
  }
}

export default i18n
