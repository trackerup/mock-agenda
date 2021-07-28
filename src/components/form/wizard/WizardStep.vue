<template>
  <Form
    v-if="idForm"
    :idForm="idForm"
    :backDisabled="backDisabled"
    :title="title"
    :value="value"
    :readOnly="readOnly"
    :typeForm="typeForm"
    :readonlyState="readonlyState"
    ref="subForm"
    v-on:save="save"
    v-on:input="values => { $emit('input',values) }"
    v-on:cancel="cancel"
    v-on:updatePreResp="values => { $emit('updatePreResp', values) }"/>
</template>
<script>
import Form from '@/components/form/Form.vue'

export default {
  name: 'WizardStep',
  props: {
    idForm: {
      required: false
    },
    value: {
      required: false,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    typeForm: {
      type: String,
      required: false,
      default: 'simple'
    },
    backDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    readonlyState: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    values: {
      data: null,
      respostas: {}
    }
  }),
  beforeCreate () {
    this.$options.components.Form = require('@/components/form/Form.vue').default
  },
  methods: {
    save (values) {
      this.values = values
      this.$emit('save', this.values)
    },
    cancel (values) {
      this.values = values
      this.$emit('cancel', values)
    }
  },
  components: {
    Form
  },
  beforeDestroy: function () {
    if (this.$refs) {
      if (this.$refs.subForm) {
        this.$refs.subForm.$destroy()
        this.$refs.subForm = null
      }
    }
  }
}
</script>
