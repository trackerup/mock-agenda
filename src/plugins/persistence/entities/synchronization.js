import { getters } from '../services'

export function getDataForSyncAllTasks () {
  var retornoFuncao = new Promise(
    function (resolve, reject) {
      // Tarefas
      getters.getAll('tarefas').then(
        function (tarefas) {
          resolve(tarefas)
        }
      )
    }
  )
  return retornoFuncao
}
