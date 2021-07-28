import { getters, setters } from '../services'
import store from '@/store'
import { registerFolhaPonto, sendUserStatus } from '@/services/folhaPonto'
import uuidv4 from 'uuid/v4'

export async function registraPonto (batida) {
  return setters.setOneWithInsertId('registro_ponto', {
    idUsuario: batida.idUsuario,
    timeBatida: batida.timeBatida,
    tipo: batida.tipo,
    origem: batida.origemBatida,
    sinc: 0,
    uuid: uuidv4()
  }).then(async function (setterReturnValue) {
    return setterReturnValue
  })
}

export function registraEntrada () {
  getters.getAll('registro_ponto').then(
    function (registroPonto) {
      let user = store.getters['user/user']
      let batidaEntrada = {}
      if (registroPonto && registroPonto.length > 0 && (registroPonto[registroPonto.length - 1].tipo === 1 || registroPonto[registroPonto.length - 1].tipo === 3)) {
        // se não foi dado saida porém foi no dia anterior fecha-se o ponto antigo as 23:59
        var lastStart = new Date()
        lastStart.setTime(registroPonto[registroPonto.length - 1].timeBatida ? registroPonto[registroPonto.length - 1].timeBatida : registroPonto[registroPonto.length - 1].timeServer * 1000)
        lastStart.setHours(0, 0, 0, 0)
        var today = new Date()
        today.setHours(0, 0, 0, 0)
        if (today.getTime() !== lastStart.getTime()) {
          let yesterday = new Date()
          yesterday.setDate(today.getDate() - 1)
          yesterday.setHours(23, 59, 59, 0)
          var batida = {}
          batida['tipo'] = 2
          batida['timeBatida'] = yesterday.getTime()
          batida['origemBatida'] = 'entradaSemSaida'
          batida['idUsuario'] = user.id
          registraPonto(batida).then(function (valorIdResp) {
            batida['idOnApp'] = valorIdResp
            // atualizaPonto(batida)
          })
          // registra batida atual
          batidaEntrada['tipo'] = 3
          batidaEntrada['timeBatida'] = new Date().getTime()
          batidaEntrada['origemBatida'] = 'registrarEntrada'
          batidaEntrada['idUsuario'] = user.id
          registraPonto(batidaEntrada).then(function (valorIdResp) {
            batidaEntrada['idOnApp'] = valorIdResp
            // atualizaPonto(batidaEntrada)
          })
        }
      } else {
        batidaEntrada['tipo'] = 3
        batidaEntrada['timeBatida'] = new Date().getTime()
        batidaEntrada['origemBatida'] = 'registrarEntrada'
        batidaEntrada['idUsuario'] = user.id
        registraPonto(batidaEntrada).then(function (valorIdResp) {
          batidaEntrada['idOnApp'] = valorIdResp
          // atualizaPonto(batidaEntrada)
        })
      }
    }
  )
}

export function registrarSaida () {
  getters.getAll('registro_ponto').then(
    function (registroPonto) {
      if (registroPonto && registroPonto.length > 0 && registroPonto[registroPonto.length - 1].tipo === 2) {

      } else {
        let user = store.getters['user/user']
        var batida = {}
        batida['tipo'] = 4
        batida['timeBatida'] = new Date().getTime()
        batida['origemBatida'] = 'registrarSaida'
        batida['idUsuario'] = user.id
        registraPonto(batida).then(function (valorIdResp) {
          batida['idOnApp'] = valorIdResp
          window.localStorage.setItem('status_ponto', '-1')
          // atualizaPonto(batida)
        })
      }
    }
  )
}

export function atualizaPonto (batida) {
  batida['pullTracker'] = {
    'act': 'registerFolhaPonto'
  }
  if (batida['tipo'] === 1 || batida['tipo'] === 3) {
    batida['tipo'] = 3
  } else {
    batida['tipo'] = 4
  }
  batida['origem'] = 'atualizaPonto'
  batida['timeEnvio'] = new Date().getTime()
  registerFolhaPonto(batida).then((data) => {
    if (data.status == 'ok') {
      atualizaBatidaServer(data.registro)
    }
  }).catch(({ data }) => {
    const mensagem = data.mensagem || data.error
    console.log(mensagem)
    // reject(mensagem)
  })
}

export function atualizaBatidaServer (json) {
  let user = store.getters['user/user']
  let _batida = {
    hashTempo: json.hashTempo,
    idServer: json.id,
    idRegistro: json.idRegistro,
    idUsuario: user.id,
    sinc: 1,
    timeBatida: Date.parse(json.timeBatida),
    timeEnvio: Date.parse(json.timeEnvio),
    timeServer: Date.parse(json.timeServer),
    tipo: json.tipo,
    uuid: json.uuid ? json.uuid : uuidv4()
  }
  if (json.idOnApp) {
    _batida.id = parseInt(json.idOnApp)
  }
  setters.setOne('registro_ponto', _batida)
}

export function getOnePontoById (id) {
  return getters.getOne('registro_ponto', id)
}

export function getAllRegistroPontoForSync () {
  var retornoFuncao = new Promise(
    function (resolve, reject) {
      getters.getAll('registro_ponto').then(
        function (ponto) {
          var arrayRetorno = []
          for (let index = 0; index < ponto.length; index++) {
            var element = ponto[index]
            if (element['sinc'] === 0 || element['sinc'] === '0') {
              element['idOnApp'] = element['id']
              arrayRetorno.push(element)
            }
          }
          resolve(arrayRetorno)
        }
      )
    }
  )
  return retornoFuncao
}

export function saveRegistroPontoPosSync (lastPoint) {
  return new Promise(async (resolve, reject) => {
    if (!lastPoint) {
      reject(lastPoint)
    } else {
      lastPoint.sinc = 1
      let dbLog = await getters.searchItembyIndex('registro_ponto', 'uuid', lastPoint.uuid)
      if (!dbLog) {
        let _batida = {
          hashTempo: lastPoint.hashTempo,
          idServer: lastPoint.id,
          idRegistro: lastPoint.idRegistro,
          idUsuario: lastPoint.idUsuario,
          sinc: lastPoint.sinc,
          timeBatida: Date.parse(lastPoint.timeBatida),
          timeEnvio: Date.parse(lastPoint.timeEnvio),
          timeServer: Date.parse(lastPoint.timeServer),
          tipo: lastPoint.tipo,
          uuid: lastPoint.uuid ? lastPoint.uuid : uuidv4()
        }
        await setters.setOne('registro_ponto', _batida)
        resolve(_batida)
      }
      resolve(dbLog)
    }
  })
}

export function informUserStatus (options) {
  let user = store.getters['user/user']
  let data = {
    pullTracker: {
      act: options['act']
    },
    user: user.id,
    token: user.token,
    extra: options
  }
  sendUserStatus(data).then((data) => {
    console.log(data)
  }).catch(({ data }) => {
    const mensagem = data.mensagem || data.error
    console.log(mensagem)
    // reject(mensagem)
  })
}
