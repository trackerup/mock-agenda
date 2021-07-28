<template>
  <div>
    <div v-if="!readOnly" class="section section-form input-selecao-pecas">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <button class="mdl-button mdl-button--raised bgGray button-input"
              @click="showDialogAdd()">
        <i class="material-icons">add</i>{{ $t('Incluir novo item consumido') }}
      </button>
      <ul v-mdl class="mdl-list list-pecas">
        <li class="mdl-list__item mdl-list__item--two-line" v-for="(item,index) in itemsSelected.itens" :key="index">
          <span class="mdl-list__item-primary-content">
            <span>{{item.tipo}} - ({{item.codigo}}) {{item.name}}</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <div class="qtd-actions">
              <button class="qtd-control" @click="removeQuantity(item)"><i class="material-icons">remove</i></button>
              <input type="number" v-model="item.quantidade" min="1">
              <button class="qtd-control" @click="addQuantity(item)"><i class="material-icons">add</i></button>
            </div>
            <a class="mdl-list__item-secondary-action" href="#" @click="preRemoveItem(item)"><i class="material-icons">remove_circle</i></a>
          </span>
        </li>
      </ul>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

      <!-- diablog for remove item -->
      <dialog v-mdl class="mdl-dialog" id="dialogConfirmRemoveItem">
        <h6 class="mdl-dialog__title">{{ $t('Confirmar exclusão') }}</h6>
        <div class="mdl-dialog__content">
          <p>
            {{
            $t('Deseja realmente remover este item do campo {content} ?', { content: itemNeededSelectedToRemove.idServer + ' - ' + itemNeededSelectedToRemove.id })
            }}
          </p>
        </div>
        <div class="mdl-dialog__actions">
          <button type="button" class="mdl-button orange" @click="saveAndCloseDialogMaintenance()">
            {{ $t('Ok') }}
          </button>
          <button type="button" class="mdl-button grey close" @click="closeDialogMaintenance()">
            {{ $t('Cancelar') }}
          </button>
        </div>
      </dialog>

      <!-- main dialog -->
      <dialog v-mdl class="mdl-dialog" id="dialogMain">
        <h6 class="mdl-dialog__title" v-html="texto"></h6>
        <div class="mdl-dialog__content">

          <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label mdl-select" :class="{'is-dirty': serviceItemValue != ''}">
            <input type="text" v-model="serviceItemLabel" class="mdl-textfield__input" :id="'serviceItem' + id" @click="serviceVisible = true" readonly @blur="visible = false">
            <input type="hidden" v-model="serviceItemValue" name="sample5">
            <i class="mdl-icon-toggle__label material-icons">arrow_drop_down</i>
            <label :for="'serviceItem' + id" class="mdl-textfield__label" v-html="texto"></label>
            <ul for="sample5" class="mdl-menu mdl-menu--bottom-left mdl-js-menu" ref="dropdownMenu" v-if="serviceVisible">
              <li class="mdl-menu__item" v-for="item in itemsService" :key="item.id" :data-val="item.id" @click="setServiceInput(item)">
                {{item.name}}
              </li>
            </ul>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="[{'is-dirty': value != ''}]">
            <input class="mdl-textfield__input"
                  id="sliderValue"
                  autocomplete="off"
                  v-model="sliderValue"
                  type="number">
            <label class="mdl-textfield__label" for="sliderValue" ><span v-html="$t('Quantidade')"></span> <span v-show="obrigatorio">*</span></label>
          </div>
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="[{'is-dirty': value != ''}]">
            <input class="mdl-textfield__input"
                  v-on:input="onInput"
                  :id="id"
                  ref="autocompleteInput"
                  autocomplete="off"
                  v-model="itemNeededItemValue">
            <label class="mdl-textfield__label" :for="id" ><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
          </div>

          <div class="autocomplete-list" v-if="showComplete && itemNeededItemValue !=''">
            <div class="item-list" v-for="item in optionsFilter" :key="item.id" @click="setItemNeeded(item)">
              <span >
                {{item.codigo}} - {{item.name}}
              </span>
            </div>
            <div class="item-list" v-if="showComplete && itemNeededItemValue !='' && !optionsFilter.length">
                <span>
                  Nada encontrado
                </span>
            </div>
          </div>

        </div>
        <div class="mdl-dialog__actions">
          <button type="button" class="mdl-button orange"
                  @click="saveAndCloseDialogAdd()">{{ $t('Salvar') }}
          </button>
          <button type="button" class="mdl-button grey close" @click="closeDialogAdd()">{{ $t('Fechar') }}</button>
        </div>
      </dialog>
    </div>
    <div v-else class="readOnly section section-form">
      <label class="orange">
        {{ texto }}
      </label>
      <ul v-if="value" class="fieldList">
        <li v-for="(item, index) in value" :key="index">
          <button class="mdl-button mdl-button--icon button-cancelar">
            <i class="material-icons">close</i>
          </button>
          {{ $t('Tipo:') }} {{ item.tipo }}, {{ $t('Quantidade:') }} {{ item.quantidade }}, {{ $t('Item:') }} {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import DraggerQuantity from '../../fields/DraggerQuantity'
import TRInputBase from './InputBase.vue'
import lists from '../../../plugins/persistence/entities/lists'
import { empty } from '../../../utils'

export default {
  name: 'InputConsumption',
  extends: TRInputBase,
  components: {
    DraggerQuantity
  },
  data () {
    return {
      serviceVisible: false,
      serviceItemLabel: '',
      serviceItemValue: '',

      showComplete: false,
      itemNeededItemLabel: '',
      itemNeededItemValue: '',

      itemNeededSelectedToRemove: {
        name: ''
      },
      itemsSelected: {itens: []},
      serviceSelected: { },
      itemsService: [
        {id: 'reparo', name: 'Reparo'},
        {id: 'troca', name: 'Troca'},
        {id: 'reposicao', name: 'Reposição (furto/vandalismo)'}
      ],
      itemNeededSelected: null,
      itemNeeded: [],
      dialogConfirmRemoveItem: false,
      sliderValue: 1
    }
  },
  async beforeMount () {
    const {itens} = await lists.getFormList(this.lista)
    this.itemNeeded = itens.map(item => {
      return {
        id: item.id,
        codigo: item.codigo,
        name: item.titulo,
        quantidade: 0
      }
    })
  },
  mounted () {
    this.$dialogPolyfill.doDialog('dialogConfirmRemoveItem')
    this.$dialogPolyfill.doDialog('dialogMain')
    this.hasAnswer(this.value)
  },
  computed: {
    optionsFilter () {
      const _self = this
      return this.itemNeeded.filter((option) => {
        return option.name.toLowerCase().indexOf(_self.itemNeededItemValue.toLowerCase()) > -1 ||
                option.codigo.toLowerCase().indexOf(_self.itemNeededItemValue.toLowerCase()) > -1
      }).slice(0, 10) // mostra somente os primeiros 10 itens
    }
  },
  methods: {
    hasAnswer (value) {
      if (value && typeof value === 'object') {
        this.itemsSelected.itens = value.itens
      } else if (value && typeof value === 'string') {
        this.itemsSelected.itens = JSON.parse(value).itens
      }
    },
    onInput (e) {
      this.showComplete = true
    },
    onChange () {
      this.showComplete = false
    },
    handleBlur () {
      this.showComplete = false
    },
    changeSliderValue (value) {
      this.sliderValue = value
    },
    setOrUpdateSelected () {
      this.itemsSelected.itens = this.itemsSelected.itens.filter(item => item.idServer != this.itemNeededSelected.id)
      const itemSelected = {
        name: this.itemNeededSelected.name,
        idServer: this.itemNeededSelected.id,
        codigo: this.itemNeededSelected.codigo,
        quantidade: this.sliderValue,
        tipo: this.serviceSelected.name
      }
      this.itemsSelected.itens.push(itemSelected)
      this.closeDialogAdd()
      // emit selected here
      this.$emit('input', this.itemsSelected, this.id)
    },
    showDialogMaintenance () {
      this.$el.querySelector('#dialogConfirmRemoveItem').showModal()
    },
    closeDialogMaintenance () {
      this.$el.querySelector('#dialogConfirmRemoveItem').close()
    },
    showDialogAdd () {
      this.$el.querySelector('#dialogMain').showModal()
    },
    closeDialogAdd () {
      this.$el.querySelector('#dialogMain').close()
      this.clearFields()
    },
    clearFields () {
      this.serviceVisible = false
      this.serviceItemLabel = ''
      this.serviceItemValue = ''

      this.showComplete = false
      this.itemNeededItemLabel = ''
      this.itemNeededItemValue = ''

      this.serviceSelected = {}
      this.itemNeededSelectedToRemove = { name: '' }
      this.sliderValue = 1
    },
    saveAndCloseDialogMaintenance () {
      this.removeSelected()
      this.dialogConfirmRemoveItem = false
      this.closeDialogMaintenance()
      // emit remove here
      this.$emit('input', this.itemsSelected, this.id)
    },
    saveAndCloseDialogAdd () {
      if (!empty(Object.keys(this.serviceSelected).length) && !empty(this.itemNeededSelected)) {
        this.setOrUpdateSelected()
      }
    },
    removeQuantity (item) {
      if (parseInt(item.quantidade) > 1) {
        item.quantidade = parseInt(item.quantidade) - 1
      }
    },
    addQuantity (item) {
      item.quantidade = parseInt(item.quantidade) + 1
    },
    preRemoveItem (item) {
      this.itemNeededSelectedToRemove = item
      this.dialogConfirmRemoveItem = !this.dialogConfirmRemoveItem
      this.showDialogMaintenance()
    },
    removeSelected () {
      this.itemsSelected.itens = this.itemsSelected.itens.filter(item => item.idServer != this.itemNeededSelectedToRemove.idServer)
      this.itemNeededSelectedToRemove = {name: ''}
    },
    setServiceInput (item) {
      this.serviceItemLabel = item.name
      this.serviceItemValue = item.id
      this.serviceVisible = false
      this.serviceSelected = item
    },
    setItemNeeded (item) {
      this.itemNeededSelected = item
      this.itemNeededItemLabel = item.name
      this.itemNeededItemValue = item.codigo
      this.showComplete = false
    }
  }
}
</script>

<style scoped>
.mdl-dialog__content {
  position: relative;
}
.autocomplete-list {
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  top: 100%;
  z-index: 999;
  margin-top: -16px;
  background: #f9f9f9;
  border: 1px solid #efefef;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.item-list {
  box-sizing: border-box;
  min-height: 48px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
}
.item-list:hover {
  background: #FFF;
}
</style>
