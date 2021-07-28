import { setters, getters } from '../../persistence/services'

export default {
  async synchronization (loginSincData, synchronization) {
    let metaData = loginSincData.meta

    for (let idxMeta in metaData.meta_empresa) {
      if (metaData.meta_empresa.hasOwnProperty(idxMeta)) {
        await setters.setOne('empresa_meta', {
          empresa: loginSincData.user.empresa,
          meta_key: idxMeta,
          meta_value: metaData.meta_empresa[idxMeta].valor
        })
      }
    }
    for (let idxMetaUser in metaData.meta_user) {
      if (metaData.meta_user.hasOwnProperty(idxMetaUser)) {
        await setters.setOne('user_meta', {
          user: loginSincData.user.id,
          meta_key: idxMetaUser,
          meta_value: metaData.meta_user[idxMetaUser].valor
        })
      }
    }
  },
  async getUserMeta (id) {
    return getters.getOne('user_meta', id)
      .then(response => {
        return response
      })
  },
  async getEmpresaMeta (id) {
    return getters.getOne('empresa_meta', id)
      .then(response => {
        return response
      })
  }
}
