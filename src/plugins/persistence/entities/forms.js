import { getters, setters } from '@/plugins/persistence/services'
import store from '@/store/'

export default {
  async synchronization (loginSincData, synchronization) {
    for (let idxForm in loginSincData.formularios) {
      if (loginSincData.formularios.hasOwnProperty(idxForm)) {
        const form = loginSincData.formularios[idxForm]
        await this.insertForm(form)
      }
    }
    for (let idxCategoria in loginSincData.categorias) {
      if (loginSincData.categorias.hasOwnProperty(idxCategoria)) {
        const categoria = loginSincData.categorias[idxCategoria]
        await setters.setOne('form_categorias', categoria)
      }
    }
    for (let idxMetaCategoria in loginSincData.formMetaCategoria) {
      if (loginSincData.formMetaCategoria.hasOwnProperty(idxMetaCategoria)) {
        const metaCategoria = loginSincData.formMetaCategoria[idxMetaCategoria]
        await setters.setOne('form_meta_categorias', metaCategoria)
      }
    }
  },
  async insertForm (form) {
    await setters.setOne('formulario', form)
    await store.dispatch('form/putForm', {
      form: form
    })
  },
  getOneFormById (id) {
    return getters.getOne('formulario', id)
  },
  getAllForms () {
    return getters.getAll('formulario')
  }

}
