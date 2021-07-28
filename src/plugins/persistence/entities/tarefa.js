import { getters, setters } from '../services'
// import formatInputDateTime from '@/filters/date/formatInputDateTime'
import { download, appDownloadTarefa, appUploadTarefa } from '@/services/tasks'
import store from '@/store'
import { logTask } from '@/plugins/persistence/entities/tarefaLog'
import moment from 'moment'

export function getTarefasHoje () {
  return new Promise(async (resolve, reject) => {
    let user = await store.getters['user/user']
    const hoje = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]
    getters.searchItems('tarefas', 'dataTarefa', hoje).then(async function (tarefas) {
      tarefas.filter(task => {
        return parseInt(task.rota) == user.route.id
      })
      resolve(tarefas)
    })
  })
}
function filterTasksByRoute (tasks) {
  let user = store.getters['user/user']
  if (tasks) {
    return tasks.filter(task => {
      return parseInt(task.rota) == user.route.id
    })
  }
  return false
}

export function getTarefasByDate () {
  return new Promise((resolve, reject) => {
    let date = store.getters['task/viewDate']
    getters.searchItemsbyRange('tarefas', 'dataTarefa', date, '').then(function (tarefas) {
      resolve(filterTasksByRoute(tarefas))
    })
  })
}

export function getTarefasHojeForSync () {
  return new Promise((resolve, reject) => {
    const hoje = store.getters['task/viewDate']
    getters.searchItems('tarefas', 'dataTarefa, sinc', [hoje, 0]).then(function (tarefas) {
      tarefas.forEach((task) => {
        if (task.id == task.uuid) {
          task.id = 0
        }
      })
      resolve(filterTasksByRoute(tarefas))
    })
  })
}

export function getTarefasOldForDelete () {
  return new Promise((resolve, reject) => {
    let user = store.getters['user/user']
    var daysToTasksOld = user.task_validity ? user.task_validity : 30

    const dataToOldTask = moment().subtract(daysToTasksOld, 'days').format('YYYY-MM-DD')

    getters.searchItemsbyRange('tarefas', 'dataTarefa', '', dataToOldTask).then(function (tarefas) {
      tarefas.forEach((_task) => {
        store.dispatch('task/deleteTask', {task: _task})
      })
      resolve(filterTasksByRoute(tarefas))
    })
  })
}

export function getVersaoTarefasHojeForSync () {
  return new Promise(async (resolve, reject) => {
    getters.getAll('tarefas').then(async function (tarefas) {
      var retorno = []
      filterTasksByRoute(tarefas).forEach(element => {
        retorno.push({
          idTarefa: element.id,
          versao: element.versao
        })
      })
      resolve(retorno)
    })
  })
}

export function getVersaoTarefas () {
  return new Promise(async (resolve, reject) => {
    getters.getAll('tarefas').then(async function (tarefas) {
      var retorno = []
      filterTasksByRoute(tarefas).forEach(element => {
        retorno.push({
          idTarefa: element.id,
          versao: element.versao
        })
      })
      resolve(retorno)
    })
  })
}

export function getOneTaskById (id) {
  if (id.toString().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    return getters.getOne('tarefas', id)
  }
  return getters.getOne('tarefas', parseInt(id))
}

export function getOneTaskByUuid (uuid) {
  return new Promise(async (resolve, reject) => {
    getters.searchItembyIndex('tarefas', 'uuid', uuid).then(async function (tarefa) {
      resolve(tarefa)
    })
  })
}

export function getTarefasHojeByStatus (status) {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000
  const hoje = new Date(Date.now() - tzoffset).toISOString().split('T')[0]
  return new Promise(async (resolve, reject) => {
    getters.searchItems('tarefas', 'status, dataTarefa', [status, hoje]).then(async function (tarefas) {
      resolve(filterTasksByRoute(tarefas))
    })
  })
}

export function newOccurrence (user, form, coords, values) {
  const uuidv4 = require('uuid/v4')
  let endereco = ''

  if (coords) {
    endereco = 'Latitude : ' + coords.latitude + ' Logitude : ' + coords.longitude
  } else {
    endereco = 'Endereço não Localizado!'
    coords = {}
    coords.latitude = false
    coords.longitude = false
  }

  // let taskToSave = {
  //   estimado: {
  //       hora: parseInt( dataDaTarefa.getHours() ),
  //       minuto: parseInt( Math.floor(dataDaTarefa.getMinutes() / 10) * 10 )
  //   },
  //   reid: null,
  //   urgente: timestampUrgente,
  // };
  let uuid = uuidv4().toString()
  let tarefa = {
    'id': uuid,
    'uuid': uuid,
    'idApp': null,
    'rota': user.rota,
    'group': '0',
    'autor': user.id,
    'criado': moment().format('YYYY-MM-DD hh:mm:ss'),
    'modificado': null,
    'destino': null,
    'comentario': 'Esta Tarefa foi criada pelo registro de uma Ocorrencia. O tipo da Ocorrencia Informada foi ' + form.titulo,
    'status': 'concluida',
    'log': '["form"=>""]',
    'inicio': new Date().getTime(),
    'termino': null,
    'estimado': null,
    'latitude': coords.latitude,
    'longitude': coords.longitude,
    'nome': 'Registro de : ' + form.titulo,
    'endereco': endereco,
    'urgente': '1',
    'agendada': null,
    'livre': '0',
    'dataTarefa': moment().format('YYYY-MM-DD'),
    'planedStart': JSON.stringify(
      {
        'hora': moment().format('hh'),
        'minuto': moment().format('mm')
      }),
    'planedEnd': JSON.stringify(
      {
        'hora': moment().add(1, 'hours').format('hh'),
        'minuto': moment().format('mm')
      }),
    'getSing': null,
    'getPic': null,
    'coment': null,
    'pic': null,
    'travelStart': new Date().getTime(),
    'travelEnd': new Date().getTime(),
    'travelLat': coords.latitude,
    'travelLng': coords.longitude,
    'sinc': 1,
    'recorrente': null,
    'forms': JSON.stringify([form.id]),
    'formsExtra': '{}',
    'automatica': '0',
    'deletada': '0',
    'versao': '1',
    'created_at': '0000-00-00 00:00:00',
    'updated_at': '2020-03-16 13:46:07',
    'deleted_at': '0000-00-00 00:00:00',
    'historico': [],
    'responses': [values],
    'metaDados': []
  }
  return store.dispatch('task/saveTarefa', {task: tarefa})
}

export function saveTarefa (tarefa) {
  return store.dispatch('task/saveTarefa', {task: tarefa})
}

export function saveTarefas (listaTarefas) {
  let _promises = []
  for (let index = 0; index < listaTarefas.length; index++) {
    _promises.push(saveTarefa(listaTarefas[index]))
  }
  return Promise.all(_promises)
}

/**
 * task/TR-698 - [WHP] [APP] Revisando sincronização de tarefas
 * Após sincronizar as tarefas marca o campo sync como 1 para não enviar mais as tarefas para a API
 */
export function saveTarefasPosSync (listaTarefas, _self) {
  return new Promise(async (resolve, reject) => {
    let user = await store.getters['user/user']
    var daysToTasksOld = user.task_validity ? user.task_validity : 30
    const dataToOldTask = moment().subtract(daysToTasksOld, 'days').format('YYYY-MM-DD')
    if (listaTarefas.length == 0) {
      resolve(listaTarefas)
      return false
    }
    let _promises = []
    let _dbTasks = await getVersaoTarefas()
    for (let index = 0; index < listaTarefas.length; index++) {
      _promises.push(new Promise(async (resolve, reject) => {
        let _taskData = listaTarefas[index]
        _taskData.sinc = 1
        _taskData.id = _taskData.id
        // _taskData.versao = Number.isInteger(parseInt(_taskData.versao)) ? parseInt(_taskData.versao) + 1 : 0

        let dbTask = await getOneTaskById(parseInt(_taskData['id']))
        _dbTasks = _dbTasks.filter(task => {
          return task.idTarefa != _taskData['id']
        })
        if ((!dbTask || parseInt(_taskData.versao) > parseInt(dbTask.versao)) && moment(_taskData['dataTarefa']).isAfter(dataToOldTask)) {
          // download
          appDownloadTarefa(_taskData.id, _taskData.versao).then(webTask => {
            if (webTask) {
              webTask.id = parseInt(webTask.id)
              getOneTaskById(parseInt(webTask.id)).then(dbTask => {
                if (!dbTask || parseInt(webTask.versao) >= parseInt(dbTask.versao)) {
                  if (dbTask) {
                    if (typeof dbTask.responses != 'undefined') {
                      if ((dbTask.responses.length) > 0) {
                        webTask.responses = dbTask.responses
                      }
                    }
                    if (dbTask.status == 'bloqueada' && dbTask.status != webTask.status) {
                      setters.deleteOne('task_download', webTask.id)
                    }
                  }
                  store.dispatch('task/saveTarefa', {task: webTask})
                  if (_self.currentTask && _self.currentTask.id == webTask.id && webTask.deletada == 1) {
                    _self.$bus.$emit('currentTaskDeleted')
                  }
                  resolve(webTask)
                } else {
                  resolve(dbTask)
                }
              })
            } else {
              reject(webTask)
            }
          })
        } else if (dbTask && parseInt(_taskData.versao) < parseInt(dbTask.versao)) {
          // upload
          appUploadTarefa(dbTask).then(webTask => {
            if (webTask) {
              getOneTaskById(parseInt(_taskData['id'])).then(dbTask => {
                if (dbTask && parseInt(webTask.versao) >= parseInt(dbTask.versao)) {
                  webTask.id = parseInt(webTask.id)
                  if (webTask.status == 'concluida') {
                    webTask.metaDados = webTask.metaDados.filter(element => { return element.meta_key != '__pre_resp' })
                  }
                  // Não sobe a versão
                  store.dispatch('task/updateTask', {task: webTask}).then(() => {
                    resolve(webTask)
                  })
                }
                resolve(dbTask)
              })
            } else {
              reject(webTask)
            }
          })
        } else {
          if (dbTask && parseInt(_taskData.versao) == parseInt(dbTask.versao)) {
            dbTask.sinc = 1
            // await setters.setOne('tarefas', dbTask)
            // do nothing
          }
          resolve(dbTask)
        }
      }))
    }
    Promise.all(_promises).then((values) => {
      if (_dbTasks.length) {
        let _promises = []
        _promises.push(new Promise(async (resolve, reject) => {
          _dbTasks.forEach(async (localTask) => {
            let dbTask = await getOneTaskById(localTask.idTarefa)
            appUploadTarefa(dbTask).then(webTask => {
              if (webTask) {
                webTask.id = parseInt(webTask.id)
                if (webTask.status == 'concluida') {
                  webTask.metaDados = webTask.metaDados.filter(element => { return element.meta_key != '__pre_resp' })
                }
                setters.deleteOne('tarefas', localTask.idTarefa)
                if ((webTask.status != 'concluida' && webTask.status != 'malsucedida') || webTask.dataTarefa == new Date().toJSON().slice(0, 10)) {
                  setters.setOne('tarefas', webTask).then(() => {
                    resolve(webTask)
                  })
                } else {
                  resolve(webTask)
                }
              } else {
                reject(webTask)
              }
            })
          })
        }))
        Promise.all(_promises).then((values) => {
          resolve(listaTarefas)
        })
      } else {
        resolve(listaTarefas)
      }
    })
  })
}

export function syncTaskDownload (listaTarefas) {
  listaTarefas.forEach((tarefa, idx) => {
    if (!tarefa.metaDados) {
      return
    }
    var metaDataDownload = tarefa.metaDados.find(meta => meta.meta_key == '__download')
    if (metaDataDownload && metaDataDownload.meta_value) {
      getters.getOne('task_download', tarefa.id).then(taskDownload => {
        if (taskDownload) {
          if (typeof taskDownload.jsonValue.catalogo != 'undefined' || typeof taskDownload.jsonValue.defeitos != 'undefined') {
            if (typeof taskDownload.jsonValue.catalogo.pecas == 'undefined' || typeof taskDownload.jsonValue.defeitos.itens == 'undefined' || Object.values(taskDownload.jsonValue.catalogo.pecas).length == 0 || Object.values(taskDownload.jsonValue.defeitos.itens).length == 0) {
              let blockDownload = tarefa.metaDados.find(element => { return element.meta_key == '__blockDownload' })
              if (!blockDownload || blockDownload.meta_value != 'true') {
                setters.deleteOne('task_download', parseInt(tarefa.id))
                taskDownload = false
              }
            }
          } else {
            let blockDownload = tarefa.metaDados.find(element => { return element.meta_key == '__blockDownload' })
            if (!blockDownload || blockDownload.meta_value != 'true') {
              setters.deleteOne('task_download', parseInt(tarefa.id))
              taskDownload = false
            }
          }
        }
        if (!taskDownload && tarefa.status != 'concluida' && tarefa.status != 'malSucedida' && tarefa.status != 'malsucedida') {
          download(metaDataDownload.meta_value).then((result) => {
            attPartsRemovedByTask(tarefa.id, result.data).then(json => {
              setters.setOne('task_download', {
                idTarefa: parseInt(tarefa.id),
                jsonValue: json
              })
            })
          })
        }
      }).catch((error) => {
        console.log(error)
        download(metaDataDownload.meta_value).then((result) => {
          attPartsRemovedByTask(tarefa.id, result.data).then(json => {
            setters.setOne('task_download', {
              idTarefa: parseInt(tarefa.id),
              jsonValue: json
            })
          })
        })
      })
    }
  })
}

/**
 * task/TR-698 - [WHP] [APP] Revisando sincronização de tarefas
 * Após sincronizar as tarefas marca o campo sync como 1 para não enviar mais as tarefas para a API
 */
export function saveTarefasSincronizadas (listaTarefas) {
  return new Promise(async (resolve, reject) => {
    if ((typeof listaTarefas == 'undefined') || listaTarefas.length == 0) {
      resolve(listaTarefas)
      return false
    }
    for (let index = 0; index < listaTarefas.length; index++) {
      listaTarefas[index].sinc = 1
      listaTarefas[index].id = parseInt(listaTarefas[index].id)
      let dbTask = await getOneTaskByUuid(listaTarefas[index].uuid)
      let tzoffset = new Date().getTimezoneOffset()
      let dataTarefaWeb = new Date(listaTarefas[index].updated_at)
      let dataTarefa = dataTarefaWeb
      if (dbTask) {
        dataTarefa = new Date(dbTask.updated_at)
        dataTarefa.setMinutes(dataTarefa.getMinutes() + tzoffset)

        /*
         *task/PR-1773 - Alterando id para o que vier do banco de dados da API
         */
        dbTask.id = listaTarefas[index].id
      }
      if (!dbTask || parseInt(listaTarefas[index].versao) > parseInt(dbTask.versao)) {
        if (dbTask) {
          if (dbTask.status == 'bloqueada' && dbTask.status != listaTarefas[index].status) {
            setters.deleteOne('task_download', listaTarefas[index].id)
          }
        }
        await setters.setOne('tarefas', listaTarefas[index])
        if (!dbTask || parseInt(listaTarefas[index].versao) > parseInt(dbTask.versao)) {
          setters.deleteOne('task_download', listaTarefas[index].id)
        }
      } else {
        if (dbTask && listaTarefas[index].responses && listaTarefas[index].responses.length > 0 && parseInt(listaTarefas[index].versao) == parseInt(dbTask.versao)) {
          if (JSON.stringify(dbTask.responses) != JSON.stringify(listaTarefas[index].responses)) {
            dbTask.responses = listaTarefas[index].responses
          }
        }
        if (dbTask && dbTask.sinc == 0) {
          dbTask.sinc = 1
          await setters.deleteOne('tarefas', dbTask.uuid)
          await setters.setOne('tarefas', dbTask)
        }
      }
    }
    resolve(listaTarefas)
  })
}

export function getAll () {
  // Faz algum tratamento...
  return getters.getAll('tarefas')
}

export function prepareForSincAll () {
  return new Promise(
    function (resolve, reject) {
      getters.getAll('tarefas').then(
        function (tarefas) {
          let _promises = []
          for (let index = 0; index < tarefas.length; index++) {
            _promises.push(saveTarefa(tarefas[index]))
          }
          setters.deleteAll('task_download')
          store.dispatch('synchronization/saveLastSync', {
            lastSync: null
          })
          store.dispatch('synchronizationMessages/saveLastSync', {
            lastSync: null
          })
          window.localStorage.removeItem('lastSync')
          Promise.all(_promises).then(() => {
            resolve(tarefas)
          })
        }
      )
    }
  )
}

export function prepareForAproveRoute () {
  return new Promise(
    function (resolve, reject) {
      store.dispatch('synchronization/saveLastSync', {
        lastSync: null
      })
      store.dispatch('synchronizationMessages/saveLastSync', {
        lastSync: null
      })
      store.dispatch('synchronizationTasks/finishSync')
      window.localStorage.removeItem('lastSync')
      resolve()
    }
  )
}

/**
 * task/TR-698 - [WHP] [APP] Revisando sincronização de tarefas
 * Para sincronizar os dados com a API antiga os dados precisam ser tratados para serem iguais aos enviados pelo app antigo
 */
export function getAllTarefasForSync () {
  return new Promise(
    function (resolve, reject) {
      getters.getAll('tarefas').then(
        function (tarefas) {
          let arrayRetorno = []
          for (let index = 0; index < tarefas.length; index++) {
            let element = tarefas[index]
            arrayRetorno.push(element)
          }
          resolve(arrayRetorno)
        }
      )
    }
  )
}

export function changeTaskStatus (task, status = 'pendente', reference = null) {
  return new Promise(async (resolve, reject) => {
    switch (status) {
      case 'pendente':
      case 'interrompida':
        break
      case 'travelStarted':
        // verifica se existe alguma tarefa iniciada
        let tasks = store.getters['task/tasks']
        if (typeof tasks.all != 'undefined' && tasks.all.length) {
          if (tasks.travelStarted.length || tasks.travelDone.length || tasks.iniciada.length) {
            logTask(task.id, 'travelStartedFail', 'travelStartedFail')
            reference.$bus.$emit('showSnackBar', {
              message: this.$t('Existe uma tarefa em andamento'),
              duration: 1000
            })
            const ret = {
              msg: reference.$t('Existe uma tarefa em andamento')
            }
            return reject(ret)
          }
        }
        store.dispatch('task/startTravel')
        break

      case 'travelDone':
        store.dispatch('task/travelDone')
        break

      case 'iniciada':
        store.dispatch('task/startTask')
        break

      case 'concluida':
        break

      case 'malsucedida':
        store.dispatch('task/failTask')
        break
    }
    if (typeof reference == 'object') {
      reference.$bus.$emit('tasks-sync', true)
    }
    resolve(store.getters['task/currentTask'])
  })
}

export function deleteTaskById (idTask) {
  return setters.deleteOne('tarefas', idTask)
}

export function attPartsRemovedByTask (idTask, data) {
  return new Promise(function (resolve, reject) {
    download('?pullTracker[act]=get_pecas_removidas_por_tarefa&idTarefa=' + idTask).then((result) => {
      let pecasAtt = Object.entries(data.pecas.pecas)
      let pecasRemovidas = Object.entries(result.data.pecas)
      pecasAtt.forEach(peca => {
        pecasRemovidas.forEach(pecaR => {
          if (pecaR[0] == peca[0]) {
            delete data.pecas.pecas[pecaR[0]]
          }
        })
      })
      resolve(data)
    }).catch(() => {
      resolve(data)
    })
  })
}
