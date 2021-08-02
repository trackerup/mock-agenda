<template>
  <div>
    <div class="textfield-with-icon" v-if="!advanced">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
        <input ref="input-pesquisa" class="mdl-textfield__input" type="text" id="passwordInput"
               v-on:input="onInput" v-model="searchTerm">
        <label class="mdl-textfield__label" for="passwordInput">{{ $t('Pesquisa') }} </label>
      </div>
      <i class="material-icons">search</i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventListSearch',
  components: { },
  props: {
    advanced: {
      default: false
    }
  },
  data: () => ({
    searchTerm: ''
  }),
  mounted () {
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="scss">
</style>
