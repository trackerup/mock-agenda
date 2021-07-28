<template>
  <div>
    <div v-if="!readOnly">

      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="[{'is-dirty': value != ''}]">
        <input class="mdl-textfield__input"
               v-on:input="onInput"
               v-on:change="onChange"
               v-on:blur="handleBlur"
               :type="type"
               :id="id"
               ref="autocompleteInput"
               autocomplete="off"
               :value="value">
        <label class="mdl-textfield__label" :for="id" ><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>
      <div class="autocomplete-list" v-if="showComplete && value !=''">
          <div class="item-list" v-for="item in optionsFilter" :key="item.id" @click="changeToSelected(item.codigo)">
            <span >
              {{item.codigo}} - {{item.titulo}}
            </span>
          </div>
          <div class="item-list" v-if="showComplete && value !='' && !optionsFilter.length">
              <span>
                Nada encontrado
              </span>
          </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

    </div>
    <div v-else class="readOnly">
      <label class="orange" v-html="texto"> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        {{ value ? value : ' - ' }}
      </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import lists from '../../../plugins/persistence/entities/lists'

export default {
  name: 'InputAutoComplete',
  extends: TRInputBase,
  data () {
    return {
      type: 'text',
      itemValue: '',
      itemLabel: '',
      options: [],
      showComplete: false
    }
  },
  async beforeMount () {
    const { itens } = await lists.getFormList(this.lista)
    this.options = itens
  },
  computed: {
    optionsFilter () {
      return this.options.filter((option) => {
        return option.titulo.toLowerCase().indexOf(this.value.toLowerCase()) > -1 ||
                option.codigo.toLowerCase().indexOf(this.value.toLowerCase()) > -1
      }).slice(0, 10) // mostra somente os primeiros 10 itens
    }
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value, this.id)
      this.showComplete = true
    },
    onChange () {
      this.$emit('change', this.id)
      setTimeout(() => {
        this.showComplete = false
      }, 100)
    },
    handleBlur () {
      this.$emit('change', this.id)
      setTimeout(() => {
        this.showComplete = false
      }, 100)
    },
    changeToSelected (value) {
      this.$emit('input', value, this.id)
      this.$emit('change', this.id)
      this.showComplete = false
    },
    isValid: function () {
      this.errors = []
      this.hasErrors = false
      if (this.obrigatorio == '1' && (this.value == '' || this.value == null)) {
        this.errors.push(this.$t('Este field é obrigatório'))
        this.hasErrors = true
        return false
      }
      return true
    }
  }
}
</script>
