<template>
  <div v-if="readOnly" class="readOnly">
    <label v-html="texto"></label>
    <span class="value">
        {{ value }}
      </span>
  </div>
</template>
<script>

export default {
  name: 'InicioTarefa',
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
  data: () => ({}),
  mounted () {
    this.$emit('input', this.value)
  },
  methods: {
    getValue () {
      this.$emit('input', this.value)
      return this.value
    }
  }
}
</script>
