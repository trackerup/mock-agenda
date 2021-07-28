<template>
  <div class="d-flex">
    <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-dirty textfield-with-icon" :class="[{'is-dirty': value != ''}]">
      <input class="mdl-textfield__input"
            v-on:input="onInput"
            type="text"
            :id="id"
            :value="value">
      <label class="mdl-textfield__label" :for="id" v-if="texto"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <i class="material-icons mdl-textfield__label__icon reorder clearicon"  v-show="showClear && value != ''" @click="clear">close</i>
    </div>
    <div class="barcode-button" @click="getTextFromBarcode">
      <div class="button-area">
        <img src="@/assets/shared/barcode-scan.svg"/>
      </div>
    </div>
  </div>
</template>
<script>
import { mask } from 'vue-the-mask'

export default {
  name: 'InputBarcode',
  directives: {mask},
  props: {
    'id': {
      required: true
    },
    'texto': {
      type: String
    },
    'default': {
      type: String,
      required: false,
      default: ''
    },
    'obrigatorio': {
      type: String,
      required: false,
      default: ''
    },
    'destaque': {
      type: String,
      required: false,
      default: '0'
    },
    'value': {
      required: true
    },
    'readOnly': {
      required: false,
      default: false
    },
    'blocked': {
      type: Boolean,
      required: false,
      default: false
    },
    'messageError': {
      type: String,
      required: false,
      default: ''
    },
    'maxLength': {
      required: false,
      default: -1
    },
    'showClear': {
      required: false,
      default: false
    }
  },
  data () {
    return { }
  },
  methods: {
    async getTextFromBarcode () {
      const _self = this
      await this.$root.getTextFromBarcode().then((result) => {
        _self.$emit('input', { target: {value: result, origin: 'barcode', id: this.id} }, _self.id)
      }).catch((error) => {
        _self.$bus.$emit('showSnackBar', {
          message: _self.$t(error.msg),
          duration: 2000
        })
      })
    },
    onInput (e) {
      this.$emit('input', e)
      this.$forceUpdate()
    },
    clear () {
      this.$emit('input', { target: {value: '', origin: 'barcode', id: this.id} }, this.id)
    }
  }
}
</script>
<style lang="scss" scoped>
 .textfield-with-icon .material-icons {
    padding-bottom: 0;
    &.clearicon {
      right: 8px;
    }
  }
</style>
