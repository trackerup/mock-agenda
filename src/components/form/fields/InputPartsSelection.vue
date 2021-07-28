<template>
  <div>
    <div class="section" v-if="!readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <button class="mdl-button add-peca grey" @click="showPartsSelectionDialog">
        Adicionar Peça<i class="material-icons">add</i>
      </button>
      <ul v-mdl class="mdl-list list-pecas">
        <li class="mdl-list__item mdl-list__item--two-line" v-for="(item,index) in currentValue" :key="index">
          <span class="mdl-list__item-primary-content">
            <!--<i class="material-icons mdl-list__item-avatar">person</i>-->
            <span>{{item.peca.nome}}</span>
            <span class="mdl-list__item-sub-title" v-if="item.ocorrencia">
              {{item.ocorrencia.nome}} <span v-if="item.fctao != ''">-{{item.fctao.nome}}</span>
            </span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <div class="qtd-actions">
              <button class="qtd-control" @click="removeQuantity(item)"><i class="material-icons">remove</i></button>
              <input type="number" v-model="item.quantidade" min="1" @change="emitValue">
              <button class="qtd-control" @click="addQuantity(item)"><i class="material-icons">add</i></button>
            </div>
            <a class="mdl-list__item-secondary-action" href="#" @click="removeItem(index)"><i class="material-icons">remove_circle</i></a>
          </span>
        </li>
      </ul>
      <PartsSelectionDialog
        ref="partsSelectionDialog"
        :pecas="getTree()"
        :texto="texto"
        :id="id"
        :jsonPath="jsonPath"
        v-on:input="updateValue"
        :currentValue="currentValue"
        @cancel="cancel"
        :preResp="preResp"
        :mascara="mascara"
        @recarrega="pesquisarModelo"
        v-show="dialog.opened"
        :livre="livre"/>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        <ul v-mdl class="mdl-list">
          <li class="mdl-list__item mdl-list__item--two-line" v-for="(item,index) in currentValue" :key="index">
            <span class="mdl-list__item-primary-content">
              <span><span v-if="item.quantidade">{{item.quantidade}} x </span>{{item.peca.nome}}</span>
              <span class="mdl-list__item-sub-title" v-if="item.ocorrencia">
                {{item.ocorrencia.nome}} <span v-if="item.fctao != ''">-{{item.fctao.nome}}</span>
              </span>
            </span>
          </li>
        </ul>
      </span>
    </div>
</div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import PartsSelectionDialog from './partsSelection/PartsSelectionDialog.vue'
import InputSearch from './jsonValue/InputSearch.vue'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
import { getters, setters } from '@/plugins/persistence/services/'
import { download, updateMetaTask } from '@/services/tasks'

export default {
  name: 'inputPartsSelection',
  extends: TRInputBase,
  components: {
    PartsSelectionDialog, InputSearch
  },
  data: () => ({
    dialog: {
      opened: false
    },
    searchTerm: '',
    searching: false,
    currentValue: null,
    tab: '',
    jsonPath: null,
    oldpreResp: null,
    modelo: null
  }),
  props: {
    mascara: {
      type: String,
      required: false,
      default: ''
    },
    fieldMetadados: {}
  },
  mounted () {
    if (this.defaultPreResp) {
      this.oldpreResp = JSON.parse(JSON.stringify(this.defaultPreResp))
    } else {
      if (this.currentTask && this.currentTask.metaDados) {
        this.oldpreResp = JSON.parse(Object.values(this.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
      }
    }
    // setTimeout(() => {
    //   this.$dialogPolyfill.doDialog('partsSelectionDialog')
    // }, 1000)
    if (this.mascara) {
      this.jsonPath = this.mascara.split('.')
    } else {
      this.jsonPath = [
        'modelos',
        'material',
        'pecas',
        'ocorrencia',
        'fcta'
      ]
    }
    this.diagnosticTree()

    if (this.value && typeof this.value == 'string' && this.value != '') {
      this.currentValue = JSON.parse(this.value)
    }
  },
  beforeCreate () {
    this.$options.components.RecursiveAccordion = require('./jsonValue/RecursiveAccordion.vue').default
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      defaultPreResp: 'task/defaultPreResp'
    }),
    preResp () {
      if (this.defaultPreResp) {
        return this.defaultPreResp
      } else {
        if (this.currentTask && this.currentTask.metaDados) {
          return JSON.parse(Object.values(this.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
        }
        return null
      }
    },

    indexPreresp () {
      if (this.fieldMetadados) {
        let metaValue = Object.values(this.fieldMetadados).find(metaDado => metaDado.meta_key == 'defaultPreresp')
        if (metaValue) {
          return this.preResp[metaValue.meta_value]
        }
      }
      return ''
    },

    livre () {
      if (this.fieldMetadados) {
        let metaValue = Object.values(this.fieldMetadados).find(metaDado => metaDado.meta_key == 'livre')
        if (metaValue) {
          return metaValue.meta_value == '1'
        }
      }
      return false
    }
  },
  watch: {
    value (val) {
      if (typeof val == 'string') {
        this.currentValue = JSON.parse(val)
      } else {
        this.currentValue = val
      }
    }
  },
  methods: {
    emitValue () {
      this.$emit('input', JSON.stringify(this.currentValue), this.id)
    },
    removeItem (index) {
      this.$delete(this.currentValue, index)
      this.$emit('input', JSON.stringify(this.currentValue), this.id)
    },
    removeQuantity (item) {
      if (parseInt(item.quantidade) > 1) {
        item.quantidade = parseInt(item.quantidade) - 1
        this.$emit('input', JSON.stringify(this.currentValue), this.id)
      }
    },
    addQuantity (item) {
      item.quantidade = parseInt(item.quantidade) + 1
      this.$emit('input', JSON.stringify(this.currentValue), this.id)
    },
    getTree () {
      // try {
      if (typeof window.tree == 'undefined') {
        window.tree = {}
      }
      if (!window.tree[this.id]) {
        window.tree[this.id] = {
          catalogo: {
            pecas: []
          },
          pecas: {
            pecas: []
          }
        }
      }
      if (this.jsonPath && this.jsonPath[0] == 'pecas') {
        return window.tree[this.id].pecas.pecas
      } else {
        return window.tree[this.id].catalogo.pecas
      }
      // } catch (error) {
      //   console.log(error)
      // }
    },
    pesquisarModelo (modelo) {
      this.modelo = modelo
      this.searching = true
      this.$bus.$emit('showSnackBar', {
        message: this.$t('Aguarde...'),
        duration: 1000
      })
      this.currentValue = null

      let metaValue = Object.values(this.fieldMetadados).find(metaDado => metaDado.meta_key == 'defaultPreresp')
      let metaValueDownload = Object.values(this.fieldMetadados).find(metaDado => metaDado.meta_key == '__download')
      if (metaValue) {
        this.preResp[metaValue.meta_value] = modelo
      }
      let applianceLineCode = JSON.parse(this.currentTask.metaDados.find(meta => { return meta.meta_key == '__appliances' }).meta_value).applianceLineCode

      if (metaValueDownload && applianceLineCode) {
        download('?pullTracker[act]=whirpool_get_dados_by_modelo&modelo=' + modelo + '&applianceLineCode=' + applianceLineCode).then((result) => {
          getters.getOne('task_download', this.currentTask.id).then(data => {
            if (Object.keys(result.data.modelos.modelos).length > 0) {
              const config = {
                pullTracker: {
                  act: 'update_tarefa_meta'
                },
                tarefa: this.currentTask,
                meta: [{
                  meta_key: '__pre_resp',
                  meta_value: JSON.stringify(this.preResp)
                }, {
                  meta_key: '__blockDownload',
                  meta_value: 'true'
                }]
              }
              updateMetaTask(config).then((result) => { })
              Object.assign(data.jsonValue.modelos.modelos, result.data.modelos.modelos)
              data.idTarefa = parseInt(data.idTarefa)
              setters.setOne('task_download', data).then(() => {
                this.diagnosticTree()
                this.$bus.$emit('showSnackBar', {
                  message: this.$t('Montando a nova arvore'),
                  duration: 1000
                })
              })
            } else {
              this.$bus.$emit('showSnackBar', {
                message: this.$t('Nenhum modelo encontrado!'),
                duration: 1000
              })
              this.searching = false
            }
          })
        })
      }
    },
    save () {
      // this.$el.querySelector('#partsSelectionDialog').close()

      this.dialog.opened = false

      let metaValue = Object.values(this.fieldMetadados).find(metaDado => metaDado.meta_key == 'defaultPreresp')
      let modelo = this.modelo
      if (metaValue) {
        this.preResp[metaValue.meta_value] = modelo
        this.$emit('updatePreResp', { key: metaValue.meta_value, modelo })
      }
      this.$emit('input', JSON.stringify(this.currentValue), this.id)

      try {
        this.$root.dialogOpen = false
        if (this.$parent.$parent.$parent.$parent.$options.name != 'InputForm') {
          this.$root.cardContent = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    updateValue (value) {
      try {
        if (this.currentValue == null) {
          this.currentValue = []
        }
        let pecaindex = this.currentValue.findIndex(peca => {
          return peca.peca.codigo == value.peca.codigo &&
                  peca.ocorrencia.codigo == value.ocorrencia.codigo &&
                  peca.fctao.codigo == value.fctao.codigo
        })
        if (pecaindex != -1) {
          this.currentValue[pecaindex].quantidade += 1
        } else {
          this.currentValue.push(value)
        }
        this.$emit('input', JSON.stringify(this.currentValue), this.id)
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Peça adicionada com sucesso!'),
          duration: 1000
        })
        this.$root.dialogOpen = false
        // this.$el.querySelector('#partsSelectionDialog').close()
        this.dialog.opened = false
      } catch (error) {
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Erro ao adicionar peça'),
          duration: 1000
        })
      }
    },
    cancel () {
      // this.$el.querySelector('#partsSelectionDialog').close()
      this.dialog.opened = false
      try {
        this.$root.dialogOpen = false
        if (this.$parent.$parent.$parent.$parent.$options.name != 'InputForm') {
          this.$root.cardContent = false
        }
      } catch (error) {
        console.log(error)
      }
      this.$forceUpdate()
    },
    showPartsSelectionDialog () {
      this.$forceUpdate()
      try {
        // this.$el.querySelector('#partsSelectionDialog').showModal()
        this.dialog.opened = true
        this.$root.dialogOpen = true
        this.$root.cardContent = true
      } catch (error) {
        console.log(error)
      }
    },
    async diagnosticTree () {
      let _self = this
      if (typeof window.tree == 'undefined') {
        window.tree = { }
      }
      if (_self.currentTask && _self.currentTask.id != _self.currentTask.uuid) {
        getters.getOne('task_download', this.currentTask.id).then(data => {
          window.tree[this.id] = data.jsonValue
          if (_self.preResp.catalago_disponivel == 'false') {
            if (_self.preResp.sku == data.jsonValue.catalogo.sku && Object.keys(data.jsonValue.catalogo.pecas).length) {
              _self.$emit('updatePreResp', { key: 'catalago_disponivel', value: 'true' })
              _self.$emit('updateForm')
            }
          }
          if (_self.mascara) {
            _self.jsonPath = _self.mascara.split('.')
          } else {
            _self.jsonPath = [
              'modelos',
              'material',
              'pecas',
              'ocorrencia',
              'fcta'
            ]
          }
          _self.tab = _self.jsonPath[0]
          this.searching = false
        }).catch(({ data }) => {
          setTimeout(() => {
            _self.diagnosticTree()
          }, 1000)
        })
      } else {
        return false
      }
    },
    corrigeTituloPagina (titulo) {
      switch (titulo) {
        case 'pecas':
          return 'peças'

        default:
          return titulo
      }
    }
  },

  beforeDestroy: function () {
    window.tree[this.id] = null
    if (this.$refs) {
      if (this.$refs.recursiveAccordion) {
        this.$refs.recursiveAccordion.forEach(element => {
          try {
            element.$forceUpdate()
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
      if (this.$refs.partsSelectionDialog) {
        this.$refs.partsSelectionDialog.$destroy()
        this.$refs.partsSelectionDialog = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .mdl-dialog.full {
    //padding: 0;
    //position: fixed;
    .mdl-layout__content {
      display: flex;
      flex-direction: column;
      .page-content {
             -ms-flex-preferred-size: 0;
      flex-basis: 0;
      -webkit-box-flex: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;
      }
    }
  }
  .mdl-card.firstNivel {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-top: 0;
    margin-top: 8px;
    //width: 90vw;
  }
  .mdl-dialog .actions {
    right: 7px;
    bottom: 21px;
    position: fixed;
    z-index: 9999;
  }
  .mdl-textfield.jsonValueInput .mdl-textfield__label
   {
    color: rgb(255,87,34);
    font-size: 12px;
    top: 4px;
    visibility: visible;
  }
</style>
