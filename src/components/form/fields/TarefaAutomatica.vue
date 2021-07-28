<template>
  <div v-if="agentes.length > 0">
    <div v-if="!readOnly" >
      <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label mdl-select"
           :class="{'is-dirty': itemValue != ''}">
        <select class="mdl-textfield__input" name="inputlist" v-model="itemValue" @change="setInput()">
          <option v-if="!obrigatorio"></option>
          <option v-for="item in agentes" :key="item.id" :data-val="item.id" :value="item.id">{{item.nome}}</option>
        </select>
        <label for="sample5" class="mdl-textfield__label"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
      {{ itemLabel }}
    </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase'

export default {
  name: 'TarefaAutomatica',
  extends: TRInputBase,
  data () {
    return {
      itemValue: '',
      itemLabel: '',
      metaValue: '',
      agentes: []
    }
  },
  directives: {
    clickOutside: {
      bind: function (el, binding, vnode) {
        el.eventSetDrag = function () {
          el.setAttribute('data-dragging', 'yes')
        }
        el.eventClearDrag = function () {
          el.removeAttribute('data-dragging')
        }
        el.eventOnClick = function (event) {
          var dragging = el.getAttribute('data-dragging')
          // Check that the click was outside the el and its children, and wasn't a drag
          if (!(el == event.target || el.contains(event.target)) && !dragging) {
            // call method provided in attribute value
            vnode.context[binding.expression](event)
          }
        }
        document.addEventListener('touchstart', el.eventClearDrag)
        document.addEventListener('touchmove', el.eventSetDrag)
        document.addEventListener('click', el.eventOnClick)
        document.addEventListener('touchend', el.eventOnClick)
      },
      unbind: function (el) {
        document.removeEventListener('touchstart', el.eventClearDrag)
        document.removeEventListener('touchmove', el.eventSetDrag)
        document.removeEventListener('click', el.eventOnClick)
        document.removeEventListener('touchend', el.eventOnClick)
        el.removeAttribute('data-dragging')
      }
    }
  },
  async beforeMount () {
    this.metaValue = Object.values(this.$attrs.metaDados).find(metaDado => metaDado.meta_key == 'listaAgentes').meta_value
    this.agentes = this.metaValue != 'off' ? JSON.parse(this.metaValue) : []
    this.getSelected()
  },
  methods: {
    getSelected () {
      if (this.value) {
        const itemSelected = this.agentes.find(item => { return item.id == this.value })
        this.itemLabel = itemSelected.nome
        this.itemValue = itemSelected.id
      }
    },
    setInput () {
      const itemSelected = this.agentes.find(item => { return item.id == this.itemValue })
      this.itemLabel = itemSelected.nome
      this.errors = []
      this.$emit('input', this.itemValue, this.id)
      this.$emit('change', this.id)
    },
    isValid: function () {
      this.errors = []
      this.hasErrors = false
      if (this.metaValue == 'off') {
        return true
      }
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
