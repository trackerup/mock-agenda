<template>
  <div>
    <div class="section" v-if="!readOnly">
      <div v-mdl class="mdl-textfield mdl-js-textfield jsonValueInput"  @click="showDialogJson" :class="[{'is-dirty': currentValue}]">
           <input v-if="!this.value" class="mdl-textfield__input" type="text" :value="labelValue" readOnly :id="id" />
           <textarea v-else class="mdl-textfield__input" type="text" :value="labelValue" readOnly :id="id" />
           <label mdl class="mdl-textfield__label" :for="id"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      </div>

      <dialog class="mdl-dialog full" id="dialogJson" ref="dialogJson" v-show="dialogOpened">
        <!-- Always shows a header, even in smaller screens. -->
          <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
            <header class="mdl-layout__header">
              <div class="mdl-layout__header-row">

                <div class="flex-start">
                  <button @click="cancel" class="mdl-button mld-button-icon-text button-back">
                    <i class="material-icons">keyboard_arrow_left</i>
                    {{ $t('Voltar') }}
                  </button>
                </div>

                <h5 class="pageTitle" v-html="texto"></h5>

                <div class="flex-end">
                  <button  @click="save" v-if="currentValue != null" class="mdl-button mld-button-icon-text mapa">
                    {{ $t('OK') }}
                  </button>
                </div>
              </div>
            </header>
            <main class="mdl-layout__content">
              <div class="page-content">

                <div v-mdl class="mdl-tabs mdl-js-tabs">
                  <div class="mdl-tabs__tab-bar">
                    <template v-for="(item,index) in getTree()" >
                    <span class="mdl-tabs__tab" @click="tab = index" :class="(tab == index ? 'is-active' : '')" :key="index" v-if="isTabPath(index)">{{$t(index)}}</span>
                    </template>
                  </div>
                  <div class="mdl-tabs__panel" :class="{'is-active': tab == index}" :id="index" v-for="(item,index) in getTree()" :key="index">
                    <span v-for="(item2,index2) in item" :key="index2">
                      <div v-if="isVisible(index2)" class="mdl-card firstNivel">
                          <RecursiveAccordion
                            :node="item2"
                            :index="index2"
                            :treePath="index"
                            :indexAbove="index"
                            :itemAbove="item"
                            :value="currentValue"
                            :jsonPath="jsonPath"
                            :searching="searching"
                            :metadados="fieldMetadados"
                            :preResp="preResp"
                            :question="id"
                            ref="recursiveAccordion"
                            v-on:input="updateValue"
                            v-on:pesquisarModelo="pesquisarModelo"
                            v-on:redownloadDefects="redownloadDefects"
                            />
                      </div>
                    </span>
                    <div v-if="item.length == 0" class="jsonValueNotFound">
                        {{ $t('Nenhum registro encontrado!')}}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
      </dialog>
      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
    </div>
    <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value" v-html="labelValue">
        {{ labelValue }}
      </span>
    </div>
</div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import RecursiveAccordion from './jsonValue/RecursiveAccordion.vue'
import InputSearch from './jsonValue/InputSearch.vue'
import { like, jsonValueToString } from '@/utils/'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
import { getters, setters } from '@/plugins/persistence/services/'
import { download, updateMetaTask } from '@/services/tasks'

export default {
  name: 'InputJsonValue',
  extends: TRInputBase,
  components: {
    RecursiveAccordion, InputSearch
  },
  data: () => ({
    dialogOpened: false,
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
      this.oldpreResp = JSON.parse(Object.values(this.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
    }
    this.$dialogPolyfill.doDialog('dialogJson')
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
      return this.defaultPreResp ? this.defaultPreResp : JSON.parse(Object.values(this.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
    },
    labelValue () {
      if (this.currentValue != null) {
        return jsonValueToString(this.value, this.mascara)
      } else {
        return ''
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
    }
  },
  watch: {
    value (val) {
      if (typeof val == 'string') {
        this.currentValue = JSON.parse(val)
      } else {
        this.currentValue = val
      }
    },
    dialogOpened (val) {
      let _self = this
      setTimeout(() => {
        try {
          if (val) {
            _self.$el.querySelector('#dialogJson').showModal()
          } else {
            _self.$el.querySelector('#dialogJson').close()
          }
        } catch (error) {
          if (!val) {
            _self.$el.querySelector('#dialogJson').close()
          }
        }
      }, 500)
    }
  },
  methods: {
    getTree () {
      if (typeof window.tree == 'undefined') {
        window.tree = { }
      }
      return window.tree[this.id]
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
      if (metaValue) {
        this.preResp[metaValue.meta_value] = modelo
      }
      let applianceLineCode = JSON.parse(this.currentTask.metaDados.find(meta => { return meta.meta_key == '__appliances' }).meta_value).applianceLineCode
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
    },
    save () {
      // this.$el.querySelector('#dialogJson').close()
      this.dialogOpened = false

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
      this.currentValue = value
      // this.$emit('input', JSON.stringify(this.currentValue), this.id)
    },
    cancel () {
      const config = {
        pullTracker: {
          act: 'update_tarefa_meta'
        },
        tarefa: this.currentTask,
        meta: [{
          meta_key: '__pre_resp',
          meta_value: JSON.stringify(this.oldpreResp)
        }]
      }
      updateMetaTask(config).then((result) => { })
      this.$store.dispatch('task/setCurrentTaskPreResp', {preResp: JSON.stringify(this.oldpreResp)})
      // this.$el.querySelector('#dialogJson').close()
      this.dialogOpened = false
      try {
        this.$root.dialogOpen = false
        if (this.$parent.$parent.$parent.$parent.$options.name != 'InputForm') {
          this.$root.cardContent = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    showDialogJson () {
      this.searching = false
      this.dialogOpened = true
      this.$forceUpdate()
      this.$el.querySelector('#dialogJson').showModal()
      try {
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
      return new Promise(async (resolve, reject) => {
        getters.getOne('task_download', _self.currentTask.id).then(data => {
          let fullTree = data.jsonValue
          if (!fullTree.defeitos || typeof fullTree.defeitos.itens == 'undefined' || Object.keys(fullTree.defeitos.itens).length == 0) {
            _self.redownloadDefects()
          }
          window.tree[_self.id] = {
            defeitos: fullTree.defeitos,
            modelos: {
              modelos: {}
            },
            pecas: fullTree.pecas
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
          let material = _self.indexPreresp
          if (_self.jsonPath[_self.jsonPath.length - 1] == 'fcta') {
            if (material) {
              for (let modelo in fullTree.modelos.modelos) {
                if (fullTree.modelos.modelos.hasOwnProperty(modelo)) {
                  if (material.indexOf(modelo) == 0) {
                    window.tree[_self.id].modelos.modelos[modelo] = fullTree.modelos.modelos[modelo]
                  }
                }
              }
            } else {
              window.tree[_self.id].modelos = fullTree.modelos
            }
          } else if (_self.jsonPath[_self.jsonPath.length - 1] == 'pecas') {
            if (material) {
              for (let modelo in fullTree.modelos.modelos) {
                if (fullTree.modelos.modelos.hasOwnProperty(modelo)) {
                  if (material.indexOf(modelo) == 0) {
                    window.tree[_self.id].modelos.modelos[modelo] = fullTree.modelos.modelos[modelo]
                  }
                }
              }
            } else {
              window.tree[_self.id].modelos = fullTree.modelos
            }
          } else if (_self.jsonPath[_self.jsonPath.length - 1] == 'material') {
            for (let modelo in fullTree.modelos.modelos) {
              if (fullTree.modelos.modelos.hasOwnProperty(modelo)) {
                for (let material in fullTree.modelos.modelos[modelo].material) {
                  if (fullTree.modelos.modelos[modelo].material.hasOwnProperty(material)) {
                    fullTree.modelos.modelos[modelo].material[material].pecas = null
                  }
                }
              }
            }
            window.tree[_self.id].modelos = fullTree.modelos
            fullTree = null
          }
          _self.tab = _self.jsonPath[0]
          _self.searching = false
          resolve()
        }).catch(({ data }) => {
          setTimeout(() => {
            _self.diagnosticTree()
          }, 1000)
        })
      })
    },
    isVisible (value) {
      return (this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', value.toUpperCase()))
    },
    isTabPath (tab) {
      try {
        return this.jsonPath[0] == tab
      } catch (error) {
        return true
      }
    },
    corrigeTituloPagina (titulo) {
      switch (titulo) {
        case 'pecas':
          return 'peças'

        default:
          return titulo
      }
    },
    async redownloadDefects () {
      let _self = this
      if (!_self.searching) {
        _self.searching = true
        return new Promise((resolve, reject) => {
          let blockDownload = _self.currentTask.metaDados.filter(element => { return element.meta_key == '__download' })[0]
          getters.getOne('task_download', _self.currentTask.id).then(async data => {
            download(blockDownload.meta_value).then(async (result) => {
              if (result.data && data) {
                data.jsonValue.defeitos = result.data.defeitos
                data.defeitos = result.data.defeitos
                if (data.defeitos && typeof data.defeitos.itens != 'undefined' && Object.keys(data.defeitos.itens).length > 0) {
                  setters.setOne('task_download', data).then(() => {
                    _self.diagnosticTree().then(() => {
                      resolve()
                      _self.searching = false
                    })
                  })
                } else {
                  _self.searching = false
                  resolve()
                }
              } else {
                _self.searching = false
                resolve()
              }
            })
          })
        })
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
      if (this.$refs.dialogJson) {
        this.$refs.dialogJson.remove()
        this.$refs.dialogJson = null
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
    color: var(--primaryColor);
    font-size: 12px;
    top: 4px;
    visibility: visible;
  }
</style>
