<template>
  <div>
    <div v-if="!readOnly" >
        <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
        <span class="mdl-chip" v-for="item in options" :key="item.id" @click="setInput(item)" :class="[{'orange mdl-chip--deletable mdl-chip--deletable-right': item.id == itemValue}]">
           <button type="button" class="mdl-chip__action" v-if="item.id == itemValue"><i class="material-icons">done</i></button>
           <span class="mdl-chip__text">{{item.titulo}} </span>
       </span>
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
import lists from '../../../plugins/persistence/entities/lists'

export default {
  name: 'InputChip',
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
    'itens': {
      required: false,
      default: false
    }
  },
  data () {
    return {
      itemValue: '',
      itemLabel: '',
      options: []
    }
  },
  async beforeMount () {
    if (this.lista) {
      const { itens } = await lists.getFormList(this.lista)
      this.options = itens
    }
    if (this.itens && !this.lista) {
      this.options = this.itens
    }
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
    setInput (item) {
      const itemSelected = item
      if (itemSelected) {
        this.itemLabel = itemSelected.titulo
        this.itemValue = itemSelected.id
        this.errors = []
        this.$emit('input', itemSelected, this.id)
        this.$emit('change', this.id)
        this.$forceUpdate()
      } else {
        this.itemLabel = null
        this.itemValue = null
        this.$emit('input', itemSelected, this.id)
        this.$emit('change', this.id)
      }
    }
  }
}
</script>
