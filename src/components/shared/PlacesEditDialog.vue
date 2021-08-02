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
            <h5 class="pageTitle">{{ $t('Editar Local') }}</h5>
            <div class="flex-end"></div>
          </div>
        </header>
        <main class="mdl-layout__content">
          <div class="page-content mdl-card">
            <template v-for="(item, index) in formData">
              <div :key="index" v-if="item.type == 'period'">
                <span class="orange">{{ item.title }}</span>
                <div class="container-period">
                  <div class="textfield" >
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                      <input ref="input-pesquisa" class="mdl-textfield__input" type="time" v-model="item.value.start" />
                      <label class="mdl-textfield__label">{{ $t('Início') }} </label>
                    </div>
                  </div>
                  <div class="textfield" >
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                      <input ref="input-pesquisa" class="mdl-textfield__input" type="time" v-model="item.value.end" />
                      <label class="mdl-textfield__label">{{ $t('Fim') }} </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="textfield" :key="index" v-else>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                  <input ref="input-pesquisa" class="mdl-textfield__input" type="item.type" v-model="item.value" />
                  <label class="mdl-textfield__label">{{ item.title }} </label>
                </div>
              </div>
            </template>
            <div class="mdl-card__actions mdl-card--border">
              <button class="mdl-button mdl-button orange" @click="savePlace">
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
export default {
  name: 'PlacesEditDialog',
  components: {},
  props: {
    local: {
      required: true
    }
  },
  data: () => ({
    titulo: '',
    formData: [
      {
        title: 'SETOR',
        type: 'text',
        value: 'VF1C25'
      },
      {
        title: 'ID Cliente',
        type: 'text',
        value: '000012112'
      },
      {
        title: 'Nome cliente',
        type: 'text',
        value: 'DROGAFUJI'
      },
      {
        title: 'CRM ou CNPJ',
        type: 'text',
        value: '00061325000184'
      },
      {
        title: 'Endereço',
        type: 'text',
        value: 'QUADRA EQNO 11/13 BLOCO F,S/N'
      },
      {
        title: 'Bairro',
        type: 'text',
        value: 'CEILANDIA NORTE (CEILANDIA)'
      },
      {
        title: 'Cidade',
        type: 'text',
        value: 'BRASILIA'
      },
      {
        title: 'UF',
        type: 'text',
        value: 'DISTRITO FEDERAL'
      },
      {
        title: 'CEP',
        type: 'text',
        value: '72255516'
      },
      {
        title: 'País',
        type: 'text',
        value: 'BR'
      },
      {
        title: 'Categoria',
        type: 'text',
        value: 'Farmácia'
      },
      {
        title: 'Frequência visita (dias)',
        type: 'numeric',
        value: '1'
      },
      {
        title: 'Duração estimada',
        type: 'numeric',
        value: '15'
      },
      {
        title: 'Domingo',
        type: 'period',
        value: { start: '', end: '' }
      },
      {
        title: 'Segunda',
        type: 'period',
        value: { start: '08:00', end: '18:00' }
      },
      {
        title: 'Terça',
        type: 'period',
        value: { start: '08:00', end: '18:00' }
      },
      {
        title: 'Quarta',
        type: 'period',
        value: { start: '08:00', end: '18:00' }
      },
      {
        title: 'Quinta',
        type: 'period',
        value: { start: '08:00', end: '18:00' }
      },
      {
        title: 'Sexta',
        type: 'period',
        value: { start: '08:00', end: '18:00' }
      },
      {
        title: 'Sábado',
        type: 'period',
        value: { start: '', end: '' }
      }
    ]
  }),
  beforeMount () {
    const _date = this.roundTimeQuarterHour(this.appointmentStartTime)
    const _dateEnd = new Date(_date.getTime() + 30 * 60000)
    this.setDates(_date, _dateEnd)
    this.comment = ''
  },
  computed: {},
  methods: {
    roundTimeQuarterHour (time) {
      var timeToReturn = new Date(time)
      timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000)
      timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60)
      timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15)
      return timeToReturn
    },
    savePlace () {
      let _date = new Date(this.startDateTime)
      let _dateEnd = new Date(this.endDateTime)
      if (!_date || !_dateEnd || _date > _dateEnd) {
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Data e horário inválidos, data inicial deve ser menor que data final!'),
          duration: 4000
        })
      } else {
        this.$emit('savePlace', this.formData)
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
    }
  }
}
</script>

<style lang="scss">
.container-period {
  display: flex;
  justify-content: space-between;
}
.container-period .textfield {
  width: 45%;
}

</style>
