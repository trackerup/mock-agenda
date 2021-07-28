<template>
  <div>
    <div v-if="!readOnly" class="section-okfoto" :class="{'is-invalid': obrigatorio}">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>

      <div v-mdl class="mdl-tabs mdl-js-tabs ">
        <div class="mdl-tabs__tab-bar">
          <span @click="setState('conforme')" href="//" class="mdl-tabs__tab check_circle_outline"
                :class="{'active': state == 'conforme'}"><i class="material-icons">check_circle_outline</i><span
            class="label">{{ $t('Conforme') }}</span></span>
          <span @click="setState('nConforme')" href="//" class="mdl-tabs__tab cancel"
                :class="{'active': state != 'conforme' && state != null}"><i
            class="material-icons">cancel</i><span class="label">{{ $t('Não Conforme') }}</span></span>
        </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

      <div v-if="state != 'conforme'">
        <input-image
          :id="id"
          :ordem="ordem"
          :texto="texto"
          :tipo="tipo"
          :value="value"
          :formulario="formulario"
          v-on:input="emitValue"
          :embebed="true">
        </input-image>
      </div>
    </div>
    <div v-else class="readOnly">
      <label class="orange" v-html="texto"> <span v-show="obrigatorio">*</span></label>
      <div class="labelvalue">
        <i class="material-icons check_circle_outline" v-if="state == 'conforme'">check_circle_outline</i>
        <i class="material-icons cancel" v-else>cancel</i>
        <div class="imageThumb mdl-layout-item mdl-size-33 imgThumb" v-if="value && value.startsWith('data:image')">
          <div class="image">
            <img :src="value" />
          </div>
        </div>
        <div v-else>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import InputImage from './InputImage'

export default {
  name: 'OkOuFoto',
  components: {InputImage},
  extends: TRInputBase,
  data: () => ({
    state: ''
  }),
  mounted () {
    if (this.value == 'conforme') {
      this.state = this.value
    } else {
      this.state = 'nConforme'
    }
  },
  methods: {
    setState (state) {
      this.state = state
      if (state == 'conforme') {
        this.emitValue(state)
      } else {
        this.$emit('input', '', this.id)
      }
    },
    emitValue (value) {
      this.$emit('input', value, this.id)
    }
  }
}
</script>
