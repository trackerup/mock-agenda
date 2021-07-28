import axios from 'axios'
import { loadMessages } from '../plugins/translations'

export default function Locale (router, store) {
  router.beforeResolve(async (to, from, next) => {
    const locale = window.localStorage.getItem('locale') || store.getters['lang/locale']
    if (locale) {
      axios.defaults.headers.common['Accept-Language'] = locale
    }

    await store.dispatch('lang/setLocale', { locale })
    await loadMessages(store.getters['lang/locale'])

    return next()
  })
}
