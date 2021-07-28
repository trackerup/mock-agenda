<template>
  <div>
    <div v-if="!readOnly" class="section-field">

      <label class="orange"><span v-html="field.label"></span> <span v-show="obrigatorio">*</span></label>

      <label v-mdl class="mdl-checkbox mdl-js-checkbox "
             v-for="(item, index) in field.vars.items" :key="index">
        <input type="checkbox" :id="item.name+item.id" :name="item.name" class="mdl-checkbox__input"
               v-model="field.value" :value="item.id">
        <span class="mdl-checkbox__label">{{item.name}}</span>
      </label>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
      <span v-for="(item,index) in field.value" :key="index">{{item}}<br/></span>
    </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'

export default {
  extends: TRInputBase,
  name: 'InputCheckboxes',
  props: {
    field: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .mdl-checkbox {
    border-bottom: 0;
  }
</style>
<!--
{
  name: 'checkboxes',
  label: 'Lista de multipla escolha',
  id: '124551',
  value: [],
  vars: {
    items: [
      {
        name: 'asd',
        id: 1
      },
      {
        name: 'dfg',
        id: 2
      }
    ]
  }
}
-->
