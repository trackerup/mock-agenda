<template>
  <div class="radioFctaGroup">
    <div v-for="(item, index) in model.item" :key="index">
      <div class="radioFcta" v-if="isVisible(item)" >

        <span v-if="item.material">
          <label class="mdl-radio mdl-js-radio mdl-radio-no-mdl radio-big" :for="'option-' + index + '-' + question">
            <input type="radio"
                    :id="'option-' + index + '-' + question"
                    class="mdl-radio__button"
                    name="options"
                    v-model="currentValue"
                    v-on:change="save(item.material, item.material)"
                    :value="item.material"
                    :checked="isChecked(item.material)">
                  <span class="radio__outer-circle">
                      <span class="radio__inner-circle">
                      </span>
                  </span>
            <span class="mdl-radio__label">
              <b>{{item.material}}</b><br>
              {{item.descricao}}
            </span>
          </label>
        </span>
        <span v-else-if="item.peca">
          <label class="mdl-radio mdl-radio-no-mdl mdl-js-radio radio-big" :for="'option-' + index + '-' + question">
            <input type="radio"
                    :id="'option-' + index + '-' + question"
                    class="mdl-radio__button"
                    name="options"
                    v-model="currentValue"
                    v-on:change="save(item.peca, item.nomePeca)"
                    :value="item.peca"
                    :checked="isChecked(item.peca)">
                  <span class="radio__outer-circle">
                      <span class="radio__inner-circle">
                      </span>
                  </span>
            <span class="mdl-radio__label">
              <b>{{item.peca}}</b><br>
              {{item.nomePeca}}
            </span>
          </label>
        </span>
        <span v-else-if="item.defeito">
          <label class="mdl-radio mdl-radio-no-mdl mdl-js-radio radio-big" :for="'option-' + index + '-' + question">
            <input type="radio"
                    :id="'option-' + index + '-' + question"
                    class="mdl-radio__button"
                    name="options"
                    v-model="currentValue"
                    v-on:change="save(item.defeito, item.nome)"
                    :value="item.defeito"
                    :checked="isChecked(item.defeito)">
                  <span class="radio__outer-circle">
                      <span class="radio__inner-circle">
                      </span>
                  </span>
            <span class="mdl-radio__label">
              {{item.nome}}
              <small v-if="item.obrigPeca == 'X'">
                <br><b>{{$t('Peça obrigatória')}}</b>
              </small>
            </span>
          </label>
        </span>
        <span v-else-if="item.descricao">
          <label v-mdl class="mdl-radio mdl-js-radio radio-big" :for="treePath + '.' + item.fcta">
          <input type="radio"
            :id="treePath + '.' + item.fcta"
            class="mdl-radio__button"
            :name="getModelFromTree"
            v-on:change="save(item.fcta, item.descricao)"
            :value="item.fcta"
            :checked="isCheckedTree(item.fcta)">
          <span class="mdl-radio__label">
            {{item.descricao}} <b v-if="item.partWarranty"><br><small>{{item.partWarranty}}</small></b>
          </span>
        </label>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { like } from '@/utils/'
export default {
  name: 'InputRadioButton',
  props: {
    model: {
      type: Object,
      required: true
    },
    searchTerm: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      required: false
    },
    depth: {
      type: Number,
      required: false
    },
    treePath: {
      type: String
    },
    itemAbove: {
      type: Object
    },
    selectedValue: {
      type: Object
    },
    question: {
      required: true
    }
  },
  data: () => ({
    currentValue: null
  }),
  watch: {
    value (val) {
      if (val) {
        this.currentValue = val
      } else {
        this.currentValue = null
      }
    }
  },
  computed: {
    getModelFromTree () {
      return this.treePath.split('.')[0]
    }
  },
  methods: {
    save: function (value, description) {
      this.$emit('input', {value: value, descricao: description})
    },
    isVisible (item) {
      let value = ''
      for (let key in item) {
        if (typeof item[key] == 'string') {
          value += (item[key]).replace(/\s\s+/g, ' ') + ' '
        }
      }
      return (this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', value.toUpperCase()))
    },
    isChecked (item) {
      let value = this.value
      if (value && value != '' && value.value) {
        for (let i = 0; i <= this.depth && value != undefined; i++) {
          if (value.value == item) {
            return true
          }
          value = value.value
        }
      }
      return false
    },
    isCheckedTree (item) {
      let arrayPath = this.treePath.split('.')
      let checked = false
      if (this.selectedValue != null) {
        var value = this.selectedValue
        for (let i = 1; i <= this.depth && value != undefined; i++) {
          if (value.value == item) {
            checked = true
            break
          } else {
            if (typeof value == 'object') {
              if (value.name == arrayPath[i]) {
                value = value.value
              }
            }
          }
        }
      }
      Array.prototype.forEach.call(document.getElementsByClassName('mdl-radio__button'), function (el) {
        if (el.checked) {
          el.parentNode.classList.add('is-checked')
        } else {
          el.parentNode.classList.remove('is-checked')
        }
      })
      return checked
    }
  }
}
</script>
