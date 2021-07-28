<template>
  <div>
    <div class="section-field" v-if="!readOnly" :class="{'is-invalid': obrigatorio}">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <label v-mdl class="mdl-checkbox mdl-js-checkbox " v-for="item in items" :key="item.id" :class="[{itemsSelected: 'is-dirty' != ''}]" v-on:change="onChange">
        <input type="checkbox" :id="'checkbox'+item.id" class="mdl-checkbox__input" :value="item.id" v-model="itemsSelected" v-on:change="onChange">
        <span class="mdl-checkbox__label">{{ item.titulo }}</span>
      </label>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else-if="value" class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        <span v-for="(item, index) in value" :key="index">
          {{ items.find(x => x.id == item) ? items.find(x => x.id == item).titulo : item }}
        <br/>
      </span>
    </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase'
import lists from '../../../plugins/persistence/entities/lists'

export default {
  name: 'InputSelectMultiBox',
  extends: TRInputBase,
  props: {},
  data: () => ({
    itemsSelected: [],
    items: []
  }),
  methods: {
    onChange () {
      // this.$emit('change', this.id)
      if (this.items && this.items.length == 1) {
        if (this.itemsSelected === true || (typeof this.itemsSelected == 'object' && this.itemsSelected.length > 0)) {
          this.$emit('input', [this.items[0].id], this.id)
        } else {
          this.$emit('input', null, this.id)
        }
      } else {
        this.$emit('input', this.itemsSelected, this.id)
      }
      this.$emit('change', this.id)
    }
  },
  async beforeMount () {
    const {itens} = await lists.getFormList(this.lista)
    this.items = itens
    // for get values alright selected
    if (!this.value) {
      this.itemsSelected = []
    } else {
      // should be receive a array of ids, like: ["4798", "4799"]
      this.itemsSelected = this.value
    }
  }
}
</script>
<style scoped>
.mdl-checkbox {
  border-bottom: 0;
}
</style>
