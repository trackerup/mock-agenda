<template>
<div>
  <div class="content-page planning">
    <vue-cal
      v-if="!pesquisando"
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
      active-view="day"
      :events="events"
      events-count-on-year-view
      events-on-month-view="short"
      :on-event-click="onEventClick"
      :clickToNavigate="true"
    />
    <div class="botton-actions" :class="[false ? 'space-between' : '', '' == '' ? '' : 'hidden']">
      <div class="col-auto col-actions">
        <div class="actions" :class="[pesquisando ? 'fab-open' : '']">
          <button class="mdl-button mdl-button--fab  mdl-button--fab--text button-actions orange" @click="pesquisar" >
            <span id="nav-icon" v-if="!pesquisando">
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
  <EventListDialog v-if="pesquisando" :pesquisando="pesquisando" :events="events" v-on:on-event-click="onEventClick" v-on:cancel="pesquisar" />
  <dialog class="mdl-dialog full full-fixed" id="dialogEventSelect">
    <div class="mdl-dialog__content">
      <h5>
        <span>{{ selectedEvent.title }}</span>
        <strong>{{ selectedEvent.start | formatDateTime }}</strong>
      </h5>
      <p v-html="selectedEvent.contentFull"/>
      <strong>Event details:</strong>
      <ul>
        <li>Event starts at: {{ selectedEvent.start | formatDateTime }}</li>
        <li>Event ends at: {{ selectedEvent.end | formatDateTime }}</li>
      </ul>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button orange" @click="executeTask()">{{ $t('Executar') }}</button>
        <button type="button" class="mdl-button red" @click="deleteSelectedEvent()">{{ $t('Exluir') }}</button>
        <button type="button" class="mdl-button close grey" @click="closeDialogEventSelect()">{{ $t('Cancelar') }}</button>
      </div>
    </div>
  </dialog>
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

export default {
  name: 'Schedule',
  components: {VueCal, EventListDialog},
  data: () => ({
    task: {},
    selectedEvent: {},
    showDialog: false,
    pesquisando: false,
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
    this.$dialogPolyfill.doDialog('dialogEventSelect')
    this.pesquisando = false
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
      this.selectedEvent = event
      this.$el.querySelector('#dialogEventSelect').showModal()

      // Prevent navigating to narrower view (default vue-cal behavior).
      if (e) e.stopPropagation()
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
      this.$router.push(`/task/${this.selectedEvent.id}`)
    },
    deleteSelectedEvent () {
      const _self = this
      this.events = this.events.filter(ele => {
        return ele.id != _self.selectedEvent.id
      })
      this.$el.querySelector('#dialogEventSelect').close()
    },
    closeDialogEventSelect () {
      this.$el.querySelector('#dialogEventSelect').close()
    },
    pesquisar () {
      this.pesquisando = !this.pesquisando
      this.$root.dialogOpen = this.pesquisando
      this.$root.cardContent = this.pesquisando
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
