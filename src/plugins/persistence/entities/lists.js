import { getters, setters } from '@/plugins/persistence/services'

export default {
  async synchronization (loginSincData, synchronization) {
    for (let idxList in loginSincData.listas) {
      if (loginSincData.listas.hasOwnProperty(idxList)) {
        const list = loginSincData.listas[idxList]
        await this.insertList(list)
      }
    }
  },
  async insertList (list) {
    await setters.setOne('form_listas', list)
  },
  async getFormList (list) {
    return getters.getOne('form_listas', list)
  }
}
