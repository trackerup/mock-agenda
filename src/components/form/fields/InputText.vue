<template>
  <div>
    <div v-if="!readOnly">
      <div v-mdl v-if="showMasks" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
           :class="[{'is-dirty': value != ''}]">
        <input class="mdl-textfield__input"
               v-bind:inputmode="inputmode"
               v-on:input="onInput"
               v-on:change="onChange"
               v-mask="mask.vmask"
               :type="type"
               :id="id"
               :value="value">
        <label class="mdl-textfield__label" :for="id" ><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>

      <div v-mdl v-else-if="mascara == 'money'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
           :class="[{'is-dirty': value != ''}]">
        <money class="mdl-textfield__input"
               v-bind:inputmode="inputmode"
               v-on:input="value => {$emit('input', value, id)}"
               v-on:change="onChange"
               v-bind="moneyConf"
               :type="type"
               :id="id"
               :value="value ? value : 0"></money>
        <label class="mdl-textfield__label" :for="id" ><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>

      <InputBarcode v-else-if="mascara == 'barcode'"
              v-on:input="onInput"
              v-on:change="onChange"
              :texto="texto"
              :id="id"
              @click="getTextFromBarcode"
              :value="value" />

      <div v-else class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="[{'is-dirty': value != ''},{'textfield-with-icon' : mascara == 'barcode'}]">
        <input class="mdl-textfield__input"
               v-on:input="onInput"
               v-on:change="onChange"
               :type="type"
               :id="id"
               :value="value">
        <label class="mdl-textfield__label" :for="id" ><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

    </div>
    <div v-else class="readOnly">
      <label class="orange" v-html="texto"> <span v-show="obrigatorio">*</span></label>
      <span class="value" v-if="mascara == 'money'" >
        {{ value ? value : 0 | formatMoney }}
      </span>
      <span class="value" v-else-if="mascara == 'date'" >
        {{ value ? value : 0 | formatDate }}
      </span>
      <span class="value" v-else >
        {{ value ? value : ' - ' }}
      </span>
    </div>
  </div>
</template>
<script>
import { mask } from 'vue-the-mask'
import TRInputBase from './InputBase.vue'
import {Money} from 'v-money'
import InputBarcode from './barcode/InputBarcode'

export default {
  name: 'InputText',
  components: {Money, InputBarcode},
  directives: {mask},
  extends: TRInputBase,
  data () {
    return {
      mask: '',
      showMasks: false,
      type: 'text',
      focus: false,
      moneyConf: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 2
      },
      inputmode: 'text'
    }
  },
  beforeMount () {
    if (this.type != 'text') {
      this.mask = JSON.parse(this.mascara)
    } else {
      this.mask = {campo: this.mascara}
    }
    this.setMask(this).then((type) => {
      if (this.type == 'text') {
        this.getTextMask(this, this.mask).then(res => {
        })
      }
    })
  },
  methods: {
    setMask: (self) => {
      return new Promise((resolve) => {
        if (!self.mask) {
          resolve(false)
        }
        self.mask.vmask = null
        if (!self.mask.campo) {
          self.mask = {
            matriz: self.mask.lista,
            campo: self.mask.mascara,
            tipo: 'texto',
            grupo: '1',
            mascara: 'texto'
          }
        }
        resolve('text')
      })
    },
    getTextMask: (that, mask) => {
      let self = that
      return new Promise((resolve, reject) => {
        self.mask.vmask = ''
        switch (mask.campo) {
          case 'date':
            // self.mask.vmask = '##/##/####'
            self.type = 'date'
            break
          case 'datetime':
            // self.mask.vmask = '##/##/#### ##:##'
            self.type = 'datetime-local'
            break
          case 'time':
            // self.mask.vmask = '##:##:##'
            self.type = 'time'
            break
          case 'number':
            self.type = 'number'
            break
          case 'money':
            self.type = 'money'
            self.inputmode = 'numeric'
            break
          case 'phone':
          case 'celphone':
            self.mask.vmask = ['(##) ####-####', '(##) #####-####']
            self.inputmode = 'numeric'
            break
          case 'barcode':
            break
          case 'text':
            break

          default:
            return ''
        }
        if (self.mask.vmask != '') {
          self.showMasks = true
        }
        resolve(true)
      })
    },
    getTextFromBarcode () {
      this.$root.getTextFromBarcode().then((result) => {
        this.$emit('input', result, this.id)
      }).catch((error) => {
        this.$bus.$emit('showSnackBar', {
          message: this.$t(error.msg),
          duration: 2000
        })
      })
    },
    onInput (e) {
      this.$emit('input', e.target.value, this.id)
    },
    onChange () {
      this.$emit('change', this.id)
    },
    isValid: function () {
      this.errors = []
      this.hasErrors = false
      if (this.obrigatorio == '1' && (this.value == '' || this.value == null)) {
        this.errors.push(this.$t('Este field é obrigatório'))
        this.hasErrors = true
        return false
      }
      return true
    }
  }
}
</script>
