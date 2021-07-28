import { http } from '@/plugins/http'
import store from '@/store'

/**
 * Make user login.
 *
 * @param {Object}  data  Data necessary to make login.
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function makeUserLogin (data) {
  return new Promise(async (resolve, reject) => {
    await http.post('/login.php', data).then(response => {
      const ret = {data: response.data}
      resolve(ret)
    }).catch(response => {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    })
  })
}

/**
 * Make user recover (THIS IS A EXAMPLE!! CHANGE THIS FUNCTION TO WORK WITH REAL API).
 *
 * @param {Object}  data  Data necessary to make the user register
 *
 * @returns {Promise} Returns a promise according to the 'success' flag
 */
export function makeUserRecover (data) {
  return new Promise(async (resolve, reject) => {
    await http.post('/recover.php', data).then(response => {
      const ret = {data: response.data}
      resolve(ret)
    }).catch(response => {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    })
  })
}

/**
 * Make user Encerrar Rastreamento.
 *
 * @param {Object}  data  Data necessary to make login.
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function makeUserStopBackground (data) {
  store.dispatch('user/setStartBackground', {status: false})
  return new Promise(async (resolve, reject) => {
    await http.post('/?pullTracker[act]=encerrarRastreamento', data).then(response => {
      const ret = {data: response.data}
      resolve(ret)
    }).catch(response => {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    })
  })
}

/**
 * Make user Encerrar Rastreamento.
 *
 * @param {Object}  data  Data necessary to make login.
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function makeUserStartBackground (data) {
  data.notId = window.localStorage.getItem('notificationId')
  store.dispatch('user/setStartBackground', {status: true})
  return new Promise(async (resolve, reject) => {
    await http.post('/?pullTracker[act]=initRastreamento', data).then(response => {
      const ret = {data: response.data}
      resolve(ret)
    }).catch(response => {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    })
  })
}
