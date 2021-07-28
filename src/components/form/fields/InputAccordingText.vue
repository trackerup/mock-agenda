<template>
<div>
    <div v-if="!readOnly" class="section-conforme">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>

      <div class="mdl-tabs mdl-js-tabs ">
        <div class="mdl-tabs__tab-bar">
            <span @click="setState('conforme')" href="//" class="mdl-tabs__tab check_circle_outline" :class="{'active': state == 'conforme'}"><i class="material-icons">check_circle_outline</i><span class="label" v-html="tabs[0]"></span></span>
            <span @click="setState('naoConforme')" href="//" class="mdl-tabs__tab cancel" :class="{'active': state == 'naoConforme'}"><i class="material-icons">cancel</i><span class="label" v-html="tabs[1]"></span></span>
            <span @click="setState('nAplica')" href="//" class="mdl-tabs__tab more_horiz" :class="{'active': state == 'nAplica'}"><i class="material-icons">more_horiz</i><span class="label" v-html="tabs[2]"></span></span>
        </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

      <div v-mdl v-show="state == 'naoConforme'" class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <textarea v-model="textAreaValue" class="mdl-textfield__input mdl-textfield" rows= "3" title="" @keyup="onKeyUpInput"></textarea>
        <label class="mdl-textfield__label" :for="id" v-html="$t('Justificar') + ' ' + tabs[1]"></label>
      </div>
    </div>

    <div v-else class="readOnly">
      <label><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="labelvalue">
          <i class="material-icons" :class="md_icon">{{md_icon}}</i>{{label}}
      </div>
      <span class="value" v-if="state !='conforme' && state != 'nAplica' ">
        {{ value }}
      </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'

export default {
  name: 'InputAccordingText',
  extends: TRInputBase,
  data: () => ({
    textAreaValue: '',
    state: '',
    classColor: '',
    md_icon: '',
    label: ''
  }),
  mounted () {
    if (this.value) {
      this.verifyStates(this.value)
    } else {
      this.verifyStates(this.padrao)
    }
  },
  watch: {
    value (value) {
      this.textAreaValue = value
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
      if (state != 'naoConforme') {
        this.$emit('input', state, this.id)
      } else {
        // clear value when change tabs
        this.$emit('input', '', this.id)
      }
    },
    onKeyUpInput () {
      this.$emit('input', this.textAreaValue, this.id)
    },
    verifyStates (value) {
      switch (value) {
        case 'conforme':
          this.state = 'conforme'
          this.classColor = 'green'
          this.md_icon = 'check_circle_outline'
          this.label = this.tabs[0]
          break
        case 'nAplica':
          this.state = 'nAplica'
          this.classColor = 'orange'
          this.md_icon = 'more_horiz'
          this.label = this.tabs[2]
          break
        case 'naoConforme':
          this.state = 'naoConforme'
          this.classColor = 'red'
          this.md_icon = 'cancel'
          this.label = this.tabs[1]
          break
      }
    }
  }
}
</script>
<style>
</style>
