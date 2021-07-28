export function upgradeV5 (dbPromise) {
  console.log('upgradeV5')
  try {
    dbPromise.deleteObjectStore('tarefa_log')
  } catch (e) {
    console.log(e)
  }
  dbPromise.createObjectStore('tarefa_log', {
    keyPath: 'id',
    autoIncrement: true
  })
}

export function resetV5 (dbPromise) {
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
  dbPromise.transaction(['tarefa_log'], 'readwrite').objectStore('tarefa_log').clear()
}
