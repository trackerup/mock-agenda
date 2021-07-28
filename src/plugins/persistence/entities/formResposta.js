import { getters, setters } from '../services'
import uuidv4 from 'uuid/v4'

export async function saveResposta (listaRespostas) {
  return new Promise(async (resolve, reject) => {
    createResposta(listaRespostas).then(function (response) {
      resolve(response)
    })
  })
}

export function getResponseByTaskId (idTask) {
  return getters.searchItems('form_resposta', 'idTarefa', idTask)
}

export async function createResposta (responseData) {
  var response = {
    idTarefa: responseData.idTarefa,
    idForm: responseData.idForm,
    parent: (responseData.parent ? responseData.parent : 0),
    data: responseData.data,
    sinc: 0,
    concluida: 1,
    uuid: uuidv4(),
    responses: responseData.responses
  }
  // The attributes names on this object are in portuguese to attend the api requisition
  return setters.setOneWithInsertId('form_resposta', response).then(async function (setterReturnValue) {
    responseData.id = setterReturnValue
    return responseData
  })
}

export function saveRespostaPosSync (listaRespostas) {
  return new Promise(async (resolve, reject) => {
    if (listaRespostas.length > 0) {
      for (let index = 0; index < listaRespostas.length; index++) {
        getters.getOne('form_resposta', listaRespostas[index]).then(function (responseToUpdate) {
          responseToUpdate['sinc'] = 1
          setters.setOne('form_resposta', responseToUpdate)
        })
      }
    }
    resolve(listaRespostas)
  })
}

export function getAll () {
  return getters.getAll('form_resposta')
}
