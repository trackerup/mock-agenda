import { http } from '@/plugins/http'

export function serviceMakeUserSync (data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await http.post('/?loginCompleto', data)
      const ret = response.data
      response.data.status == 'ok' ? resolve(ret) : reject(ret)
    } catch (response) {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    }
  })
}

export function sendJsonData (dataToSend) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        data: dataToSend,
        pullTracker: {
          act: 'sendJsonString'
        }
      }
      const response = await http.post('/?sendJsonString', data)
      const ret = response.data
      response.data.status == 'ok' ? resolve(ret) : reject(ret)
    } catch (response) {
      const ret = {data: {
        success: false,
        error: response.message
      }}
      reject(ret)
    }
  })
}
