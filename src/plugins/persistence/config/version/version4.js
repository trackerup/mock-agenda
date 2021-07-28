export function upgradeV4 (dbPromise) {
  console.log('upgradeV4')
  dbPromise.createObjectStore('tarefa_log', {
    keyPath: 'id',
    autoIncrement: true
  })
}
