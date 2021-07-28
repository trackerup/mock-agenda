import { http } from '@/plugins/http'

export function registerFolhaPonto (data) {
  return new Promise(async (resolve, reject) => {
    await http.post('/?registerFolhaPonto', data).then(response => {
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

export function sendUserStatus (data) {
  return new Promise(async (resolve, reject) => {
    await http.post('/', data).then(response => {
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
