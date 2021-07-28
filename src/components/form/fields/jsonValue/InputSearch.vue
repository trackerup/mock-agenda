<template>
  <div class="textfield-with-icon">
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
      <input
        class="mdl-textfield__input searchTerm" ref="search" type="text"
        v-model="searchTerm"
        v-on:input="emitValue"
        :readonly="readonly"
        @click="inputfocus">
      <label class="mdl-textfield__label">{{ $t(searchLabel) }}</label>
    </div>
    <i v-if="!readonly" class="material-icons" @click="inputfocus">search</i>
  </div>
</template>
<script>
export default {
  name: 'InputSearch',
  data: () => ({
    searchTerm: ' '
  }),
  mounted () {
    window.checkDirty()
    this.searchTerm = this.value
  },
  props: {
    'name': {
      type: String,
      required: false
    },
    'value': {
      type: String,
      required: false
    },
    'readonly': {
      type: Boolean
    }
  },
  computed: {
    searchLabel () {
      return this.name || this.$t('Buscar')
    }
  },
  methods: {
    inputfocus () {
      if (this.searchTerm == '') {
        this.searchTerm = ' '
      }
      this.emitValue()
      if (this.searchTerm == ' ') {
        this.searchTerm = ''
      }
      this.$refs.search.focus()
    },
    emitValue () {
      this.$emit('input', this.searchTerm)
    }

  }
}
</script>
