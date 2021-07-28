<template>
  <div>
    <div class="content-page">
      <div class="google-map" :ref="mapName"></div>
    </div>
    <div class="footer-page">
      <div class="mdl-toolbar-section-end">
        <button class="mdl-button orange  mdl-button--raised  mdl-button--accent" @click="linkWaze">
          <img id="waze-logo" class="svg_map_button" src="../../assets/shared/waze.svg"/>
              Waze
        </button>
        <button class="mdl-button orange  mdl-button--raised  mdl-button--accent" @click="linkMaps">
         <img id="maps-logo" class="svg_map_button" src="../../assets/shared/maps.svg"/>
          G. Maps
        </button>
      </div>
    </div>
  <div class="actions-bottom-left">
    <button @click="$router.push('/messages')" class="mdl-button  mdl-button--fab  orange">
        <i class="material-icons message">message</i>
    </button>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { logTask } from '@/plugins/persistence/entities/tarefaLog'

/* global google */
export default {
  name: 'Taskmap',
  data () {
    return {
      mapName: 'task-map',
      map: null,
      mapOptions: null
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      coords: 'user/coords'
    })
  },
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Tarefa no mapa'),
      mapMenu: false,
      backMenu: true
    })
    this.$geolocation.getLocation(this)
    this.map = null
    this.initializeMapTarefa()
    this.calculateAndDisplayRouteTask()
    logTask(this.currentTask.id, 'Abriu o mapa', 'seeMap')
  },
  methods: {
    linkWaze: function () {
      if (window.jscd.os == 'ANDROID' || window.jscd.os == 'Android' || window.jscd.os == 'android') {
        window.open(`https://www.waze.com/ul?ll=${this.currentTask.latitude}%2C${this.currentTask.longitude}&navigate=yes`, '_system')
      } else if (window.jscd.os == 'iOS') {
        window.open(`https://www.waze.com/ul?ll=${this.currentTask.latitude}%2C${this.currentTask.longitude}&navigate=yes`, '_system')
      } else {
        this.$router.push('comgooglemaps://?saddr=&daddr=' + this.currentTask.latitude + ',' + this.currentTask.longitude + '&directionsmode=driving')
      }
    },
    linkMaps: function () {
      if (window.jscd.os == 'ANDROID' || window.jscd.os == 'Android' || window.jscd.os == 'android') {
        window.open('https://www.google.com/maps/dir/?api=1&destination=' + this.currentTask.latitude + '%2C' + this.currentTask.longitude + '&travelmode=driving', '_system')
      } else if (window.jscd.os == 'iOS') {
        window.open('https://www.google.com/maps/dir/?api=1&destination=' + this.currentTask.latitude + '%2C' + this.currentTask.longitude + '&travelmode=driving', '_system')
      } else {
        this.$router.push('comgooglemaps://?saddr=&daddr=' + this.currentTask.latitude + ',' + this.currentTask.longitude + '&directionsmode=driving')
      }
    },
    initializeMapTarefa: function () {
      var element = this.$store.getters['user/coords']

      this.mapOptions = {
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
      if (this.coords) {
        this.mapOptions.center = new google.maps.LatLng(element.latitude, element.longitude)
      } else if (this.currentTask) {
        this.mapOptions.center = new google.maps.LatLng(this.currentTask.latitude, this.currentTask.longitude)
      }

      var mapContainer = this.$refs[this.mapName]
      this.map = new google.maps.Map(mapContainer, this.mapOptions)
    },
    calculateAndDisplayRouteTask: function () {
      let _self = this
      if (_self.coords) {
        var directionsService = new google.maps.DirectionsService()
        window.directionsDisplay = new google.maps.DirectionsRenderer()
        window.directionsDisplay.setMap(_self.map)
        directionsService.route({
          origin: new google.maps.LatLng(_self.coords.latitude, _self.coords.longitude),
          destination: new google.maps.LatLng(_self.currentTask.latitude, _self.currentTask.longitude),
          travelMode: 'DRIVING',
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
<style lang="scss" scoped>

.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: gray;
}

.content-page{
  position: absolute;
  top: 0;
  padding-bottom: 52px;
  width: 100%;
  height:-webkit-fill-available;
}
.actions-bottom-left {
  bottom: 70px;
  left: 14px;
  position: fixed;
  z-index: 99999;
}
  .footer-page{
    background: #939598;
    height: 52px;
    width: 100%;
    bottom: 0;
    position: absolute;
    overflow: hidden;
    .mdl-toolbar-section-end {
      height: 52px;
    }
    .mdl-button {
        border-radius: 4px;
        margin-right: 16px;
        margin-top: 10px;
        margin-bottom: 6px;
        text-transform: none;
        width: 94px;
        padding: 0;
        text-align: center;
        img {
          margin-right: 4px;
        }
    }
    .mdl-button + .mdl-button {
      margin-right: 11px;
    }
  }
</style>
