<template>
  <div>
    <div v-if="!readOnly && !value" class="section-stars">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="inputstars">
        <button class="mdl-button mdl-button--icon mdl-button--colored" :key="index" v-for="(item, index) in 5" @click="confirm(index+1)">
          <i class="material-icons">
            <template v-if="index < currentValue">
              star
            </template>
            <template v-else>
             star_border
            </template>
          </i>
        </button>
        </div>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else-if="value && !this.$parent.$parent.$parent.readOnly> 0" class="readOnly section-stars">
      <span class="value">
        <center>{{ $t('Avaliação registrada com sucesso, muito obrigado!') }}</center>
      </span>
    </div>
    <div v-else class="readOnly section-stars">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        {{ $t('Este campo não pode ser lido no App') }}
      </span>
    </div>
    <dialog id="confirmStars" v-mdl class="conf mdl-dialog">
      <h6 class="mdl-dialog__title">{{ $t('Confirmação do cliente') }}</h6>
      <div class="mdl-dialog__content">
        <p>
          <span>{{$t('Gostaria de confirmar a nota de ')}}{{this.currentValue}} <i class="material-icons orange text-base-line">star</i>{{$t(' para o atendimento do técnico?')}}</span>
        </p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button orange" @click="setItemValue()">
          {{ $t('OK') }}
        </button>
        <button type="button" class="mdl-button grey close" @click="cancelarNota()">
          {{ $t('Cancelar') }}
        </button>
      </div>
    </dialog>
  </div>
</template>

<script>
import TRInputBase from './InputBase.vue'

export default {
  name: 'InputStars',
  extends: TRInputBase,
  data () {
    return {
      currentValue: 0
    }
  },
  beforeMount () {
    // this.$emit('input', null, this.id)
    this.$emit('change', this.id)
  },

  mounted () {
    this.$dialogPolyfill.doDialog('confirmStars')
  },

  methods: {
    setItemValue () {
      this.$emit('input', this.currentValue, this.id)
      this.$emit('change', this.id)
      this.$el.querySelector('#confirmStars').close()
      this.$root.cardContent = false
      this.$forceUpdate()
      this.updateDom()
    },
    cancelarNota () {
      this.currentValue = 0
      this.$el.querySelector('#confirmStars').close()
      this.$root.cardContent = false
      this.$forceUpdate()
      this.updateDom()
    },
    confirm (value) {
      this.$root.cardContent = true
      this.currentValue = value
      this.$el.querySelector('#confirmStars').showModal()
    },
    updateDom () {
      setTimeout(() => {
        document.querySelector('#card-content').style.height = 'inherit'
      }, 1000)
    }
  },
  beforeDestroy: function () {
    this.$root.cardContent = false
  }
}
</script>
<style scoped>
  .mdl-button:hover,
  .mdl-button:active {
    background: none !important;
  }

  dialog {
    flex-direction: column;
  }

  .mdl-dialog__content p {
    display: flex;
  }

  .text-base-line {
    vertical-align: text-bottom;
  }
</style>
