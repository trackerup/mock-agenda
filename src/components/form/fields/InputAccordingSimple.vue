<template>
  <div>
    <div v-if="!readOnly" class="section-conforme">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>

      <div class="mdl-tabs mdl-js-tabs ">
        <div class="mdl-tabs__tab-bar">
            <div v-show="tabs[0]" @click="setState('conforme')" href="//" class="mdl-tabs__tab check_circle_outline" :class="{'active': state == 'conforme'}"><i class="material-icons">check_circle_outline</i><span class="label" v-html="tabs[0]"></span></div>
            <div v-show="tabs[1]" @click="setState('naoConforme')" href="//" class="mdl-tabs__tab cancel" :class="{'active': state == 'naoConforme'}"><i class="material-icons">cancel</i><span class="label" v-html="tabs[1]"></span></div>
            <div v-show="tabs[2]" @click="setState('nAplica')" href="//" class="mdl-tabs__tab more_horiz" :class="{'active': state == 'nAplica'}"><i class="material-icons">more_horiz</i><span class="label" v-html="tabs[2]"></span></div>
        </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>

    <div v-else class="readOnly">
      <label><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="labelvalue">
          <i class="material-icons" :class="[classColor, md_icon]">{{ md_icon }}</i>
          <span v-html="tabs[0]" v-if="value == 'conforme'"></span>
          <span v-html="tabs[1]" v-if="value == 'naoConforme'"></span>
          <span v-html="tabs[2]" v-if="value == 'nAplica'"></span>
      </div>
    </div>

  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'

export default {
  name: 'InputAccordingSimple',
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
      this.$emit('input', this.state, this.id)
    }
  },
  computed: {
    tabs () {
      let labels = [
        this.$t('Conforme'),
        this.$t('Não Conforme'),
        this.$t('Não se Aplica')
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
    },
    verifyStates (value) {
      switch (value) {
        case 'conforme':
          this.state = 'conforme'
          this.classColor = 'green'
          this.md_icon = 'check_circle_outline'
          this.label = this.tabs[0]
          break
        case 'naoConforme':
          this.state = 'naoConforme'
          this.classColor = 'red'
          this.md_icon = 'cancel'
          this.label = this.tabs[2]
          break
        case 'nAplica':
          this.state = 'nAplica'
          this.classColor = 'orange'
          this.md_icon = 'more_horiz'
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
