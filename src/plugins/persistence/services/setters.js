import { openDB } from '@/plugins/persistence'

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter
 * @param {Object}  item  Item a ser inserido
 *
 * @returns {Object} Return elemento no banco
 */
export function setOne (table, item, optionalKey) {
  return openDB()
    .then(function (db) {
      const tx = db.transaction(table, 'readwrite')
      const store = tx.objectStore(table)
      if (typeof optionalKey != 'undefined') {
        store.put(item, optionalKey)
      } else {
        store.put(item)
      }
      return tx.complete
    }).then(function (data) {
      // console.log('added itens to the store ' + table + '!')
      return data
    })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter
 * @param {Object}  item  Item a ser inserido
 *
 * @returns {Object} Return o id do Elemento Inserido
 */
export function setOneWithInsertId (table, item) {
  return new Promise(
    function (resolve, reject) {
      openDB()
        .then(function (db) {
          const tx = db.transaction(table, 'readwrite')
          const store = tx.objectStore(table)
          var insertionQuery = store.add(item).then(function (e) {
            resolve(e)
            return tx.complete
          }).catch(function (e) {
            reject(e)
            return tx.complete
          })

          return insertionQuery
        })
    })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter
 * @param {Object}  listaItens  Item a ser inserido
 *
 * @returns {Object} Return elemento no banco
 */
export function setArray (table, listaItens) {
  return openDB()
    .then(function (db) {
      const tx = db.transaction(table, 'readwrite')
      for (const key in listaItens) {
        if (listaItens.hasOwnProperty(key)) {
          const element = listaItens[key]
          const store = tx.objectStore(table)
          store.put(element)
        }
      }
    }).then(function () {
      // console.log('added itens to the store ' + table + '!')
      return true
    })
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter
 * @param {Object}  listaItens  Item a ser inserido
 *
 * @returns {Object} Return elemento no banco
 */
export function deleteOne (table, element) {
  return openDB()
    .then(function (db) {
      const tx = db.transaction(table, 'readwrite')
      const store = tx.objectStore(table)
      store.delete(element)
    }).then(function () {
      // console.log('added itens to the store ' + table + '!')
      return true
    })
}
/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {Object}  table  Nome da tabela que deseja obter
 * @param {Object}  listaItens  Item a ser inserido
 *
 * @returns {Object} Return elemento no banco
 */
export function deleteAll (table) {
  return openDB()
    .then(function (db) {
      db.transaction(table, 'readwrite').objectStore(table).clear()
    }).then(function () {
      return true
    })
}
