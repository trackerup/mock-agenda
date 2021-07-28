import { getters, setters } from '../services'
import moment from 'moment'

export function getMessagesHoje () {
  const hoje = new Date().toISOString().split('T')[0]

  return getters.searchItems('mensagens', 'dataMessage', hoje)
}

export function getOneMessageById (id) {
  return getters.getOne('mensagens', id)
}

export function getMessagesTodayByStatus (status) {
  const hoje = new Date().toISOString().split('T')[0]

  return getters.searchItems('mensagens', 'status, dataMessage', [status, hoje])
}

export function saveMessages (listaMessages) {
  return setters.setArray('mensagens', listaMessages)
}

export function saveOneMessage (message) {
  const uuidv4 = require('uuid/v4')
  var msgToSave = {
    id: uuidv4(),
    user: message.user,
    autor: (message.autor ? message.autor : message.user),
    status: 0,
    mensagem: message.mensagem,
    bosslida: (message.bosslida ? message.bosslida : null),
    criada: (message.criada ? message.criada : moment().format('X')),
    enviada: (message.enviada ? message.enviada : null),
    entregue: (message.entregue ? message.entregue : null),
    lida: (message.lida ? message.lida : null)
  }

  return setters.setOneWithInsertId('mensagens', msgToSave).then(async function (setterReturnValue) {
    return setterReturnValue
  })
}

export function getAll () {
  return getters.getAll('mensagens').then(function (listaMensagensPorData) {
    listaMensagensPorData.sort(function (a, b) {
      return a.criada - b.criada
    })

    return listaMensagensPorData
  })
}

export function getMessagesForSync () {
  return new Promise(
    function (resolve, reject) {
      getters.getAll('mensagens').then(
        function (mensagens) {
          let arrayRetorno = []
          for (let index = 0; index < mensagens.length; index++) {
            let element = mensagens[index]
            if (element['enviada'] == null) {
              arrayRetorno.push(element)
            }
          }
          resolve(arrayRetorno)
        }
      )
    }
  )
}
