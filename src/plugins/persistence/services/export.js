import { unwrapDB } from '@/plugins/persistence'
import IDBExportImport from 'indexeddb-export-import'

/**
 *
 * @returns {Promise} Return Promise with jsonstring
 */
export function exportData () {
  return new Promise(
    function (resolve, reject) {
      unwrapDB().then(function (idbDatabase) {
        IDBExportImport.exportToJsonString(idbDatabase, function (err, jsonString) {
          if (err) {
            reject(err)
          } else {
            resolve(jsonString)
          }
        })
      }).catch(function (e) {
        reject(e)
      })
    }
  )
}

/**
 * See more in https://developers.google.com/web/ilt/pwa/working-with-indexeddb#reading_data
 *
 * @param {String}  jsonString String json a ser importada
 *
 * @returns {Promise} Return Promise
 */
export function importData (jsonString) {
  return new Promise(
    function (resolve, reject) {
      unwrapDB().then(function (idbDatabase) {
        IDBExportImport.clearDatabase(idbDatabase, function (err) {
          if (!err) { // cleared data successfully
            IDBExportImport.importFromJsonString(idbDatabase, jsonString, function (err) {
              if (err) {
                reject(err)
              } else {
                resolve('Imported data successfully')
              }
            })
          } else {
            reject(err)
          }
        })
      }).catch(function (e) {
        reject(e)
      })
    }
  )
}
