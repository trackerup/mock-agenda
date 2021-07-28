import { openDB } from '@/plugins/persistence'

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter
 * @param {Object}  id  Id do elemento desejado
 *
 * @returns {Object} Return elemento no banco
 */
export async function getOne (table, id) {
  let elemento
  return openDB()
    .then(function (db) {
      const tx = db.transaction(table, 'readonly')
      const store = tx.objectStore(table)
      elemento = store.get(id)
    }).then(function () {
      return elemento
    })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter todos os elementos
 *
 * @returns {Object} Return elemento no banco
 */
export async function getAll (table) {
  return openDB()
    .then(function (db) {
      const tx = db.transaction(table, 'readonly')
      const store = tx.objectStore(table)
      return store.getAll()
    }).then(function (val) {
      return val
    })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter todos os elementos
 * @param {Object}  indexName  nome do indice que deseja buscar
 * @param {Object}  value  valor do indice
 *
 * @returns {Object} Return uma promise
 */
export async function searchItems (table, indexName, value) {
  const range = IDBKeyRange.only(value)
  const listItens = []
  return openDB()
    .then(function (db) {
      const tx = db.transaction(table, 'readonly')
      const store = tx.objectStore(table)
      const index = store.index(indexName)
      return index.openCursor(range)
    }).then(function showRange (cursor) {
      if (!cursor) {
        return
      }
      listItens.push(cursor.value)
      return cursor.continue().then(showRange)
    }).then(function () {
      return listItens
    })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter todos os elementos
 * @param {Object}  indexName  nome do indice que deseja buscar
 * @param {Object}  lower  menor valor do indice
 * @param {Object}  upper  maior valor do indice
 *
 * @returns {Object} Return elemento no banco
 */
export async function searchItemsbyRange (table, indexName, lower, upper) {
  if (lower == '' && upper == '') { return }

  let range
  const listItens = []
  if (lower != '' && upper != '') {
    range = IDBKeyRange.bound(lower, upper)
  } else if (lower == '') {
    range = IDBKeyRange.upperBound(upper)
  } else {
    range = IDBKeyRange.lowerBound(lower)
  }

  return openDB().then(function (db) {
    const tx = db.transaction(table, 'readonly')
    const store = tx.objectStore(table)
    const index = store.index(indexName)
    return index.openCursor(range)
  }).then(function showRange (cursor) {
    if (!cursor) {
      return
    }
    listItens.push(cursor.value)
    return cursor.continue().then(showRange)
  }).then(function () {
    return listItens
  })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter todos os elementos
 * @param {Object}  indexName  nome do indice que deseja buscar
 * @param {Object}  indexValue  menor valor do indice
 *
 * @returns {Object} Return um unico elemento no banco que bate exatamente com o indece informado
 */
export async function searchItembyIndex (table, indexName, indexValue) {
  return openDB().then(function (db) {
    if (!indexValue) {
      return false
    }
    let range = IDBKeyRange.only(indexValue)

    const tx = db.transaction(table, 'readonly')
    const store = tx.objectStore(table)
    const index = store.index(indexName)
    return index.openCursor(range)
  }).then(function showRange (cursor) {
    if (!cursor) {
      return false
    }
    return cursor.value
  })
}
