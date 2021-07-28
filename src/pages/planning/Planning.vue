<template>
<div>
  <div class="content-page planning">
    <div class="textfield-with-icon" v-if="pesquisando">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
        <input ref="input-pesquisa" class="mdl-textfield__input" type="text" id="passwordInput" v-model="searchTerm">
        <label class="mdl-textfield__label" for="passwordInput">{{ $t('Pesquisa') }} </label>
      </div>
      <i class="material-icons">search</i>
    </div>
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
    <div class="mdl-list" v-else>
      <template v-for="(locais, index) in groupByLocalEvents" >
        <div class="mdl-card expand" :key="index"  v-if="isVisible(index)">
          <div class="mdl-card__title">
            <i class="material-icons">person</i>
            <h5 class="mdl-card__title-text">{{ index }}</h5>
          </div>
          <div class="mdl-card__supporting-text">
            <ul class="mdl-list">
              <template  v-for="event in locais" >
                <li class="mdl-list__item" :key="event.id">
                  <span class="mdl-list__item-primary-content">
                    <strong>{{ event.start | formatDateTime }}</strong>
                  </span>
                </li>
              </template>
            </ul>
          </div>
          <div class="mdl-card__actions mdl-card--border">
            <button type="button" class="mdl-button close grey" @click="closeDialogEventSelect()">
              {{ $t('Editar') }}
              <i class="material-icons">edit</i>
            </button>
          </div>
        </div>
      </template>
    </div>
    <div class="botton-actions" :class="[false ? 'space-between' : '', '' == '' ? '' : 'hidden']">
      <div class="col-auto col-actions">
        <div class="actions" :class="[pesquisando ? 'fab-open' : '']">
          <button class="mdl-button mdl-button--fab  mdl-button--fab--text button-actions orange" @click="pesquisar()" >
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
  <dialog class="mdl-dialog full full-fixed" id="dialogEventSelect">
    <div class="mdl-dialog__content">
      <h5>
        <span>{{ selectedEvent.title }}</span>
        <strong>{{ selectedEvent.start && selectedEvent.start.format('DD/MM/YYYY') }}</strong>
      </h5>
      <p v-html="selectedEvent.contentFull"/>
      <strong>Event details:</strong>
      <ul>
        <li>Event starts at: {{ selectedEvent.start && selectedEvent.start.formatTime() }}</li>
        <li>Event ends at: {{ selectedEvent.end && selectedEvent.end.formatTime() }}</li>
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
import { like } from '@/utils/'
import listEvents from './events'

export default {
  name: 'Planning',
  components: {VueCal},
  data: () => ({
    task: {},
    selectedEvent: {},
    showDialog: false,
    pesquisando: false,
    searchTerm: '',
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
    this.$store.dispatch('locals/getLocals', {})
    this.$emit('changeParams', {
      pageTitle: this.$t('Planejamento'),
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
    },
    groupByLocalEvents () {
      return this.groupBy(this.events, event => event.idLocal)
    }
  },
  methods: {
    onEventClick (event, e) {
      this.selectedEvent = event
      this.$el.querySelector('#dialogEventSelect').showModal()

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    },
    executeTask () {
      this.task = {
        agendada: null,
        automatica: '0',
        autor: 3609,
        coment: null,
        comentario: this.selectedEvent.title,
        created_at: null,
        criado: new Date().toJSON().slice(0, 19).replace('T', ' '),
        dataTarefa: this.selectedEvent.start.toJSON().slice(0, 10),
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
        planedEnd: `{"hora":"${this.selectedEvent.start.toJSON().slice(10, 2)}","minuto":"${this.selectedEvent.start.toJSON().slice(12, 2)}"}`,
        planedStart: `{"hora":"${this.selectedEvent.end.toJSON().slice(10, 2)}","minuto":"${this.selectedEvent.end.toJSON().slice(12, 2)}"}`,
        recorrente: null,
        responses: [],
        rota: 9034,
        sinc: 1,
        status: 'pendente',
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
      const _self = this
      this.pesquisando = !this.pesquisando
      setTimeout(() => {
        _self.$refs['input-pesquisa'].focus()
        _self.$refs['input-pesquisa'].parentNode.classList.add('is-dirty')
      }, 100)
    },
    isVisible (index) {
      return (this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', index.toUpperCase()))
    },
    groupBy (list, keyGetter) {
      const map = {}
      list.forEach((item) => {
        const key = keyGetter(item)
        const collection = map[key]
        if (!collection) {
          map[key] = [item]
        } else {
          collection.push(item)
        }
      })
      return map
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
