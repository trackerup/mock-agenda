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
          <div class="page-content mdl-card">
            <div class="textfield-with-icon">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                    <input ref="input-pesquisa" class="mdl-textfield__input" type="datetime-local" id="startDateTime" v-model="startDateTime"/>
                    <label class="mdl-textfield__label" for="startDateTime">{{ $t('Data Inícial') }} </label>
                </div>
                <i class="material-icons">calendar</i>
            </div>
            <div class="textfield-with-icon">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                <input ref="input-pesquisa" class="mdl-textfield__input" type="datetime-local" id="endDateTime" v-model="endDateTime"/>
                <label class="mdl-textfield__label" for="endDateTime">{{ $t('Data Final') }} </label>
              </div>
              <i class="material-icons">calendar</i>
            </div>
            <div class="textfield">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                <input ref="input-pesquisa" class="mdl-textfield__input" type="text" id="comment" v-model="comment" />
                <label class="mdl-textfield__label" for="comment">{{ $t('Comentário') }} </label>
              </div>
            </div>
            <button class="mdl-button mdl-button orange" @click="selectGeo" v-if="!selectingGeo">
              {{ $t('Definir Local') }}
            </button>
            <div v-show="selectingGeo">
              <Map :search="true" ref="Map" v-on:confirmPos="confirmPosMap"/>
            </div>
            <div class="mdl-card__actions mdl-card--border">
              <button class="mdl-button mdl-button orange" @click="saveAppointment">
                {{ $t('Salvar') }}
              </button>
              <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" @click="$emit('cancel')">
                {{ $t('Cancelar') }}
              </a>
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
    startDateTime: null,
    endDateTime: null,
    comment: '',
    selectingGeo: false,
    location: false
  }),
  beforeMount () {
    const _date = this.roundTimeQuarterHour(this.appointmentStartTime)
    const _dateEnd = new Date(_date.getTime() + 30 * 60000)
    this.setDates(_date, _dateEnd)
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
      let _date = new Date(this.startDateTime)
      let _dateEnd = new Date(this.endDateTime)
      if (!_date || !_dateEnd || _date > _dateEnd) {
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Data e horário inválidos, data inicial deve ser menor que data final!'),
          duration: 4000
        })
      } else {
        this.$emit('saveAppointment', {
          id: null,
          idLocal: 'Apontamentos',
          start: this.startDateTime.replace('T', ' '),
          end: this.endDateTime.replace('T', ' '),
          title: this.comment ? this.comment : 'Apontamento',
          content: '<i class="material-icons">bookmark</i>',
          class: 'background-primary-color',
          latitude: this.location ? this.location.lat() : null,
          longitude: this.location ? this.location.lng() : null,
          tipo: 2
        }
        )
      }
    },
    setDates (dateStart, dateEnd) {
      this.startDateTime = `${dateStart.format()}T${dateStart.formatTime()}`
      this.endDateTime = `${dateEnd.format()}T${dateEnd.formatTime()}`
    },
    changeDateStartTime () {
      let _date = new Date(this.startDateTime)
      let _dateEnd = new Date(this.endDateTime)
      if (_date >= _dateEnd) {
        _dateEnd = new Date(_date.getTime() + 30 * 60000)
      }
      this.setDates(_date, _dateEnd)
    },
    changeDateEndTime () {
      let _date = new Date(this.startDateTime)
      let _dateEnd = new Date(this.endDateTime)
      if (_date >= _dateEnd) {
        _date = new Date(_dateEnd.getTime() - 30 * 60000)
      }
      this.setDates(_date, _dateEnd)
    },
    selectGeo () {
      this.selectingGeo = true
    },
    confirmPosMap (location) {
      this.location = location.result.geometry.location
    }
  }
}
</script>

<style lang="scss">
</style>
