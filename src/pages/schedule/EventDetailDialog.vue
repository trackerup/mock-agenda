<template>
  <div>
    <div class="mdl-dialog full full-fixed dialogPartSelection" id="partsSelectionDialog">
      <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
          <div class="mdl-layout__header-row">
            <div class="flex-start">
              <button @click="$emit('cancel')" class="mdl-button mld-button-icon-text button-back">
                <i class="material-icons">keyboard_arrow_left</i>
                {{ $t('Voltar') }}
              </button>
            </div>
            <h5 class="pageTitle">{{ $t('Evento') }}</h5>
            <div class="flex-end" @click="reSchedule" v-if="event.status != 1">
              {{ $t('Reagendar') }}
              <i class="material-icons">event</i>
            </div>
            <div class="flex-end" v-else></div>
          </div>
        </header>
        <main class="mdl-layout__content">
          <div class="mdl-card mdl-card-no-padding">
            <div class="mdl-card__title background-primary-color">
              <h2 class="mdl-card__title-text">
                <span v-html="event.content"></span>
                {{ event.title }}:
              </h2>
              <span @click="toogleMap" v-if="showMap">
                <i class="material-icons">event</i>
              </span>
              <span @click="toogleMap" v-if="!showMap && event.latitude && event.longitude">
                <i class="material-icons">map</i>
              </span>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
              <div class="mdl-card__actions card-content" v-if="!editing">
                <div class="flex-start">
                  <h4>
                    {{ event.start | formatDate }}<br />
                    {{ event.start | formatTime }} - {{ event.end | formatTime }}
                  </h4>
                </div>
                <div class="flex-end eventType" v-if="event.tipo != 2">
                  <button class="mdl-button" @click="setTipo(1)" :class="{ orange: event.tipo == 1 }">
                    {{ $t('Física') }}
                    <i class="material-icons">home</i>
                  </button>
                  <button class="mdl-button" @click="setTipo(3)" :class="{ orange: event.tipo == 3 }">
                    {{ $t('Virtual') }}
                    <i class="material-icons">wifi</i>
                  </button>
                </div>
              </div>
              <div v-else>
                <span class="orange">{{ $t('Nova data') }}</span>
                <div class="textfield" @click="$refs.date.focus()">
                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                    <input class="mdl-textfield__input" type="date" ref="date" v-model="date" />
                    <label class="mdl-textfield__label">{{ $t('Dia') }} </label>
                  </div>
                </div>
                <div class="container-period">
                  <div class="textfield" @click="$refs.start.focus()">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                      <input class="mdl-textfield__input" type="time" ref="start" v-model="start" />
                      <label class="mdl-textfield__label">{{ $t('Início') }} </label>
                    </div>
                  </div>
                  <div class="textfield" @click="$refs.end.focus()">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                      <input class="mdl-textfield__input" type="time" ref="end" v-model="end" />
                      <label class="mdl-textfield__label">{{ $t('Fim') }} </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mdl-grid center">
                <template v-for="tag in event.tags">
                  <span :key="tag.id" class="mdl-chip" :class="{'mdl-chip-selected': tag.selected}">
                      <a v-if="tag.icon" class="mdl-chip__action"><i class="material-icons">{{tag.icon}}</i></a>
                      <span class="mdl-chip__text" >{{tag.title}}</span>
                  </span>
                </template>
              </div>
              <vue-cal ref="vuecal" :time="true" hide-weekends hide-view-selector hide-title-bar :locale="currentLang" :disable-views="['years', 'year', 'month', 'week']" :time-from="timeFrom" :time-to="timeTo" :time-step="30" :events="events" xsmall active-view="day" :selected-date="eventDate" v-if="!editing && !showMap" />
              <div v-show="showMap && !execute && !editing" class="google-map" :ref="mapName"></div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
              <div class="flex-start" v-if="!execute && !editing && event.tipo != 2 && event.status != 1">
                <button type="button" class="mdl-button orange" @click="$emit('executeTask')">{{ $t('Executar') }}</button>
              </div>
              <div class="flex-start" v-if="event.status == 1">
                <i class="material-icons">check</i>
              </div>
              <div class="flex-start" v-if="editing">
                <button type="button" class="mdl-button orange" @click="saveEvent">{{ $t('Salvar') }}</button>
                <div class="mdl-layout-spacer"></div>
                <button type="button" class="mdl-button red" @click="editing = false">{{ $t('Cancelar') }}</button>
              </div>
              <div class="flex-end" v-if="!editing">
                <button v-if="event.tipo == 2" type="button" class="mdl-button grey" @click="$emit('deleteSelectedEvent')">{{ $t('Excluir') }}</button>
                <button type="button" class="mdl-button red" @click="$emit('cancel')">{{ $t('Cancelar') }}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/pt-br.js'
import 'vue-cal/dist/i18n/es.js'
import 'vue-cal/dist/vuecal.css'
import { mapGetters } from 'vuex'
const google = window.google

export default {
  name: 'EventDetailDialog',
  components: { VueCal },
  props: {
    event: {
      required: true
    },
    events: {
      required: true
    }
  },
  data: () => ({
    mapName: 'task-map',
    map: null,
    mapOptions: null,
    startDateTime: null,
    endDateTime: null,
    comment: '',
    editing: false,
    showMap: false,
    date: null,
    start: null,
    end: null,
    execute: false
  }),
  beforeMount () {
    this.date = new Date(this.event.start.replace(' ', 'T')).format()
    this.start = new Date(this.event.start.replace(' ', 'T')).formatTime()
    this.end = new Date(this.event.end.replace(' ', 'T')).formatTime()
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      coords: 'user/coords'
    }),
    currentLang () {
      switch (this.lang) {
        case 'pt':
          return 'pt-br'
        default:
          return this.lang
      }
    },
    eventDate () {
      return new Date(this.event.start.replace(' ', 'T'))
    },
    timeFrom () {
      return (new Date(this.event.start.replace(' ', 'T')).getHours() - 1) * 60
    },
    timeTo () {
      return (new Date(this.event.end.replace(' ', 'T')).getHours() + 1) * 60
    }
  },
  methods: {
    reSchedule () {
      this.editing = true
      this.execute = false
    },
    saveEvent () {
      let editedEvent = Object.assign({}, this.event)
      this.$emit(
        'saveEvent',
        Object.assign(editedEvent, {
          start: this.date + ' ' + this.start,
          end: this.date + ' ' + this.end,
          class: 'background-primary-color'
        })
      )
    },
    setTipo (tipo) {
      let editedEvent = Object.assign({}, this.event)
      this.$emit(
        'updateEvent',
        Object.assign(editedEvent, {
          tipo: tipo
        })
      )
    },
    toogleMap () {
      this.showMap = !this.showMap
      if (this.showMap) {
        this.map = null
        this.initializeMap()
        this.calculateAndDisplayRouteTask()
      }
    },
    initializeMap: function () {
      this.mapOptions = {
        zoom: 14,
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
      this.mapOptions.center = new google.maps.LatLng(this.event.latitude, this.event.longitude)

      var mapContainer = this.$refs[this.mapName]
      this.map = new google.maps.Map(mapContainer, this.mapOptions)
    },
    calculateAndDisplayRouteTask: function () {
      let _self = this
      if (_self.coords) {
        var directionsService = new google.maps.DirectionsService()
        window.directionsDisplay = new google.maps.DirectionsRenderer()
        window.directionsDisplay.setMap(_self.map)
        directionsService.route(
          {
            origin: new google.maps.LatLng(_self.coords.latitude, _self.coords.longitude),
            destination: new google.maps.LatLng(_self.event.latitude, _self.event.longitude),
            travelMode: 'DRIVING',
            provideRouteAlternatives: true
          },
          function (response, status) {
            if (status == 'OK') {
              window.directionsDisplay.setDirections(response)
            }
          }
        )
      } else {
        this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.event.latitude, this.event.longitude),
          map: this.map,
          title: this.event.title
        })
      }
    },
    prepareToExecute: function () {
      this.execute = true
    }
  }
}
</script>

<style lang="scss">
.mdl-card__actions {
  display: flex;
}
.mdl-card__actions .flex-start h4 {
  margin: 0;
}
.mdl-card__title {
  display: flex;
  justify-content: space-between;
}
.eventType {
  flex-direction: column;
  justify-content: flex-start;
}
.app-content .mdl-card.mdl-card-no-padding {
  padding: 0;
  border: solid 0px rgba(0, 0, 0, 0.12);
}
.vuecal__event.selectedEvent {
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
}
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: gray;
}
</style>
