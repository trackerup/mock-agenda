import { http } from '@/plugins/http'

/**
 * Get diagnostic tree.
 *
 * @param {Object}  data  Data necessary to get diagnostic tree.
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function getDiagnosticTree (data) {
  return new Promise(async (resolve, reject) => {
    await http.get('/?pullTracker[act]=whirpool_get_dados&tarefas=[' + data.treeHash + ']').then(response => {
      const ret = {data: response.data}
      let res = (typeof response.data.status == 'undefined' || response.data.status == true)
      res ? resolve(ret) : reject(ret)
    }).catch(response => {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    })
  })
}
