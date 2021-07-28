import { setters, getters } from '@/plugins/persistence/services'

export function getAll () {
  return getters.getAll('locais').then(function (listaLocais) {
    listaLocais.sort(function (a, b) {
      return a.nome.localeCompare(b.nome)
    })
    return listaLocais
  })
}

export default {
  async synchronization (loginSincData, synchronization) {
    for (let idxLocal in loginSincData.locais) {
      if (loginSincData.locais.hasOwnProperty(idxLocal)) {
        const local = loginSincData.locais[idxLocal]
        await this.insertLocal(local)
      }
    }
  },
  async insertLocal (local) {
    let newLocal = {
      id: local.id,
      nome: local.nome,
      endereco: local.endereco,
      lat: local.lat,
      lng: local.lng,
      status: local.status
    }
    await setters.setOne('locais', newLocal)
  }
}
