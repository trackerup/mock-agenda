import { http } from '@/plugins/http'
import qs from 'qs'

/**
 * Get all messages.
 *
 * How to use: import { get as getAllmessages } from '@/services/messages'
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function get (config) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = qs.stringify(config)
      const response = await http.get(`/?${params}`)
      // console.log('getAllmessages GET')
      // console.log(response)
      const ret = {data: response.data.msgs}
      response.data.status == 'OK' ? resolve(ret) : reject(ret)
    } catch (response) {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    }
  })
}

/**
 * Send message.
 *
 * How to use: import { post as sendMessage } from '@/services/messages'
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function post (config) {
  return new Promise(async (resolve, reject) => {
    try {
      // const params = qs.stringify(config)
      const response = await http.post(`/`, config)
      const ret = {data: (response.data.mensagensSincronizadas ? response.data : response.data.mensagensSincronizadas)}
      // console.log('sendMessage POST')
      // console.log(ret)
      response.data.status == 'OK' ? resolve(ret) : reject(ret)
    } catch (response) {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    }
  })
}
