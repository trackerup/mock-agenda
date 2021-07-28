<template>
  <div>
    <div v-if="!readOnly" class="section-conforme" :class="{'is-invalid': obrigatorio}">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>

      <div class="mdl-tabs mdl-js-tabs ">
        <div class="mdl-tabs__tab-bar">
          <span @click="setState('conforme')" href="//" class="mdl-tabs__tab check_circle_outline"
             :class="{'active': state == 'conforme'}"><i
            class="material-icons">check_circle_outline</i><span class="label" v-html="tabs[0]"></span></span>
          <span @click="setState('naoConforme')" href="//" class="mdl-tabs__tab cancel"
             :class="{'active': state == 'naoConforme'}"><i class="material-icons">cancel</i><span
            class="label" v-html="tabs[1]"></span></span>
          <span @click="setState('nAplica')" href="//" class="mdl-tabs__tab more_horiz"
             :class="{'active': state == 'nAplica'}"><i class="material-icons">more_horiz</i><span
            class="label" v-html="tabs[2]"></span></span>
        </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

      <div v-if="state == 'naoConforme'">
        <input-image
          ref="input"
          :id="id"
          :embebed="true"
          :ordem="ordem"
          :texto="texto"
          :tipo="tipo"
          :formulario="formulario"
          :messageError="$t('Este field é obrigatório')"
          :value="value"
          v-on:input="onInputImage"
          :readOnly="readOnly"
          v-on:change="onChangeImage"
          class="section-foto"
        />
      </div>

    </div>

    <div v-else class="readOnly">
      <label><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="labelvalue">
        <i class="material-icons conforme" :class="classColor" v-if="state == 'conforme'">check_circle_outline</i>
        <i class="material-icons naoConforme" :class="classColor" v-if="state == 'naoConforme'">cancel</i>
        <i class="material-icons nAplica" :class="classColor" v-if="state == 'nAplica'">more_horiz</i>
        {{ label }}
      </div>
      <span class="value" v-if="state !='conforme' && state != 'nAplica' ">
        <div class="imageThumb mdl-layout-item mdl-size-33 imgThumb" v-if="value && value.startsWith('data:image')">
          <div class="image">
            <img :src="value" />
          </div>
        </div>
      </span>
    </div>

  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import InputImage from './InputImage'

export default {
  name: 'InputAccordingPhoto',
  components: {InputImage},
  extends: TRInputBase,
  data () {
    return {
      state: '',
      classColor: '',
      md_icon: '',
      hasMessage: false,
      label: ''
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
  mounted () {
    if (this.value) {
      this.verifyStates(this.value)
    } else {
      this.verifyStates(this.padrao)
    }
  },
  methods: {
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
          this.label = this.tabs[1]
          break
        case 'nAplica':
          this.state = 'nAplica'
          this.classColor = 'orange'
          this.md_icon = 'more_horiz'
          this.label = this.tabs[2]
          break
        default:
          this.state = 'naoConforme'
          this.classColor = 'red'
          this.md_icon = 'cancel'
          this.label = this.tabs[1]
          break
      }
    },
    setState (state) {
      this.state = state
      if (state != 'naoConforme') {
        this.$emit('input', state, this.id)
      } else {
        this.$emit('input', '', this.id)
      }
    },
    onInputImage (value) {
      this.$emit('input', value, this.id)
    },
    onChangeImage () {
      this.$emit('change', this.id)
    }
  }
}
</script>
<style>
</style>
