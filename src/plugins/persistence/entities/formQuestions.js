import { openDB } from '@/plugins/persistence'

export default {
  syncFromForm: function (form) {
    return openDB()
      .then(function (db) {
        const tx = db.transaction('form_questions', 'readwrite')
        const pstore = tx.objectStore('form_questions')
        const txMQ = db.transaction('form_meta_questions', 'readwrite')
        const pstoreMQ = txMQ.objectStore('form_meta_questions')

        for (let idxItenForm in form.perguntas) {
          if (form.perguntas.hasOwnProperty(idxItenForm)) {
            const question = form.perguntas[idxItenForm]
            if (question.id) {
              pstore.put(question)
              // Delete all metadata
              let tagIndex = pstoreMQ.index('idPergunta')
              let pdestroy = tagIndex.openCursor(IDBKeyRange.only(question.id))
              pdestroy.onsuccess = function () {
                const cursor = pdestroy.result
                if (cursor) {
                  pstore.delete(cursor.primaryKey)
                  cursor.continue()
                }
              }
              for (let idxPergunta in question.metaDados) {
                if (question.metaDados.hasOwnProperty(idxPergunta)) {
                  pstoreMQ.put(question.metaDados[idxPergunta])
                }
              }
            }
          }
        }
      }).then(function () {
        return true
      })
  }
}
