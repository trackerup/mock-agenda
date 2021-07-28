import { http } from '@/plugins/http'

export function post (data) {
  return new Promise(async (resolve, reject) => {
    await http.post('/?solicitarAprovacaoRotaBloqueada', data).then(response => {
      const ret = response.data
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
