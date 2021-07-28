import { getters, setters } from '@/plugins/persistence/services'
// import store from '@/store/'
export default {
  async synchronization (loginSincData, synchronization) {
    for (let idWizard in loginSincData.formWizards) {
      if (loginSincData.formWizards.hasOwnProperty(idWizard)) {
        const wizard = loginSincData.formWizards[idWizard]
        await this.insertFormWizard(wizard)
      }
    }
  },
  async insertFormWizard (formWizard) {
    await setters.setOne('form_wizard', formWizard)
  },
  async getOneFormWizardById (id) {
    return getters.getOne('form_wizard', id)
  }
}
