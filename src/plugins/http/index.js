import axios from 'axios'
import interceptors from './interceptors'

// allow use http client without Vue instance
export const http = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
})

// receive store and data by options
// https://vuejs.org/v2/guide/plugins.html
export default function install (Vue, { store, router }) {
  interceptors(http, store, router)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  Object.defineProperty(Vue.prototype, '$http', {
    get () {
      return http
    }
  })
}
