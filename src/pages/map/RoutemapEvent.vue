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
import { mapGetters } from 'vuex'
import listEvents from '../schedule/events'

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
    mapOptions: null,
    tasks: listEvents,
    today: new Date().toJSON().slice(0, 10)
  }),
  computed: {
    ...mapGetters({
      user: 'user/user',
      coords: 'user/coords',
      viewDate: 'task/viewDate'
    })
  },
  async created () {
  },
  beforeMount () {
  },
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Rota no mapa'),
      mapMenu: false,
      backMenu: true
    })
    if (this.map == null) {
      this.initializeMapRota()
    }
  },
  methods: {
    initializeMapRota: function () {
      let _self = this

      var element = this.tasks && this.tasks.length ? this.tasks[0] : {
        latitude: -23.5422851,
        longitude: -46.6402859
      }

      this.mapOptions = {
        center: new window.google.maps.LatLng(element.latitude, element.longitude),
        zoom: 17,
        mapTypeControl: false,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_LEFT
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        },
        fullscreenControl: false,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      }

      var mapContainer = this.$refs[this.mapName]
      this.map = new window.google.maps.Map(mapContainer, this.mapOptions)

      if (window.directionsDisplay) {
        window.directionsDisplay.setMap(null)
        window.directionsDisplay = null
      }

      var tasks = this.tasks.filter(ele => {
        return (ele.start.slice(0, 10) == _self.today) && ele.tipo == 1
      })

      tasks = tasks.sort(function (a, b) {
        return new Date(b.start) - new Date(a.start)
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
    },
    calculateAndDisplayRoute: function (cords, color) {
      var directionsService = new window.google.maps.DirectionsService()
      window.directionsDisplay = new window.google.maps.DirectionsRenderer({
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
            location: new window.google.maps.LatLng(cords[indexWithCoords][0], cords[indexWithCoords][1]),
            stopover: true
          })
        }
        directionsService.route({
          origin: new window.google.maps.LatLng(_currentUserCoord.latitude, _currentUserCoord.longitude),
          destination: new window.google.maps.LatLng(cords[cords.length - 1][0], cords[cords.length - 1][1]),
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
            location: new window.google.maps.LatLng(cords[indexWithoutCoord][0], cords[indexWithoutCoord][1]),
            stopover: true
          })
        }
        directionsService.route({
          origin: new window.google.maps.LatLng(cords[0][0], cords[0][1]),
          destination: new window.google.maps.LatLng(cords[cords.length - 1][0], cords[cords.length - 1][1]),
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
