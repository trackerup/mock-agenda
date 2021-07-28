<template>
  <div class="recursive-accordion" :class="['recursive-accordion--depth-' + depth, {'recursive-accordion--has-children': children}]">
    <div class="recursive-accordion__item"
         :style="{marginLeft: (depth - 1) * 16 + 'px'}"
         :class="[{' active': isOpen || isOpenClick || isOpenValue}, {'title': item.childrenCount > 1}]"
         v-if="item.childrenCount > 1 || index == 'modelos' || index == 'pecas' || index == 'ocorrencia'">
      <span class="recursive-accordion__title pad" v-if="item.name != 'fcta'">
        <p class="full accordionSearch">
          <InputSearch :readonly="isLockedSearch" :name="item.name" v-model="searchTerm"
          ref="InputSearch"></InputSearch>
        </p>
        <i class="material-icons recursive-accordion__icon" v-if="(item.name != 'fcta')" v-on:click="openAccordion()">
          {{ isOpen || isOpenClick || isOpenValue ? 'arrow_drop_up' : 'arrow_drop_down' }}
        </i>
      </span>
    </div>

    <div class="recursive-accordion__item" @click="clickHandler"
         :style="{marginLeft: (depth) * 16 + 'px'}"
         :class="[{' active': isOpen || isOpenClick || isOpenValue}, {'title': item.childrenCount > 0}, {'item-fcta':depth > 6 }]"
         v-else-if="indexAbove != lastDepth && item.childrenDesc"
    >
      <span v-if="index != lastDepth">
        <span class="recursive-accordion__title" v-if="indexAbove != lastDepth">
          <span class="descricaoItem" v-html="item.childrenDesc" v-if="index != lastDepth"></span>
          <i class="material-icons recursive-accordion__icon" v-if="(item.childrenCount == 1)">
            {{ isOpen || isOpenClick || isOpenValue ? 'arrow_drop_up' : 'arrow_drop_down' }}
          </i>
        </span>
      </span>
    </div>
    <div class="recursive-accordion__children" v-if="(isOpen || isOpenClick || isOpenValue) && indexAbove != lastDepth">
      <div v-if="!mountForm && indexAbove != lastDepth">
        <span v-for="(item2, index2) in node" :key="index2" class="secondNivel">
          <RecursiveAccordion
            :node="node[index2]"
            :index="index2"
            :itemAbove="node"
            :indexAbove="index"
            :treePath="treePath+'.'+index"
            :depth="depth + 1"
            :value="value"
            :metadados="metadados"
            :jsonPath="jsonPath"
            :question="question"
            ref="recursiveAccordion"
            v-on:input="setValue"
            v-show="typeof item2 == 'object' && !mountForm && isVisible(item2)"
          />
        </span>
      </div>
      <div v-if="!hasResult" class="jsonValueNotFound">
          <div class="mdl-card mdl-shadow--2dp"  >
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text" v-if="!searching">{{ $t('Nenhum registro encontrado!')}}</h2>
              <h2 class="mdl-card__title-text" v-else>{{ $t('Aguarde...')}}</h2>
            </div>
            <div class="mdl-card__supporting-text" >
              <button class="mdl-button mdl-button--raised bgGray button-input" @click="pesquisar" v-if="!searching">
                <i class="material-icons">search</i>{{ $t('Pesquisar ' + index) }}
              </button>
            </div>
          </div>
      </div>
      <div :style="{marginLeft: (depth > 1 ? depth : 2) * 16 - 16 + 'px'}" v-if="index == lastDepth">
        <InputRadioButton
          :model="{item: node}"
          :value="selectValue"
          :currentValue="value"
          :selectedValue="value"
          :itemAbove="itemAbove"
          :searchTerm="searchTerm"
          :depth="depth + 1"
          :question="question"
          ref="inputRadioButton"
          :treePath="treePath"
          v-on:input="setValueFinal">
        </InputRadioButton>
      </div>
    </div>

  </div>
</template>

<script>
import InputRadioButton from './InputRadioButton.vue'
import InputSearch from './InputSearch.vue'
import { like } from '@/utils/'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'

export default {
  components: {
    InputRadioButton,
    InputSearch
  },
  name: 'RecursiveAccordion',
  data: () => ({
    item: {
      name: '',
      descricao: '',
      childrenCount: 0,
      childrenArr: [],
      childrenDesc: '',
      autocomplete: {
        name: 'autocomplete',
        title: '',
        id: '',
        value: null,
        vars: {
          items: []
        }
      }
    },
    search: '',
    isOpenClick: false,
    children: false,
    mountForm: true,
    searchTerm: '',
    selectValue: ''
  }),
  props: {
    node: {
      required: true
    },
    depth: {
      required: false,
      type: Number,
      default: 1
    },
    index: {
      required: true,
      type: String
    },
    itemAbove: {
      type: Object,
      required: true
    },
    indexAbove: {
      required: true,
      type: String
    },
    treePath: {
      required: true,
      type: String
    },
    value: {
      default: ''
    },
    jsonPath: {
      default: function () {
        return [
          'modelos',
          'material',
          'pecas',
          'ocorrencia',
          'fcta'
        ]
      }
    },
    metadados: {
      default: function () {
        return {}
      }
    },
    searching: {
      default: false
    },
    question: {
      required: true
    }
  },
  beforeMount () {
    this.clear()
    if (this.index == 'material' || this.index == 'modelos') {
      this.searchTerm = this.defaultSearchTerm()
      this.$forceUpdate()
    }
  },
  methods: {
    defaultSearchTerm () {
      if (this.metadados) {
        let metaValue = Object.values(this.metadados).find(metaDado => metaDado.meta_key == 'defaultPreresp')
        if (metaValue) {
          let material = this.preResp[metaValue.meta_value]
          switch (this.index) {
            case 'modelos':
              for (let modelo in this.node) {
                if (this.node.hasOwnProperty(modelo)) {
                  if (material && material.indexOf(modelo) == 0) {
                    return modelo
                  }
                }
              }
              return material
            case 'material':
              return material
          }
        }
      }
      return ''
    },
    pesquisar () {
      if (this.indexAbove == 'defeitos') {
        this.$emit('redownloadDefects')
      } else {
        this.$emit('pesquisarModelo', this.searchTerm)
      }
      this.clear()
    },
    filtrar (value) {
      console.log(value)
      this.searchTerm = value
    },
    clear () {
      this.item.name = this.index
      this.item.autocomplete.title = this.index
      this.item.autocomplete.vars.items = []
      this.getNodeChildrenArr()
      this.isOpenClick = false
    },
    getNodeChildrenArr () {
      for (let key in this.node) {
        if (typeof this.node[key] == 'object') {
          this.mountForm = false
          this.children = true
          this.item.childrenArr.push(this.node[key])
          this.item.childrenCount = this.item.childrenCount + 1
        } else if (this.$t(this.node[key])) {
          if (this.item.childrenDesc) {
            this.item.childrenDesc += '<small><b>' + this.$t(key) + ': </b> ' + this.$t(this.node[key]) + '</small><br>'
          } else {
            this.item.childrenDesc += '<b>' + this.$t(key) + ':  ' + this.$t(this.node[key]) + '</b><br>'
          }
        }
      }
    },
    clickHandler (event) {
      this.isOpenClick = !this.isOpenClick
      setTimeout(() => {
        window.checkDirty()
      })
    },
    searchFor (value) {
      return Object.keys(this.node).find(function (key, index) {
        return key == value
      })
    },
    isVisible (item) {
      let value = ''
      for (let key in item) {
        if (typeof item[key] == 'string') {
          value += (item[key]).replace(/\s\s+/g, ' ') + ' '
        }
      }
      return (!this.searchTerm || this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', value.toUpperCase()))
    },
    setValue (value) {
      var valueDesc = ' '
      if (typeof this.node.descricao != 'undefined') {
        valueDesc = this.node.descricao
      } else if (typeof this.node.nomePeca != 'undefined') {
        valueDesc = this.node.nomePeca
      }

      this.selectValue = {
        name: this.item.name,
        descricao: valueDesc,
        value: value
      }
      this.$emit('input', this.selectValue)
    },
    setValueFinal (item) {
      this.selectValue = {
        name: this.item.name,
        descricao: item.descricao,
        value: item.value
      }
      this.$emit('input', this.selectValue)
    },
    openAccordion () {
      if (this.searchTerm == '') {
        this.searchTerm = ' '
      } else {
        this.searchTerm = ''
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        let value = val
        while (typeof value.value != 'undefined') {
          value = value.value
        }
        this.selectValue = value
      } else {
        this.selectValue = null
      }
    }
  },
  computed: {
    ...mapGetters({
      defaultPreResp: 'task/defaultPreResp'
    }),
    hasResult () {
      if (this.searchTerm) {
        return Object.values(this.node).find(item => {
          return this.isVisible(item)
        })
      }
      return Object.keys(this.node).length > 0
    },
    isOpen () {
      return this.searchTerm != '' || this.item.name == this.lastDepth || this.depth == 0
    },
    isLockedSearch () {
      if (this.metadados) {
        let metaValue = Object.values(this.metadados).find(metaDado => metaDado.meta_key == 'lockSearch')
        if (metaValue && (this.index == 'material')) {
          return metaValue.meta_value == 'on'
        }
      }
      return false
    },
    isOpenValue () {
      let value = this.value
      if (value) {
        for (let i = 0; i <= this.depth && value != undefined; i++) {
          if (value.name == this.item.name) {
            return true
          }
          value = value.value
        }
      }
      return false
    },
    lastDepth () {
      return this.jsonPath[this.jsonPath.length - 1]
    }
  },
  beforeDestroy: function () {
    this.item = null
    if (this.$refs) {
      if (this.$refs.recursiveAccordion) {
        this.$refs.recursiveAccordion.forEach(element => {
          try {
            element.$destroy()
            element = null
          } catch (e) {
          }
        })
      }
      if (this.$refs.inputRadioButton) {
        this.$refs.inputRadioButton.$destroy()
        this.$refs.inputRadioButton = null
      }
      if (this.$refs.InputSearch) {
        this.$refs.InputSearch.$destroy()
        this.$refs.InputSearch = null
      }
    }
    window.componentHandler.downgradeElements(this.$el)
  }
}
</script>
<style lang="scss" scoped>
  .recursive-accordion__icon {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
  }

  .recursive-accordion__title {
    position: relative;
    display: block;
    border-bottom: 1px solid #E3E3E3;
    padding: 10px 0;
    &.pad {
      border-bottom: 0;
      padding: 0;
    }
    .mdl-textfield {
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  .recursive-accordion--depth-0 {
    > .recursive-accordion__item {
      padding-left: 16px !important;
      padding-bottom: 10px;

      .recursive-accordion__title {
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: wrap;
        border-bottom: 0;
        padding: 0;
      }

      .item-name {
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.017em;
      }
      .recursive-accordion__icon {
        display: none;
      }
      .descricaoItem {
        font-size: 14px;
        margin-bottom: 4px;
        line-height: 17px;
        letter-spacing: 0.017em;
      }
    }
  }
  .item-name {
    font-weight: bold !important;
    color: black;
  }

  .recursive-accordion {

    .descricaoItem {
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.017em;
      color: rgb(49, 49, 49);
      padding-right: 24px;
      display: block;
    }
    .radioFctaGroup {
      margin-bottom: 0;
    }

  }

  .recursive-accordion--depth-6 {
    .recursive-accordion__title {
      padding-top: 4px;
      padding-bottom: 4px;
      .item-name {
        display: none;
      }
    }
    .recursive-accordion__item {
      padding-left: 4px;
      &.active {
        //background: rgba(0, 0, 0, 0.08);
      }
    }
  }

</style>
<style>
  p.full {
    width: 100%;
  }
</style>
