import { http } from '@/plugins/http'

export function post (config) {
  return new Promise(async (resolve, reject) => {
    await http.post(`/?sincronizarTarefas`, config).then(response => {
      if (response.data.status == 'ok') {
        let ret = {
          tarefas: response.data.rota,
          // tarefasDeletadas: response.data.rota.tarefasDeletadas,
          tarefas_log: response.data.tarefa_log_sincronizada,
          respostas: response.data.respostasSalvas,
          tarefasSincronizadas: response.data.tarefasSincronizadas,
          user: response.data.user
        }
        resolve(ret)
      } else {
        reject(response.data)
      }
    }).catch(response => {
      const ret = {
        data: {
          success: false,
          error: response.mensagem
        }
      }
      reject(ret)
    })
  })
}

export function appDownloadTarefa (idTarefa, version) {
  return new Promise(async (resolve, reject) => {
    await http.get('/?pullTracker[act]=appDownloadTarefa&idTarefa=' + idTarefa + '&version=' + version).then(response => {
      resolve(response.data)
    }).catch(response => {
      const ret = {
        data: {
          success: false,
          error: response.mensagem
        }
      }
      reject(ret)
    })
  })
}

export function appUploadTarefa (tarefa) {
  return new Promise(async (resolve, reject) => {
    await http.post('/?pullTracker[act]=appUploadTarefa&idTarefa=' + tarefa.id + '&version=' + tarefa.versao, {tarefa: tarefa}).then(response => {
      resolve(response.data)
    }).catch(response => {
      const ret = {
        data: {
          success: false,
          error: response.mensagem
        }
      }
      reject(ret)
    })
  })
}

export function download (config) {
  return new Promise(async (resolve, reject) => {
    await http.get(config).then(response => {
      resolve(response)
    }).catch(response => {
      const ret = {
        data: {
          success: false,
          error: response.mensagem
        }
      }
      reject(ret)
    })
  })
}

export function regeneratePreResp (idTarefa) {
  return new Promise(async (resolve, reject) => {
    await http.get('/?pullTracker[act]=whirpool_regeneratePreResp&tarefa=' + idTarefa).then(response => {
      resolve(response)
    }).catch(response => {
      const ret = {
        data: {
          success: false,
          error: response.mensagem
        }
      }
      reject(ret)
    })
  })
}

export function updateMetaTask (config) {
  return new Promise(async (resolve, reject) => {
    await http.post(`/?update_tarefa_meta`, config).then(response => {
      if (response.data.status == 'ok') {
        resolve(response.data)
      } else {
        const ret = {
          data: {
            success: false,
            error: response.mensagem
          }
        }
        reject(ret)
      }
    }).catch(response => {
      const ret = {
        data: {
          success: false,
          error: response.mensagem
        }
      }
      reject(ret)
    })
  })
}
