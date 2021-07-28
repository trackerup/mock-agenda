import qs from 'qs'

export default (http, store) => {
  http.interceptors.request.use((request) => {
    if (request.data) {
      request.data.APP_VERSION = process.env.VERSION
    }
    request.data = qs.stringify(request.data)

    const token = store.getters['user/token'] || window.localStorage.getItem('token')

    if (token) {
      request.headers.common.Authorization = `Bearer ${token}`
    }
    const locale = store.getters['lang/locale']
    if (locale) {
      request.headers.common['Accept-Language'] = locale
    }

    return request
  })
}
