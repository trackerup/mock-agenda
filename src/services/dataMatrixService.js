import { http } from '@/plugins/http'
import store from '@/store/'

/**
 * Make matrix request from value.
 *
 * @param {Object}  data  Data necessary to make login.
 *
 * @returns {Promise} Returns a promise according to the 'success' flag.
 */
export function loadValueMatrix (campo, value) {
  let data = {
    pullTracker: { 'act': 'loadValoresMatrizEmpresa' },
    empresa: store.getters['user/user'].empresa,
    idMatriz: campo.tipoMatrix == 'ancora_matriz' ? campo.matrixData.matriz : campo.matrixData.conf.destino[0],
    idCampo: campo.tipoMatrix == 'ancora_matriz' ? campo.matrixData.campo : campo.matrixData.conf.destino[1],
    valor: value.trim()
  }
  return new Promise(async (resolve, reject) => {
    try {
      if (data.valor == '') {
        const ret = {data: {
          status: false
        }}
        reject(ret)
      } else {
        const response = await http.post('/index.php', data)
        const ret = {data: response.data}
        response.data.status == 'true' ? resolve(ret) : reject(ret)
      }
    } catch (response) {
      const ret = {data: {
        success: false,
        error: response.mensagem
      }}
      reject(ret)
    }
  })
}
