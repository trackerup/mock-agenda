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
            <h5 class="pageTitle">{{ $t('Apontamento') }}</h5>
            <div class="flex-end"></div>
          </div>
        </header>
        <main class="mdl-layout__content">
          <div class="mdl-card mdl-card-no-padding">
            <div class="mdl-card__title background-primary-color">
              <h2 class="mdl-card__title-text">
                {{ $t('Novo apontamento') }}
                <i class="material-icons">bookmark</i>
              </h2>
            </div>
            <div class="mdl-card__supporting-text mdl-card--expand">
              <div class="textfield">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                  <input class="mdl-textfield__input" type="text" id="comment" v-model="comment" />
                  <label class="mdl-textfield__label" for="comment">{{ $t('Comentário') }} </label>
                </div>
              </div>
              <div class="mdl-grid container-between">
                <div class="textfield-with-icon" @click="$refs.startDate.focus()" >
                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                    <input class="mdl-textfield__input" type="date" ref="startDate" id="startDate" v-model="startDate" />
                    <label class="mdl-textfield__label" for="startDate">{{ $t('Data') }} </label>
                  </div>
                </div>
                <div class="flex-end" v-if="!repeat">
                  <button class="mdl-button mdl-button orange"  @click="prepareRepeat" >
                    {{ $t('Repetir') }}
                    <i class="material-icons">repeat</i>
                  </button>
                </div>
                <div class="textfield-with-icon" v-else  @click="$refs.endDate.focus()" >
                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                    <input  class="mdl-textfield__input" type="date" ref="endDate" id="endDate" v-model="endDate" @change="changeEndDateTime" />
                    <label class="mdl-textfield__label" for="endDate">{{ $t('Data Fim') }} </label>
                  </div>
                </div>
              </div>
              <div class="mdl-grid center" v-if="repeat">
                <template v-for="(tag, index) in ['S','T','Q','Q','S']">
                  <span :key="index" class="mdl-chip" :class="{'mdl-chip-selected': recurring[index]}" @click="setRecurring(index)">
                      <span class="mdl-chip__text" >{{tag}}</span>
                  </span>
                </template>
              </div>
              <div class="mdl-grid container-between">
                <div class="textfield-with-icon" @click="$refs.startDateTime.focus()">
                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                    <input  class="mdl-textfield__input" type="time" name="startDateTime" ref="startDateTime" id="startDateTime" v-model="startTime" />
                    <label class="mdl-textfield__label" for="startDateTime">{{ $t('Início') }} </label>
                  </div>
                </div>
                <div class="textfield-with-icon" @click="$refs.endDateTime.focus()">
                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                    <input  class="mdl-textfield__input" type="time" name="endDateTime" ref="endDateTime" id="endDateTime" v-model="endTime" />
                    <label class="mdl-textfield__label" for="endDateTime">{{ $t('Fim') }} </label>
                  </div>
                </div>
              </div>
              <div class="mdl-grid center">
                <template v-for="tag in tags">
                  <span :key="tag.id" class="mdl-chip" :class="{'mdl-chip-selected': tag.selected}" @click="tag.selected = !tag.selected">
                      <a v-if="tag.icon" class="mdl-chip__action"><i class="material-icons">{{tag.icon}}</i></a>
                      <span class="mdl-chip__text" >{{tag.title}}</span>
                  </span>
                </template>
              </div>
              <div class="mdl-grid container-between" v-if="!selectingGeo">
                <span></span>
                <button class="mdl-button mdl-button orange" @click="selectGeo" >
                  {{ $t('Definir Local') }}
                  <i class="material-icons">map</i>
                </button>
              </div>
              <div v-show="selectingGeo">
                <Map :search="true" ref="Map" v-on:confirmPos="confirmPosMap" />
              </div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
              <div class="flex-start" >
                <button type="button" class="mdl-button orange" @click="saveAppointment">{{ $t('Salvar') }}</button>
                <div class="mdl-layout-spacer"></div>
              </div>
              <div class="flex-end">
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
import Map from '@/components/shared/Map'
export default {
  name: 'AppointmentDialog',
  components: { Map },
  props: {
    appointmentStartTime: {
      required: true
    }
  },
  data: () => ({
    mapName: 'task-map',
    map: null,
    mapOptions: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    repeat: false,
    recurring: [false, false, false, false, false],
    comment: '',
    selectingGeo: false,
    location: false,
    tags: [
      { title: 'Reunião Gerencia', selected: false, id: 'Reunião' },
      { title: 'Médico', selected: false, id: 'Médico' },
      { title: 'Pessoal', selected: false, id: 'Pessoal' },
      { title: 'Viagem', selected: false, id: 'Viagem' },
      { title: 'Hotel', selected: false, id: 'Hotel' },
      { title: 'Outros', selected: false, id: 'Outros' }
    ]
  }),
  beforeMount () {
    const _date = this.roundTimeQuarterHour(this.appointmentStartTime)
    const _endDate = new Date(_date.getTime() + 30 * 60000)
    this.setDates(_date, _endDate)
    this.comment = ''
    this.selectingGeo = false
  },
  computed: {},
  methods: {
    roundTimeQuarterHour (time) {
      var timeToReturn = new Date(time)
      timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000)
      timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60)
      timeToReturn.setMinutes(Math.abs(Math.round(timeToReturn.getMinutes() / 15) - 1) * 15)
      return timeToReturn
    },
    saveAppointment () {
      let _date = new Date(this.startDate)
      let _endDate = new Date(this.endDate)
      if (!_date || !_endDate || _date > _endDate) {
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Data e horário inválidos, data inicial deve ser menor que data final!'),
          duration: 4000
        })
      } else {
        if (this.repeat) {
          let _date = new Date(this.startDate + 'T00:00:00')
          let _endDate = new Date(this.endDate + 'T00:00:00')
          while (_date.getTime() <= _endDate.getTime()) {
            const _day = _date.getDay()
            if (this.recurring[_day - 1]) {
              this.emitSaveAppointment(_date.format())
            }
            _date.setDate(_date.getDate() + 1)
          }
        } else {
          this.emitSaveAppointment(this.startDate)
        }
      }
    },
    emitSaveAppointment (date) {
      this.$emit('saveAppointment', {
        id: null,
        idLocal: 'Apontamentos',
        start: `${date} ${this.startTime}`,
        end: `${date} ${this.endTime}`,
        title: this.comment ? this.comment : 'Apontamento',
        content: '<i class="material-icons">bookmark</i>',
        class: 'background-primary-color',
        latitude: this.location ? this.location.lat() : null,
        longitude: this.location ? this.location.lng() : null,
        tipo: 2,
        tags: this.tags.filter(ele => ele.selected)
      })
    },
    setDates (startDate, endDate) {
      this.startDate = `${startDate.format()}`
      this.startTime = `${startDate.formatTime()}`
      this.endDate = `${endDate.format()}`
      this.endTime = `${endDate.formatTime()}`
    },
    changeEndDateTime () {
      let _date = new Date(this.startDate + 'T00:00:00')
      let _endDate = new Date(this.endDate + 'T00:00:00')
      this.recurring = [false, false, false, false, false, false, false]
      while (_date.getTime() <= _endDate.getTime()) {
        const _day = _date.getDay()
        if (_day != 0 && _day != 6) {
          this.recurring[_date.getDay() - 1] = true
        }
        _date.setDate(_date.getDate() + 1)
      }
      this.$forceUpdate()
    },
    selectGeo () {
      this.selectingGeo = true
    },
    confirmPosMap (location) {
      this.location = location.result.geometry.location
    },
    setRecurring (index) {
      this.recurring[index] = !this.recurring[index]
      let _date = new Date(this.startDate + 'T00:00:00')
      let _endDate = new Date(this.endDate + 'T00:00:00')
      while (_date.getDay() < index + 1) {
        const _day = _date.getDay()
        if (_day != 0 && _day != 6) {
          _endDate = _endDate.getTime() < _date.getTime() ? _date : _endDate
        }
        _date.setDate(_date.getDate() + 1)
      }
      this.endDate = _endDate.format()
      this.$forceUpdate()
    },
    prepareRepeat () {
      const _startDate = new Date(this.startDate)
      this.repeat = true
      this.setRecurring(_startDate.getDay())
    }
  }
}
</script>

<style lang="scss">
.mdl-card__actions {
  display: flex;
}
.app-content .mdl-card.mdl-card-no-padding {
  padding: 0;
  border: solid 0px rgba(0, 0, 0, 0.12);
}
.app-content .mdl-chip.mdl-chip-selected {
  background: var(--primaryColor);
  color: #fff
}
.center {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.container-between {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.container-between .textfield-with-icon {
  width: 49%;
}
</style>
