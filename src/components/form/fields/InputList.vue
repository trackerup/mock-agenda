<template>
  <div>
    <div v-if="!readOnly" >
      <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label mdl-select"
           :class="{'is-dirty': itemValue != ''}">
        <select class="mdl-textfield__input" name="inputlist" v-model="itemValue" @change="setInput()">
          <option :value="null" ></option>
          <option v-for="item in options" :key="item.id" :data-val="item.id" :value="item.id">{{item.titulo}}</option>
        </select>
        <label for="sample5" class="mdl-textfield__label"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else-if="itemLabel" class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
      {{ itemLabel }}
    </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase'
import lists from '../../../plugins/persistence/entities/lists'

export default {
  name: 'InputList',
  extends: TRInputBase,
  data () {
    return {
      itemValue: '',
      itemLabel: '',
      options: []
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
    const { itens } = await lists.getFormList(this.lista)
    this.options = itens
    this.getSelected()
  },
  methods: {
    getSelected () {
      if (this.value) {
        const itemSelected = this.options.find(item => { return item.id == this.value })
        this.itemLabel = itemSelected.titulo
        this.itemValue = itemSelected.id
        this.$emit('change', this.id)
      } else {
        this.itemLabel = null
        this.itemValue = null
      }
    },
    setInput () {
      const itemSelected = this.options.find(item => { return item.id == this.itemValue })
      if (itemSelected) {
        this.itemLabel = itemSelected.titulo
        this.errors = []
        this.$emit('input', this.itemValue, this.id)
        this.$emit('change', this.id)
        this.$forceUpdate()
      } else {
        this.itemLabel = null
        this.itemValue = null
        this.$emit('input', this.itemValue, this.id)
        this.$emit('change', this.id)
      }
    }
  }
}
</script>
