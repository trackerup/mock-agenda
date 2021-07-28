<template>
  <div>
    <div class="signature-content mdl-textfield" :class="{'is-invalid': obrigatorio}" v-if="!readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <MySignaturePad
        v-bind:value="value"
        v-on:input="onInput"
        v-on:change="onChange"
      />
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>

    <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <img :src="value"/>
    </div>

  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import MySignaturePad from '@/components/shared/Signaturepad'

export default {
  name: 'InputSing',
  extends: TRInputBase,
  components: {
    MySignaturePad
  },
  data: () => ({}),
  methods: {
    onInput (value) {
      this.$emit('input', value, this.id)
    },
    onChange () {
      this.$emit('change', this.id)
    }
  }
}
</script>
<style lang="scss" scoped>
  .signature-content {
    background: none;
    padding-top: 0;
    margin-bottom: 0;
    label {
      color: var(--primaryColor);
      font-size: 12px;
      margin-bottom: 8px;
      display: block;
      position: relative;
      top: 0;
      left: 0;
      padding-left: 8px;
    }
    .content-component {
      width: calc(100% - 16px);
      margin-bottom: 16px;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
</style>
