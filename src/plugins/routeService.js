import { mapGetters } from 'vuex'
import metaData from '@/plugins/persistence/entities/metaData'
import store from '@/store/'

export default {
  data () {
    return {
      distanciaMinima: 1000
    }
  },

  // Evitar de pegar dados do store no monted hook,
  // Pegar dados do store desta forma. Os dados ficam 'dinamicos' quando
  // mudam de estado. Se pegar os dados de store no mounted, a variavel
  // nunca sera atualizada, mantendo sempre o valor de quando o componente
  // foi montado.
  computed: {
    ...mapGetters({
      tasks: 'task/tasks',
      currentTask: 'task/currentTask',
      user: 'user/user',
      coords: 'user/coords'
    })
  },
  watch: {
    coords (value) {
      this.listenRouteService(value)
    }
  },
  async created () {
  },
  mounted () {
    this.listenRouteService()
  },
  methods: {
    listenRouteService () {
      console.log('LISTENERS ROUTESERVICE')
      let _self = this
      if (typeof _self.tasks.travelStarted != 'undefined' && _self.tasks.travelStarted.length > 0) {
        store.dispatch('task/setCurrentTask', {task: _self.tasks.travelStarted[0]})
        let distanciaAtual = _self.$routeService.medir(_self.currentTask.latitude, _self.currentTask.longitude, _self.coords.latitude, _self.coords.longitude)
        if (distanciaAtual <= 50) {
          this.$geolocation.stopTravelling()
          store.dispatch('task/travelDone')
          _self.$router.push('/task/' + _self.currentTask.id)
          const snackbar = {
            message: _self.$t('Sua chegada foi informada automaticamente'),
            duration: 5000
          }
          _self.$bus.$emit('showSnackBar', snackbar)

          window.cordova.plugins.notification.local.schedule({
            title: 'TrackerUp',
            text: _self.$t('Sua chegada foi informada automaticamente'),
            icon: 'res://icon'
          })
        }
      }
    }
  },
  permitirInformarChegadaTarefaAtual: async function (reference) {
    this.currentTask = store.getters['task/currentTask']
    this.coords = store.getters['user/coords']
    this.user = store.getters['user/user']
    // Caso a distancia minima não tenha sido definida ela seta um valor padrão de 1km de distancia
    this.distanciaMinima = await metaData.getUserMeta([this.user.id, 'DistanciaChegada'])
    if (typeof this.coords == 'undefined' || this.coords == null) {
      return true // reference.$t('Não é possível identificar sua localização, favor verificar seu GPS.')
    } else {
      if (typeof this.distanciaMinima == 'undefined' || this.distanciaMinima.meta_value == null) {
        this.distanciaMinima = {
          meta_key: 'DistanciaChegada',
          meta_value: 1000
        }
      }

      let distanciaAtual = this.medir(this.currentTask.latitude, this.currentTask.longitude, this.coords.latitude, this.coords.longitude)
      if (distanciaAtual >= this.distanciaMinima.meta_value) {
        return reference.$t('Não é possível informar chegada a mais de ') + this.distanciaMinima.meta_value + reference.$t(' m do local. Distância atual:') + ' ' + distanciaAtual + ' m'
      } else {
        return true
      }
    }
  },
  permitirIniciarTarefaAtual: async function (reference) {
    this.currentTask = store.getters['task/currentTask']
    this.coords = store.getters['user/coords']
    this.user = store.getters['user/user']
    // Caso a distancia minima não tenha sido definida ela seta um valor padrão de 1km de distancia
    this.distanciaMinima = await metaData.getUserMeta([this.user.id, 'IniciarTarefa'])
    if (typeof this.coords == 'undefined' || this.coords == null) {
      return true // reference.$t('Não é possível identificar sua localização, favor verificar seu GPS.')
    } else {
      if (typeof this.distanciaMinima == 'undefined' || this.distanciaMinima.meta_value == null) {
        this.distanciaMinima = {
          meta_key: 'IniciarTarefa',
          meta_value: 200
        }
      }

      let distanciaAtual = this.medir(this.currentTask.latitude, this.currentTask.longitude, this.coords.latitude, this.coords.longitude)
      if (distanciaAtual >= this.distanciaMinima.meta_value) {
        return reference.$t('Não é possível iniciar o atendimento a mais de ') + this.distanciaMinima.meta_value + reference.$t(' m do local. Distância atual:') + ' ' + distanciaAtual + ' m'
      } else {
        return true
      }
    }
  },
  medir: function (lat1, lng1, lat2, lng2) {
    lat1 = parseFloat(lat1)
    lng1 = parseFloat(lng1)
    lat2 = parseFloat(lat2)
    lng2 = parseFloat(lng2)

    var R = 6378.137 // Radius of earth in KM
    var dLat = (lat2 - lat1) * Math.PI / 180
    var dLon = (lng2 - lng1) * Math.PI / 180
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c

    return Math.round(d * 1000) // meters
  }
}
