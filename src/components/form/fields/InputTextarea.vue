<template>
  <div>
    <div v-mdl v-if="!readOnly" :class="{'is-invalid': obrigatorio == '1'}"
         class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <textarea
      :name="id"
      :id="id"
      :value="value"
      v-on:input="onInput"
      v-on:change="onChange"
      class="mdl-textfield__input" rows="3"></textarea>
      <label class="mdl-textfield__label" :for="id"><span v-html="texto"></span> <span v-show="obrigatorio == '1'">*</span></label>
    </div>
    <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio == '1'">*</span></label>
      <span class="value" v-html="value ? value : ' - '"></span>
    </div>
    <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
  </div>
</template>
<script>
import TRInputBase from './InputBase'

export default {
  extends: TRInputBase,
  name: 'InputTextarea',
  props: {},
  data: () => ({}),
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value, this.id)
    },
    onChange () {
      this.$emit('change', this.id)
    }
  }
}
</script>
