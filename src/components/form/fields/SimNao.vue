<template>
  <div>
    <div v-if="!readOnly" class="section-simnao">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>

      <div v-mdl class="mdl-tabs mdl-js-tabs ">
        <div class="mdl-tabs__tab-bar">
          <span v-show="tabs[0]" @click="setState('sim')" href="//" class="mdl-tabs__tab check_circle_outline" :class="{'active': state == 'sim'}"><i class="material-icons" v-html="icones[0]"></i><span class="label" v-html="tabs[0]"></span></span>
          <span v-show="tabs[1]" @click="setState('nao')" href="//" class="mdl-tabs__tab cancel" :class="{'active': state == 'nao'}"><i class="material-icons" v-html="icones[1]"></i><span class="label" v-html="tabs[1]"></span></span>
        </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else-if="value" class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="labelvalue">
        <template v-if="value == 'sim'">
          <i class="material-icons check_circle_outline">check_circle_outline</i>
          {{ $t('Sim') }}
        </template>
        <template v-if="value == 'nao'">
          <i class="material-icons cancel">cancel</i>
          {{ $t('Não') }}
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'

export default {
  name: 'SimNao',
  extends: TRInputBase,
  data () {
    return {
      state: '',
      classColor: '',
      md_icon: '',
      label: ''
    }
  },
  mounted () {
    if (this.value) {
      this.verifyStates(this.value)
    } else {
      this.verifyStates(this.padrao)
    }
  },
  computed: {
    tabs () {
      let labels = [
        this.$t('Sim'),
        this.$t('Não')
      ]
      try {
        let mascara = JSON.parse(this.mascara)
        if (typeof mascara.labels != 'undefined') {
          labels = mascara.labels
        }
      } catch (e) {
        return labels
      }
      return labels
    },
    icones () {
      let icones = [
        'check_circle_outline',
        'cancel'
      ]
      try {
        let mascara = JSON.parse(this.mascara)
        if (typeof mascara.icones != 'undefined') {
          icones = mascara.icones
        }
      } catch (e) {
        return icones
      }
      return icones
    },
    padrao () {
      let padrao = ''
      try {
        let mascara = JSON.parse(this.mascara)
        padrao = mascara.padrao
      } catch (e) {
        padrao = ''
      }
      return padrao
    }
  },
  methods: {
    setState (state) {
      this.state = state
      this.$emit('input', state, this.id)
      this.$emit('change', this.id)
    },
    verifyStates (value) {
      switch (value) {
        case 'sim':
          this.setState('sim')
          this.classColor = 'green'
          this.md_icon = this.icones[0]
          this.label = this.tabs[0]
          break
        case 'nao':
          this.setState('nao')
          this.classColor = 'red'
          this.md_icon = this.icones[0]
          this.label = this.tabs[1]
          break
        default:
          this.classColor = 'grey'
          this.md_icon = ''
          break
      }
    }
  }
}
</script>
