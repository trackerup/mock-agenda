import { http } from '@/plugins/http'

/**
 * Make user login.
 *
 * @param {Object}  data  Data necessary to make login.
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function acceptLocationTerms (userId) {
  return new Promise(async (resolve, reject) => {
    await http.post('/',
      {
        'pullTracker': {
          'id': userId,
          'act': 'update_user_meta',
          'meta_key': '__user_background_accept',
          'meta_value': new Date().toISOString()
        }
      }
    ).then(response => {
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
