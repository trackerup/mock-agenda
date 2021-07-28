<template>
  <div>
    <div v-if="!readOnly" class="section-trafic-light">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>

      <div class="trafic-light">
          <div v-show="tabs[0]" @click="setState('verde')" href="//" class="green" :class="{'active': state == 'verde'}">&nbsp;</div>
          <div v-show="tabs[1]" @click="setState('amarelo')" href="//" class="yellow" :class="{'active': state == 'amarelo'}">&nbsp;</div>
          <div v-show="tabs[2]" @click="setState('vermelho')" href="//" class="red" :class="{'active': state == 'vermelho'}">&nbsp;</div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>

    <div v-else class="readOnly">
      <label><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="labelvalue">
          <i class="material-icons" :class="[classColor, md_icon]">{{ md_icon }}</i>
          <span v-html="tabs[0]" v-if="value == 'verde'"></span>
          <span v-html="tabs[1]" v-if="value == 'amarelo'"></span>
          <span v-html="tabs[2]" v-if="value == 'vermelho'"></span>
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
        case 'verde':
          this.state = 'verde'
          this.classColor = 'green'
          this.md_icon = 'check_circle_outline'
          this.label = this.tabs[0]
          break
        case 'amarelo':
          this.state = 'amarelo'
          this.classColor = 'red'
          this.md_icon = 'cancel'
          this.label = this.tabs[2]
          break
        case 'vermelho':
          this.state = 'vermelho'
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
<style lang="scss">
.section-trafic-light {
  .trafic-light {
      display: flex;
      flex-direction: row;
      justify-content: center;
      background-color: #f3f3f3;
      div {
        display: block;
        padding: 5px;
        border-radius: 35px;
        width: 35px;
        height: 35px;
        margin: 5px;
        &.green  {
          background-color: green;
        }
        &.yellow  {
          background-color: yellow;
        }
        &.red {
          background-color: red;
        }
        &.active {
            -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
            border: 3px solid #fff;
            width: 32px;
            height: 32px;
        }
      }
  }
}
</style>
