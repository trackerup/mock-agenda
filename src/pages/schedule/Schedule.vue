<template>
<div>
  <div class="content-page planning">
    <vue-cal
      v-show="!searching && !appointmentDialog"
      ref="vuecal"
      :time="true"
      hide-weekends
      :locale="currentLang"
      :disable-views="['years','year']"
      :time-from="7 * 60"
      :time-to="19 * 60"
      :time-step="30"
      :special-hours="specialHours"
      xsmall
      today-button
      :active-view="activeView"
      :events="events"
      events-count-on-year-view
      events-on-month-view="short"
      :on-event-click="onEventClick"
      :clickToNavigate="true"
      @cell-click="openAppointmentDialog($event)"
    />
    <div class="botton-actions" :class="[false ? 'space-between' : '', '' == '' ? '' : 'hidden']">
      <div class="col-auto col-actions">
        <div class="actions" :class="[searching ? 'fab-open' : '']">
          <button class="mdl-button mdl-button--fab  mdl-button--fab--text button-actions orange" @click="doSearch" >
            <span id="nav-icon" v-if="!searching && !appointmentDialog">
              <i class="material-icons message">search</i>
            </span>
            <span id="nav-icon" v-else>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <EventListDialog v-if="searching" :searching="searching" :events="events" v-on:on-event-click="onEventClick" v-on:cancel="closeDialogs" />
  <AppointmentDialog v-if="appointmentDialog" :appointmentStartTime="appointmentStartTime" v-on:cancel="closeDialogs" v-on:saveAppointment="saveAppointment" />
  <EventDetailDialog
    v-if="eventDetailDialog"
    :event="selectedEvent"
    :events="events"
    v-on:saveEvent="saveEvent"
    v-on:cancel="closeDialogs"
    v-on:deleteSelectedEvent="deleteSelectedEvent"
    v-on:executeTask="executeTask"
  />
</div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/pt-br.js'
import 'vue-cal/dist/i18n/es.js'
import 'vue-cal/dist/vuecal.css'
import { mapGetters } from 'vuex'
import listEvents from './events'
import EventListDialog from './EventListDialog'
import AppointmentDialog from './AppointmentDialog'
import EventDetailDialog from './EventDetailDialog'

export default {
  name: 'Schedule',
  components: {VueCal, EventListDialog, AppointmentDialog, EventDetailDialog},
  data: () => ({
    task: {},
    selectedEvent: {},
    showDialog: false,
    searching: false,
    appointmentDialog: false,
    appointmentStartTime: null,
    eventDetailDialog: false,
    activeView: 'day',
    dailyHours: [
      { from: 12 * 60, to: 13 * 60, class: 'launch-hours' }
    ],
    specialHours: {},
    calendarData: [
      {
        id: 'test-user2e@test-email.ai',
        summary: 'description ....',
        color: '#cd74e6',
        dates: [
          {
            id: '7413lef3g1hip8hvk6tbipkqrq_20200917T140000Z',
            summary: 'event name',
            start: { dateTime: '2020-09-17T10:00:00-04:00' },
            end: { dateTime: '2020-09-17T11:00:00-04:00' }
          }
        ]
      }
    ],
    events: listEvents
  }),
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Agenda'),
      mapMenu: true,
      backMenu: true,
      routeMap: '/routeMapEvent'
    })
    this.specialHours = {
      1: this.dailyHours,
      2: this.dailyHours,
      3: this.dailyHours,
      4: this.dailyHours,
      5: this.dailyHours
    }
    this.searching = false
  },
  computed: {
    ...mapGetters({
      lang: 'lang/locale'
    }),
    currentLang () {
      switch (this.lang) {
        case 'pt':
          return 'pt-br'
        default:
          return this.lang
      }
    }
  },
  methods: {
    onEventClick (event, e) {
      this.selectedEvent = this.events.find(ele => { return ele.id == event.id })
      this.selectedEvent.class = this.selectedEvent.class + ' selectedEvent'
      this.eventDetailDialog = true
      this.$root.dialogOpen = true
      this.$root.cardContent = true

      // Prevent navigating to narrower view (default vue-cal behavior).
      if (e) e.stopPropagation()
    },
    openAppointmentDialog (event) {
      if (this.$refs.vuecal.view.id != 'month') {
        this.appointmentStartTime = event
        this.appointmentDialog = true
        this.$root.dialogOpen = true
        this.$root.cardContent = true
      }
    },
    closeDialogs () {
      this.appointmentStartTime = null
      this.appointmentDialog = false

      this.eventDetailDialog = false
      if (this.selectedEvent.class) {
        this.selectedEvent.class = this.selectedEvent.class.split(' ')[0]
      }

      this.searching = false

      this.$root.dialogOpen = false
      this.$root.cardContent = false
    },
    executeTask () {
      let start = new Date(this.selectedEvent.start)
      let end = new Date(this.selectedEvent.end)

      this.task = {
        agendada: null,
        automatica: '0',
        autor: 3609,
        coment: null,
        comentario: this.selectedEvent.title,
        created_at: null,
        criado: new Date().toJSON().slice(0, 19).replace('T', ' '),
        dataTarefa: start.toJSON().slice(0, 10),
        deletada: '0',
        deleted_at: null,
        destino: null,
        endereco: 'Endereço',
        estimado: null,
        forms: '[]',
        formsExtra: '{}',
        getPic: null,
        getSing: null,
        group: '0',
        historico: [],
        id: '79a869b9-fc5e-4930-a46a-b2d58e9c45a5',
        idApp: null,
        inicio: 1627387929634,
        latitude: this.selectedEvent.latitude,
        longitude: this.selectedEvent.longitude,
        livre: '0',
        log: '["form"=>""]',
        modificado: null,
        nome: this.selectedEvent.title,
        pic: null,
        planedEnd: `{"hora":"${start.toJSON().slice(10, 2)}","minuto":"${start.toJSON().slice(12, 2)}"}`,
        planedStart: `{"hora":"${end.toJSON().slice(10, 2)}","minuto":"${end.toJSON().slice(12, 2)}"}`,
        recorrente: null,
        responses: [],
        rota: 9034,
        sinc: 1,
        status: this.selectedEvent.tipo == 3 ? 'travelDone' : 'pendente',
        termino: null,
        travelEnd: null,
        travelLat: null,
        travelLng: null,
        travelStart: null,
        updated_at: null,
        urgente: '1',
        uuid: '79a869b9-fc5e-4930-a46a-b2d58e9c45a5',
        versao: 1,
        metaDados: [
          {meta_key: '__OS', meta_value: this.selectedEvent.title}
        ]
      }
      this.$store.dispatch('task/setCurrentTask', {task: this.task})
      this.closeDialogs()
      this.$router.push(`/task/${this.selectedEvent.id}`)
    },
    deleteSelectedEvent () {
      const _self = this
      this.events = this.events.filter(ele => {
        return ele.id != _self.selectedEvent.id
      })
      this.closeDialogs()
    },
    doSearch () {
      this.searching = !this.searching
      this.$root.dialogOpen = this.searching
      this.$root.cardContent = this.searching
    },
    saveAppointment (event) {
      this.events.push(event)
      this.closeDialogs()
    },
    saveEvent (event) {
      this.events.forEach(ele => {
        if (ele.id == event.id) {
          ele.start = event.start
          ele.end = event.end
          ele.class = event.class
        }
      })
      this.closeDialogs()
    }
  }
}
</script>

<style lang="scss">
.content-page {
  padding-top: 10px;
  width: 100%;
  height: 85vh;
}
.launch-hours {
  background-color: rgba(200, 200, 200, 0.4);
  border-width: 2px 0;
}
.vuecal--month-view .vuecal__cell {height: 80px;}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
  overflow: auto;
}

.vuecal--month-view .vuecal__cell-date {padding: 4px;}
.vuecal--month-view .vuecal__no-event {display: none;}

.mdl-card {
  width: auto;
}
</style>
