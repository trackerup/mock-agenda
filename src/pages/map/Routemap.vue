<template>
  <div>
    <div class="content-page">
      <div class="google-map" :ref="mapName"></div>
    </div>
    <div class="actions-bottom-left">
      <button @click="$router.push('/messages')"
        class="mdl-button  mdl-button--fab  orange">
        <i class="material-icons message">message</i>
      </button>
    </div>
  </div>
</template>
<script>
/* global google */
import Vue from 'vue'
import { mapGetters } from 'vuex'
// import { existsInArray } from '../../utils'
import SynchronizationRoute from '../../plugins/routes/synchronizationRoute'
import { getTarefasByDate } from '../../plugins/persistence/entities/tarefa'

export default {
  name: 'Routemap',
  data: () => ({
    mapName: 'task-map',
    tasksMorning: [],
    tasksEvening: [],
    tasksNight: [],
    tasksDawn: [],
    synchronizationRoute: null,
    map: null,
    mapOptions: null
  }),
  computed: {
    ...mapGetters({
      tasks: 'task/tasks',
      user: 'user/user',
      coords: 'user/coords',
      viewDate: 'task/viewDate'
    })
  },
  async created () {
    await this.$store.dispatch('task/getTasks', {})
    this.$geolocation.getLocation(this)
  },
  beforeMount () {
    const ComponentTasksClass = Vue.extend(SynchronizationRoute)
    this.synchronizationRoute = new ComponentTasksClass()
  },
  mounted () {
    this.$bus.$emit('tasks-sync', true)
    this.$emit('changeParams', {
      pageTitle: this.$t('Rota no mapa'),
      mapMenu: false,
      backMenu: true
    })
    if (this.map == null) {
      this.initializeMapRota()
      this.sortTasksByPeriod()
    }
  },
  methods: {
    initializeMapRota: function () {
      var element = {
        latitude: -23.5422851,
        longitude: -46.6402859
      }

      this.mapOptions = {
        center: new google.maps.LatLng(element.latitude, element.longitude),
        zoom: 17,
        mapTypeControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_LEFT
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      var mapContainer = this.$refs[this.mapName]
      this.map = new google.maps.Map(mapContainer, this.mapOptions)
    },
    sortTasksByPeriod () {
      let _self = this
      getTarefasByDate().then(
        async function (tarefas) {
          if (window.directionsDisplay) {
            window.directionsDisplay.setMap(null)
            window.directionsDisplay = null
          }

          if (tarefas) {
            // var tasks = tarefas.filter(task => {
            //   return task.status != 'concluida' && task.status != 'malsucedida'
            // })

            for (var j = 0; j < tarefas.length; j++) {
              let planedStartParsed = JSON.parse(tarefas[j].planedStart)
              let planedStartHour = planedStartParsed.hora
              if (planedStartHour >= 12) {
                tarefas[j].urgente = parseInt(tarefas[j].urgente) + 10000000
              }
            }

            var tasks = tarefas.filter(task => {
              return task.status != 'concluida' && task.status != 'malsucedida' && task.deletada != 1 && task.dataTarefa == _self.viewDate && task.deletada == '0'
            })

            tasks = tasks.sort(function (a, b) {
              var keyA = a.urgente
              var keyB = b.urgente
              if (keyA < keyB) return -1
              if (keyA > keyB) return 1
              return 0
            })
            var color = ''
            var i
            var rotas = []
            var cords

            for (i = 0; i < tasks.length; i++) {
              cords = [
                tasks[i].latitude,
                tasks[i].longitude
              ]

              rotas.push(cords)
            }
            color = '#d32f2f'
            _self.calculateAndDisplayRoute(rotas, color)
          }
        })
    },
    calculateAndDisplayRoute: function (cords, color) {
      var directionsService = new google.maps.DirectionsService()
      window.directionsDisplay = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: color
        },
        optimizeWaypoints: false
      })
      window.directionsDisplay.setMap(this.map)
      var waypts = []
      const _currentUserCoord = this.$store.getters['user/coords']
      if (_currentUserCoord) {
        for (var indexWithCoords = 0; indexWithCoords < cords.length - 1; indexWithCoords++) {
          waypts.push({
            location: new google.maps.LatLng(cords[indexWithCoords][0], cords[indexWithCoords][1]),
            stopover: true
          })
        }
        directionsService.route({
          origin: new google.maps.LatLng(_currentUserCoord.latitude, _currentUserCoord.longitude),
          destination: new google.maps.LatLng(cords[cords.length - 1][0], cords[cords.length - 1][1]),
          travelMode: 'DRIVING',
          waypoints: waypts,
          optimizeWaypoints: false,
          provideRouteAlternatives: true
        }, function (response, status) {
          if (status == 'OK') {
            window.directionsDisplay.setDirections(response)
          }
        })
      } else {
        for (var indexWithoutCoord = 1; indexWithoutCoord < cords.length - 1; indexWithoutCoord++) {
          waypts.push({
            location: new google.maps.LatLng(cords[indexWithoutCoord][0], cords[indexWithoutCoord][1]),
            stopover: true
          })
        }
        directionsService.route({
          origin: new google.maps.LatLng(cords[0][0], cords[0][1]),
          destination: new google.maps.LatLng(cords[cords.length - 1][0], cords[cords.length - 1][1]),
          travelMode: 'DRIVING',
          waypoints: waypts,
          optimizeWaypoints: false,
          provideRouteAlternatives: true
        }, function (response, status) {
          if (status == 'OK') {
            window.directionsDisplay.setDirections(response)
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .google-map {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: gray;
  }

  .content-page {
    position: absolute;
    top: 0;
    width: 100%;
    height: -webkit-fill-available;
  }
  .actions-bottom-left {
    bottom: 22px;
    left: 14px;
    position: fixed;
    z-index: 99999;
  }
</style>
