import * as idb from 'idb'
import { configDB } from '@/plugins/persistence/config'

export function openDB () {
  if (!('indexedDB' in window)) {
    console.error('This browser doesn\'t support IndexedDB')
  } else {
    return configDB()
  }
  return false
}

export function unwrapDB () {
  return new Promise(async (resolve, reject) => {
    openDB().then(db => {
      resolve(idb.unwrap(db))
    })
  })
}
