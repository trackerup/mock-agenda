<template>
  <div class="readOnly">
    <label v-html="texto"></label>
    <span class="value">
        {{ componentValue }}
      </span>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'Inicio',
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
    }
  },
  created () {
    this.componentValue = moment(new Date().toISOString()).format('YYYY-MM-DD HH:mm:ss')
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
      this.$emit('input', this.componentValue)
      return this.componentValue
    }
  }
}
</script>
