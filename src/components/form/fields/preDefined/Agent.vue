<template>
  <div class="readOnly">
    <label v-html="texto"></label>
    <span class="value">
        {{ value }}
      </span>
  </div>
</template>
<script>

export default {
  name: 'Agent',
  props: {
    texto: {
      type: String,
      required: true
    }
  },
  data: () => ({}),
  computed: {
    value () {
      return this.$store.getters['user/user'].nome
    }
  },
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
