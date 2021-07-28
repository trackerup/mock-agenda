<template>
  <div>
    <div class="mdl-textfield readOnly inputSum">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value" v-if="valueSum">
        {{valueSum | formatMoney}}
      </span>
      <span class="value" v-else>
        R$ 0,00
      </span>
    </div>
    <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
  </div>
</template>
<script>
import { mask } from 'vue-the-mask'
import TRInputBase from './InputBase.vue'
import {Money} from 'v-money'

export default {
  name: 'InputSum',
  components: {Money},
  directives: {mask},
  extends: TRInputBase,
  props: {
    responses: {
      type: Object,
      required: true
    },
    questions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      type: 'text',
      moneyConf: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2
      },
      valueSum: 0
    }
  },
  beforeMount () {
    this.valueSum = this.value
    this.mask = JSON.parse(this.mascara)
  },
  mounted () {
    setTimeout(() => {
      this.updateSum(null)
    }, 100)
  },
  methods: {
    isValid: function () {
      this.errors = []
      this.hasErrors = false
      if (this.obrigatorio == '1' && (this.value == '' || this.value == null || this.value == 0)) {
        this.errors.push(this.$t('Este field é obrigatório'))
        this.hasErrors = true
        return false
      }
      return true
    },
    updateSum: function (origin) {
      if (origin == null || origin.id != this.id) {
        let _self = this
        _self.valueSum = 0
        if (typeof _self.questions == 'object' && _self.questions != null) {
          let fields = _self.questions.filter(function (element, index, self) {
            let meta = element.metaDados.find(metaDado => metaDado.meta_key == 'ancora')
            if (meta) {
              return _self.mask.indexOf(meta.meta_value) >= 0
            }
            return false
          })
          fields.forEach(field => {
            _self.valueSum += _self.responses[field.id].valor
          })
          _self.$emit('input', this.valueSum, this.id)
        }
        return true
      }
    }
  }
}
</script>
<style scoped>
.mdl-textfield .orange {
  padding-left: 16px;
}
</style>
