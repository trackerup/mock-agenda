export function upgradeV1 (dbPromise) {
  dbPromise.createObjectStore('user', {
    keyPath: 'id',
    autoIncrement: true
  })
  let dbMetaUser = dbPromise.createObjectStore('user_meta', {
    keyPath: ['user', 'meta_key'],
    autoIncrement: false
  })
  dbMetaUser.createIndex('user', 'user', {unique: false})

  let dbMetaEmpresa = dbPromise.createObjectStore('empresa_meta', {
    keyPath: ['empresa', 'meta_key'],
    autoIncrement: false
  })
  dbMetaEmpresa.createIndex('empresa', 'empresa', {unique: false})

  dbPromise.createObjectStore('formulario', {
    keyPath: 'id',
    autoIncrement: true
  })
  dbPromise.createObjectStore('form_categorias', {
    keyPath: 'id',
    autoIncrement: true
  })

  dbPromise.createObjectStore('form_listas', {
    keyPath: 'id',
    autoIncrement: true
  })

  let dbFormMetaCategoria = dbPromise.createObjectStore('form_meta_categorias', {
    keyPath: ['idCategoria', 'idFormulario'],
    autoIncrement: false
  })
  dbFormMetaCategoria.createIndex('idCategoria', 'idCategoria', {unique: false})

  dbPromise.createObjectStore('locais', {
    keyPath: 'id',
    autoIncrement: true
  })

  const dbMensagens = dbPromise.createObjectStore('mensagens', {
    keyPath: 'id',
    autoIncrement: true
  })
  dbMensagens.createIndex('autor', 'autor', {unique: false})
  dbMensagens.createIndex('enviada', 'enviada', {unique: false})

  dbPromise.createObjectStore('registro_ponto', {
    keyPath: 'id',
    autoIncrement: true
  })

  const dbTarefas = dbPromise.createObjectStore('tarefas', {
    keyPath: 'id',
    autoIncrement: true
  })

  dbTarefas.createIndex('status', 'status', {unique: false})
  dbTarefas.createIndex('dataTarefa', 'dataTarefa', {unique: false})
  dbTarefas.createIndex('status, dataTarefa', ['status', 'dataTarefa'], {unique: false})
  dbTarefas.createIndex('dataTarefa, sinc', ['dataTarefa', 'sinc'], {unique: false})

  dbPromise.createObjectStore('task_download', {
    keyPath: 'idTarefa',
    autoIncrement: true
  })
}

export function resetV1 (dbPromise) {
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
}
