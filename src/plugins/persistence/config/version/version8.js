export function upgradeV8 (dbPromise, transaction) {
  console.log('upgradeV7')
  let dbTarefas = transaction.objectStore('tarefas')
  dbTarefas.getAll().then(function (tarefas) {
    tarefas = tarefas.filter(task => {
      const _tzoffset = new Date().getTimezoneOffset() * 60000
      const _today = new Date(Date.now() - _tzoffset).toISOString().split('T')[0]
      if (task.dataTarefa != _today) {
        task.metaDados = task.metaDados.filter(element => {
          return element.meta_key != '__pre_resp'
        })
        dbTarefas.put(task)
      }
    })
  })
}

export function resetV8 (dbPromise) {
  dbPromise
    .transaction(['user'], 'readwrite')
    .objectStore('user')
    .clear()
  dbPromise
    .transaction(['user_meta'], 'readwrite')
    .objectStore('user_meta')
    .clear()
  dbPromise
    .transaction(['empresa_meta'], 'readwrite')
    .objectStore('empresa_meta')
    .clear()
  dbPromise
    .transaction(['formulario'], 'readwrite')
    .objectStore('formulario')
    .clear()
  dbPromise
    .transaction(['form_categorias'], 'readwrite')
    .objectStore('form_categorias')
    .clear()
  dbPromise
    .transaction(['form_listas'], 'readwrite')
    .objectStore('form_listas')
    .clear()
  dbPromise
    .transaction(['form_meta_categorias'], 'readwrite')
    .objectStore('form_meta_categorias')
    .clear()
  dbPromise
    .transaction(['locais'], 'readwrite')
    .objectStore('locais')
    .clear()
  dbPromise
    .transaction(['mensagens'], 'readwrite')
    .objectStore('mensagens')
    .clear()
  dbPromise
    .transaction(['registro_ponto'], 'readwrite')
    .objectStore('registro_ponto')
    .clear()
  dbPromise
    .transaction(['tarefas'], 'readwrite')
    .objectStore('tarefas')
    .clear()
  dbPromise
    .transaction(['task_download'], 'readwrite')
    .objectStore('task_download')
    .clear()
  dbPromise
    .transaction(['wizardResponse'], 'readwrite')
    .objectStore('wizardResponse')
    .clear()
  dbPromise
    .transaction(['tarefa_log'], 'readwrite')
    .objectStore('tarefa_log')
    .clear()
}
