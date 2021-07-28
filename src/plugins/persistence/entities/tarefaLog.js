import { getters, setters } from '../services'
import store from '@/store'

export function getAllTarefasLogForSync () {
  var retornoFuncao = new Promise(
    function (resolve, reject) {
      getters.getAll('tarefa_log').then(
        function (log) {
          var arrayRetorno = []
          for (let index = 0; index < log.length; index++) {
            var element = log[index]
            if (element['sinc'] == 0 || element['sinc'] == '0') {
              element['key'] = element['id']
              element['idApp'] = element['id']
              element['id'] = null
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

export function getOneLogById (id) {
  return getters.getOne('tarefa_log', id)
}

export function saveTarefasLogPosSync (listaLogs) {
  return new Promise(async (resolve, reject) => {
    if (typeof listaLogs === 'undefined') {
      resolve(listaLogs)
      return false
    }
    if (listaLogs.length === 0) {
      resolve(listaLogs)
      return false
    }
    for (let index = 0; index < listaLogs.length; index++) {
      let dbLog = await getOneLogById(listaLogs[index]['key'])

      if (dbLog) {
        if (dbLog.key) {
          dbLog.id = dbLog.key
        }
        dbLog.sinc = 1
        await setters.deleteOne('tarefa_log', dbLog.id)
      }
    }
    resolve(listaLogs)
  })
}

export function logTask (idTask, texto, logType) {
  setters.setOne('tarefa_log', {
    idTarefa: idTask,
    tipo: logType,
    valor: texto,
    time: new Date().getTime(),
    hash: ' ',
    sinc: 0
  })
}

export function logRotaForTask (focusTask) {
  const coords = store.getters['user/coords']
  if (!coords) {
    logTask(focusTask.id, JSON.stringify({'status': 'GEOLOCATION_FAIL'}), 'rotaFail')
    return false
  }
  // eslint-disable-next-line
  var directionsService = new google.maps.DirectionsService()
  directionsService.route({
    // eslint-disable-next-line
    origin: new google.maps.LatLng(coords.latitude, coords.longitude),
    // eslint-disable-next-line
    destination: new google.maps.LatLng(focusTask.latitude, focusTask.longitude),
    travelMode: 'DRIVING',
    provideRouteAlternatives: false
  }, function (response, status) {
    if (status === 'OK') {
      logTask(focusTask.id, JSON.stringify(response), 'rota')
      var pontos = decodePolyline(response.routes[0].overview_polyline)
      var marks = [
        {
          lat: parseFloat(coords.latitude),
          lng: parseFloat(coords.longitude),
          label: 'A',
          cor: 'FF0000'
        },
        {
          lat: parseFloat(focusTask.latitude),
          lng: parseFloat(focusTask.latitude),
          label: 'B',
          cor: '0000FF'
        }
      ]
      var pts = [
        {
          cor: 'FF0000',
          weight: 5,
          latLngString: makeStringOfLatLng(pontos)
        }
      ]
      logTask(focusTask.id, urlForMap(marks, pts), 'rotaUrl')
    } else {
      logTask(focusTask.id, JSON.stringify(response), 'rotaFail')
    }
  })
}

export function urlForMap (markers, paths) {
  var urlBase = 'https://maps.googleapis.com/maps/api/staticmap?&key=AIzaSyBD1aOJIDLTR81Cwv_B_aI8am_R7aCujLA&size=' + window.innerWidth + 'x240'
  if (typeof markers === 'object') {
    if (Array.isArray(markers)) {
      for (let i = 0; i < markers.length; i++) {
        urlBase += '&markers=color:0x' + markers[i].cor + 'ff|label:' + markers[i].label + '|' + markers[i].lat + ',' + markers[i].lng
      }
    }
  }

  if (typeof paths === 'object') {
    if (Array.isArray(paths)) {
      for (let i = 0; i < paths.length; i++) {
        urlBase += '&path=color:0x' + paths[i].cor + 'ff|weight:' + paths[i].weight + '|' + paths[i].latLngString
      }
    }
  }

  return urlBase
}

export function makeStringOfLatLng (pontos) {
  var first = true
  var stringToReturn = ''
  for (var p = 0; p < pontos.length; p++) {
    if (first) {
      first = false
    } else {
      stringToReturn += '|'
    }
    stringToReturn += pontos[p].latitude + ',' + pontos[p].longitude
  }
  return stringToReturn
}

export function decodePolyline (encoded) {
  var points = []
  var index = 0
  var len = encoded.length
  var lat = 0
  var lng = 0
  while (index < len) {
    var b
    var shift = 0
    var result = 0
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    var dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
    lat += dlat
    shift = 0
    result = 0
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    var dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
    lng += dlng
    points.push({
      latitude: (lat / 1E5),
      longitude: (lng / 1E5)
    })
  }
  return points
}
