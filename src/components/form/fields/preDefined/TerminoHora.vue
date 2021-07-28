<template>
  <div v-if="readOnly" class="readOnly">
    <label v-html="texto"></label>
    <span class="value">
        {{ componentValue }}
      </span>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'TerminoHora',
  props: {
    texto: {
      type: String,
      required: false
    },
    value: {
      type: String,
      required: false,
      default: () => {
        return ''
      }
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: () => {
        return true
      }
    }
  },
  created () {
    this.componentValue = moment(new Date().toISOString()).format('HH:mm')
  },
  data () {
    return {
      componentValue: this.value
    }
  },
  mounted () {
    this.$emit('input', this.componentValue)
  },
  methods: {
    getValue () {
      this.componentValue = moment(new Date().toISOString()).format('YYYY-MM-DD HH:mm')
      this.$emit('input', this.componentValue)
      return this.componentValue
    }
  }
}
</script>
