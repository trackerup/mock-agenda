export function upgradeV6 (dbPromise, transaction) {
  console.log('upgradeV6')
  dbPromise.createObjectStore('form_wizard', {
    keyPath: 'id',
    autoIncrement: false
  })

  let dbTarefas = transaction.objectStore('tarefas')
  dbTarefas.createIndex('uuid', 'uuid', {unique: false})
}

export function resetV6 (dbPromise) {
  dbPromise.transaction(['user'], 'readwrite').objectStore('user').clear()
  dbPromise.transaction(['user_meta'], 'readwrite').objectStore('user_meta').clear()
  dbPromise.transaction(['empresa_meta'], 'readwrite').objectStore('empresa_meta').clear()
  dbPromise.transaction(['formulario'], 'readwrite').objectStore('formulario').clear()
  dbPromise.transaction(['form_categorias'], 'readwrite').objectStore('form_categorias').clear()
  dbPromise.transaction(['form_listas'], 'readwrite').objectStore('form_listas').clear()
  dbPromise.transaction(['form_meta_categorias'], 'readwrite').objectStore('form_meta_categorias').clear()
  dbPromise.transaction(['locais'], 'readwrite').objectStore('locais').clear()
  dbPromise.transaction(['mensagens'], 'readwrite').objectStore('mensagens').clear()
  dbPromise.transaction(['registro_ponto'], 'readwrite').objectStore('registro_ponto').clear()
  dbPromise.transaction(['tarefas'], 'readwrite').objectStore('tarefas').clear()
  dbPromise.transaction(['task_download'], 'readwrite').objectStore('task_download').clear()
  dbPromise.transaction(['wizardResponse'], 'readwrite').objectStore('wizardResponse').clear()
  dbPromise.transaction(['form_wizard'], 'readwrite').objectStore('form_wizard').clear()
}
