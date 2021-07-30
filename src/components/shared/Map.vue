<template>
  <div class="map-component">
    <div v-if="search" class="map-search">
      <div class="textfield-with-icon">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
          <input ref="input-pesquisa" class="mdl-textfield__input" type="text" id="endereco" v-on:keyup.enter="findLocal" v-model="endereco">
          <label class="mdl-textfield__label" for="endereco">{{ $t('Endereço') }} </label>
        </div>
        <i class="material-icons" @click="findLocal">search</i>
      </div>
      <div class="autocomplete-menu mdl-shadow--2dp" v-show="isOpen">
        <ul class="mdl-list">
          <li class="mdl-list__item" v-if="isLoading">
            <span class="mdl-list__item-primary-content">
              {{ $t('Carregando') }}
            </span>
          </li>
          <li class="mdl-list__item" v-else v-for="(result, i) in results" :key="i" @click="setMiniMarker(result)">
            <span class="mdl-list__item-primary-content">
              {{ result.formatted_address }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="map" ref="googleMap"></div>
    <div class="infoContentHolder">
      <div ref="infoContent">
        <a href="javascript://" @click="confirmPos">Confirmar posição</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Map',
  props: {
    miniMap: false,
    search: {
      type: Boolean,
      required: false,
      default: false
    },
    textSearch: {
      type: String
    },
    pointToShowinMap: {
      required: false
    },
    draggablePointToShowInMap: {
      required: false
    }
  },
  data () {
    return {
      map: null,
      marker: null,
      miniMarker: false,
      endereco: '',
      isOpen: false,
      menu: null,
      results: [],
      isLoading: false,
      currentPos: null,
      delayUpdate: null
    }
  },
  mounted () {
    this.upgradeDOM()
    this.initializeMap()
    this.upgradeDOM()
    if (this.pointToShowinMap) {
      this.markNewPoint(this.pointToShowinMap)
    } else if (this.draggablePointToShowInMap && this.draggablePointToShowInMap.lat && this.draggablePointToShowInMap.lng) {
      this.setMiniMarker(false, this.draggablePointToShowInMap)
    } else if (this.textSearch) {
      this.endereco = this.textSearch
      this.findLocal()
    }
  },
  watch: {
    'draggablePointToShowInMap.lat': {
      handler: 'refreshMiniMarkerPoint'
    },
    'draggablePointToShowInMap.lng': {
      handler: 'refreshMiniMarkerPoint'
    }
  },
  methods: {
    upgradeDOM: function () {
      this.$forceUpdate()
      setTimeout(() => {
        window.componentHandler.upgradeDom()
      }, 100)
    },
    initializeMap: function () {
      var element = {
        latitude: -23.5422851,
        longitude: -46.6402859
      }

      if (isNaN(element.latitude) || isNaN(element.longitude)) {
        element.latitude = -23.5422851
        element.longitude = -46.6402859
      }

      var mapOptions = {
        center: new window.google.maps.LatLng(element.latitude, element.longitude),
        zoom: 18,
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

      var mapContainer = this.$refs.googleMap
      this.map = new window.google.maps.Map(mapContainer, mapOptions)
    },
    markNewPoint: function (point) {
      let _self = this
      var position = new window.google.maps.LatLng(point.lat, point.lng)
      var bounds = new window.google.maps.LatLngBounds()
      bounds.extend(position)

      _self.marker = new window.google.maps.Marker({
        position: position,
        map: _self.map
      })
      _self.map.fitBounds(bounds)
      _self.setZoom(18)
    },
    setZoom: function (zoom) {
      let _self = this
      setTimeout(() => {
        _self.map.setZoom(zoom)
      }, 200)
    },
    findLocal: function () {
      let _self = this
      let geocoder = new window.google.maps.Geocoder()
      _self.isLoading = true
      geocoder.geocode({ 'address': _self.endereco }, function (results, status) {
        _self.results = []
        _self.isOpen = true

        if (results.length > 0) {
          _self.results = results
        } else {
          _self.results = [{
            isNotValid: true,
            formatted_address: 'Endereço não Encontrado'
          }]
        }
        _self.$forceUpdate()
        setTimeout(() => {
          _self.isOpen = true
          _self.isLoading = false
        }, 200)
      })
    },
    setMiniMarker: function (result, latLng = false) {
      const _self = this
      let geo
      if (result) {
        geo = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng()
        }
        _self.$emit('confirmPos', { result: result })
      } else {
        geo = latLng
      }
      if (geo.lat == 0 && geo.lng == 0) {
        return
      }
      const pos = _self.currentPos = geo
      if (_self.miniMarker) {
        if (_self.miniMarker.infoWindow) {
          _self.miniMarker.infoWindow.close(_self.map, _self.miniMarker)
          _self.miniMarker.infoWindow.setMap(null)
          _self.miniMarker.infoWindow = null
        }
        _self.miniMarker.setMap(null)
        _self.miniMarker = null
      }
      _self.miniMarker = new window.google.maps.Marker({
        position: pos,
        map: _self.map,
        draggable: true
      })

      _self.miniMarker.addListener('dragend', function () {
        if (!_self.miniMarker.infoWindow) {
          _self.miniMarker.infoWindow = new window.google.maps.InfoWindow({
            content: _self.$refs.infoContent
          })
          this.infoWindow.open(_self.map, _self.miniMarker)
        }
        _self.currentPos = {
          lat: this.position.lat(),
          lng: this.position.lng()
        }
      })

      _self.miniMarker.infoWindow = new window.google.maps.InfoWindow({
        content: _self.$refs.infoContent
      })

      _self.miniMarker.addListener('click', function () {
        this.miniMarker.infoWindow.open(_self.map, _self.miniMarker)
      })

      let point = new window.google.maps.LatLng(pos.lat, pos.lng)
      _self.map.setCenter(point)
      _self.miniMarker.infoWindow.open(_self.map, _self.miniMarker)
      _self.setZoom(17)
      this.isOpen = false
    },
    confirmPos: function () {
      const _self = this
      let geocoder = new window.google.maps.Geocoder()
      _self.isLoading = true
      let value
      if (_self.draggablePointToShowInMap) {
        value = {
          geocode: false,
          result: {
            address_components: [],
            formatted_address: _self.endereco,
            geometry: {
              location: _self.currentPos
            }
          }
        }
        if (typeof (_self.draggablePointToShowInMap.index) != 'undefined') value.index = _self.draggablePointToShowInMap.index
        _self.$emit('confirmPos', value)
        if (_self.miniMarker.infoWindow) {
          _self.miniMarker.infoWindow.close(_self.map, _self.miniMarker)
          _self.miniMarker.infoWindow.setMap(null)
          _self.miniMarker.infoWindow = null
        }
        return
      }
      geocoder.geocode({ 'location': _self.currentPos }, function (results, status) {
        if (results.length) {
          _self.endereco = results[0].formatted_address
          value = {
            geocode: true,
            result: results[0]
          }
        } else {
          value = {
            geocode: false,
            result: {
              address_components: [],
              formatted_address: _self.endereco,
              geometry: {
                location: _self.currentPos
              }
            }
          }
        }

        if (_self.draggablePointToShowInMap && typeof (_self.draggablePointToShowInMap.index) != 'undefined') value.index = _self.draggablePointToShowInMap.index
        _self.$emit('confirmPos', value)

        if (_self.miniMarker.infoWindow) {
          _self.miniMarker.infoWindow.close(_self.map, _self.miniMarker)
          _self.miniMarker.infoWindow.setMap(null)
          _self.miniMarker.infoWindow = null
        }
        // _self.miniMarker.setMap(null)
        // _self.miniMarker = null
      })
    },
    refreshMiniMarkerPoint (value) {
      this.currentPos = {
        lat: this.$props.draggablePointToShowInMap.lat,
        lng: this.$props.draggablePointToShowInMap.lng
      }
      if (this.delayUpdate) clearTimeout(this.delayUpdate)
      this.delayUpdate = setTimeout(() => {
        if (!this.miniMarker) {
          return this.setMiniMarker(false, this.draggablePointToShowInMap)
        }
        this.delayUpdate = null
        let points = new window.google.maps.LatLng(this.draggablePointToShowInMap.lat, this.draggablePointToShowInMap.lng)
        this.miniMarker.setPosition(points)
        this.map.panTo(points)
      }, 1000)
    }
  },
  onDestroy () {
    let _self = this

    if (_self._marker.infoWindow) {
      _self._marker.infoWindow.close(_self.map, _self._marker)
      _self._marker.infoWindow.setMap(null)
      _self._marker.infoWindow = null
    }
    _self._marker.setMap(null)
    _self._marker = null

    if (_self.miniMarker.infoWindow) {
      _self.miniMarker.infoWindow.close(_self.map, _self.miniMarker)
      _self.miniMarker.infoWindow.setMap(null)
      _self.miniMarker.infoWindow = null
    }
    _self.miniMarker.setMap(null)
    _self.miniMarker = null
  }
}
</script>
<style lang="scss">
.map {
  min-height: 200px;
}
.autocomplete-menu {
    position: absolute;
    background: white;
    z-index: 1;
    border: 1px solid #ccc;
    margin-top: -15px;
    width: 85vw;
}
</style>
