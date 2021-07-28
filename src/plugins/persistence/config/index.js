import * as idb from 'idb'
import { upgradeV1 } from './version/version1.js'
import { upgradeV2 } from './version/version2.js'
import { upgradeV3 } from './version/version3.js'
import { upgradeV4 } from './version/version4.js'
import { upgradeV5 } from './version/version5.js'
import { upgradeV6 } from './version/version6.js'
import { upgradeV7 } from './version/version7.js'
import { upgradeV8, resetV8 } from './version/version8.js'

/**
 * Utilizando a Biblioteca de jakearchibald do IndexedDB
 *
 * Essa biblioteca trabalha com promises no lugar de eventos além de fornecer ferramentas de versionamento
 *
 * GIT - https://github.com/jakearchibald/idb
 * NPM - https://www.npmjs.com/package/idb
 * DOC - https://developers.google.com/web/ilt/pwa/working-with-indexeddb#indexeddb_terms
 */

export function configDB () {
  if (process.env.NODE_ENV == 'test') {
    idb.deleteDB(process.env.DATABASE_NAME)
  }
  return idb.openDB(process.env.DATABASE_NAME, process.env.DATABASE_VERSION, {
    upgrade (db, oldVersion, newVersion, transaction) {
      console.log('configDB - OLd Verison ' + oldVersion)
      console.log('configDB - New Verison ' + newVersion)
      switch (oldVersion) {
        case 0:
          upgradeV1(db, transaction)
        // eslint-disable-next-line no-fallthrough
        case 1:
          upgradeV2(db, transaction)
        // eslint-disable-next-line no-fallthrough
        case 2:
          upgradeV3(db, transaction)
          // eslint-disable-next-line no-fallthrough
        case 3:
          upgradeV4(db, transaction)
          // eslint-disable-next-line no-fallthrough
        case 4:
          upgradeV5(db, transaction)
          // eslint-disable-next-line no-fallthrough
        case 5:
          upgradeV6(db, transaction)
          // eslint-disable-next-line no-fallthrough
        case 6:
          upgradeV7(db, transaction)
          // eslint-disable-next-line no-fallthrough
        case 7:
          upgradeV8(db, transaction)
      }
    }
  })
}

export function resetDB () {
  return idb.openDB(process.env.DATABASE_NAME, process.env.DATABASE_VERSION)
    .then(function (db) {
      return resetV8(db)
    })
}
