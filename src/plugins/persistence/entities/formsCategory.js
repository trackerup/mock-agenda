import { getters, setters } from '@/plugins/persistence/services'
// import store from '@/store/'

export default {
  async insertFormCategory (category) {
    await setters.setOne('form_categorias', category)
  },
  getAllFormsCategory () {
    return getters.getAll('form_categorias')
  },
  saveFormsCategoryPosSync (listaFormsCategory) {
    return new Promise(async (resolve, reject) => {
      if (listaFormsCategory.length > 0) {
        for (let index = 0; index < listaFormsCategory.length; index++) {
          getters.getOne('form_resposta', listaFormsCategory[index]).then(function (responseToUpdate) {
            responseToUpdate['sinc'] = 1
            setters.setOne('form_categorias', responseToUpdate)
          })
        }
      }
      resolve(listaFormsCategory)
    })
  },
  async insertFormMetaCategory (meta) {
    await setters.setOne('form_meta_categorias', meta)
  },
  getAllFormsMetaCategory () {
    return getters.getAll('form_meta_categorias')
  },
  saveFormsMetaCategoryPosSync (listaFormsMetaCategory) {
    return new Promise(async (resolve, reject) => {
      if (listaFormsMetaCategory.length > 0) {
        for (let index = 0; index < listaFormsMetaCategory.length; index++) {
          getters.getOne('form_resposta', listaFormsMetaCategory[index]).then(function (responseToUpdate) {
            responseToUpdate['sinc'] = 1
            setters.setOne('form_categorias', responseToUpdate)
          })
        }
      }
      resolve(listaFormsMetaCategory)
    })
  }
}
