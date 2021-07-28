import { getters, setters } from '../services'

export default {
  getOneWizardResponseByIdTarefa (idTarefa) {
    return getters.getOne('wizardResponse', idTarefa)
  },
  setOne (wizardResponse) {
    setters.setOne('wizardResponse', wizardResponse)
  },
  deleteOne (idTarefa) {
    this.getOneWizardResponseByIdTarefa(idTarefa).then(wizardResponse => {
      if (wizardResponse && wizardResponse.idTarefa) {
        setters.deleteOne('wizardResponse', wizardResponse.idTarefa)
      }
    })
  }
}
