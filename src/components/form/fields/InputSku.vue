<template>
  <div>
    <div v-if="!readOnly">
      <InputBarcode
          v-on:input="onInput"
          :texto="texto"
          :id="id + '_sku'"
          v-bind:value="currentValue.sku"
          v-on:change="validar"
          maxLength="10"
          :obrigatorio="obrigatorio"/>
      <span class="mdl-error" v-for="(item, index) in thisErrors.sku" :key="'sku'+index" :id="'sku'+index" v-html="item"></span>
      <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-with-icon" :class="[{'is-dirty': value != ''}]">
        <input class="mdl-textfield__input"
              v-on:input="onInput"
              :id="id + '_eng'"
              :value="currentValue.eng"
              v-on:change="validar"/>
        <label class="mdl-textfield__label" :for="id + '_eng'" ><span v-html="$t('Versão Engenharia')"></span> <span v-show="obrigatorio">*</span></label>
      </div>
      <span class="mdl-error" v-for="(item, index) in thisErrors.eng" :key="'eng'+index" :id="'eng'+index" v-html="item"></span>
      <InputBarcode
          v-on:input="onInput"
          :texto="'Serie'"
          :id="id + '_serie'"
          v-on:change="validar"
          :value="currentValue.serie"
          maxLength="9"
          :obrigatorio="obrigatorio" />
      <span class="mdl-error" v-for="(item, index) in thisErrors.serie" :key="'serie'+index" :id="'serie'+index" v-html="item"></span>
      <div v-if="!catalogoDisponivel" v-mdl class="mdl-card" :class="[{'is-dirty': value != ''}]">
        <center>{{ $t('Catalogo indisponível')}}</center>
        <button type="button"  class="mdl-button orange full-width" @click="pesquisarModelo(currentValue.sku)">
            {{ $t('Buscar catalogo') }}
        </button>
      </div>
    </div>
    <div v-else class="readOnly">
      <label class="orange" v-html="texto"> <span v-show="obrigatorio">*</span></label>
      <span class="value" >
        {{ currentValue.sku }}
      </span>
      <label class="orange" v-html="'Versão'"> <span v-show="obrigatorio">*</span></label>
      <span class="value" >
        {{ currentValue.eng }}
      </span>
      <label class="orange" v-html="'Serie'"> <span v-show="obrigatorio">*</span></label>
      <span class="value" >
        {{ currentValue.serie }}
      </span>
    </div>
    <span class="mdl-error" v-for="(item, index) in errors.eng" :key="index" v-html="item"></span>

    <dialog v-mdl class="mdl-dialog" id="dialogTentarNovamente">
      <h6 class="mdl-dialog__title">{{ $t('Falha ao buscar catálogo') }}</h6>
      <div class="mdl-dialog__content">
        <p>
          {{$t('Deseja tentar novamente')}}
        </p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button orange" @click="pesquisarModelo(currentValue.sku)">
          {{ $t('Tentar novamente') }}
        </button>
        <button type="button" class="mdl-button grey close" @click="closeDialogRetry">
          {{ $t('Cancelar') }}
        </button>
      </div>
    </dialog>
    <dialog v-mdl class="mdl-dialog" id="dialogLoaderCatalog">
      <h6 class="mdl-dialog__title">{{ $t('Carregando catálogo') }}</h6>
      <div class="mdl-dialog__content">
        <div class="tiny-loader"></div>
        <p>{{$t('Aguarde')}}</p>
      </div>
    </dialog>
  </div>
</template>
<script>
import { mask } from 'vue-the-mask'
import TRInputBase from './InputBase.vue'
import {Money} from 'v-money'
import { mapGetters } from 'vuex'
import InputBarcode from './barcode/InputBarcode.vue'
import { getters, setters } from '@/plugins/persistence/services/'
import { download, updateMetaTask } from '@/services/tasks'

export default {
  name: 'InputSku',
  components: {
    Money,
    InputBarcode
  },
  directives: {mask},
  extends: TRInputBase,
  data () {
    return {
      currentValue: {
        sku: '',
        eng: '',
        serie: ''
      },
      thisErrors: {
        sku: [],
        serie: [],
        eng: []
      }
    }
  },
  computed: {
    ...mapGetters({
      defaultPreResp: 'task/defaultPreResp'
    }),
    catalogoDisponivel () {
      return this.preResp.catalago_disponivel == 'true'
    },
    preResp () {
      return this.defaultPreResp ? this.defaultPreResp : JSON.parse(Object.values(this.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
    }
  },
  props: {
    fieldMetadados: {},
    currentTask: '',
    maxInputSku: '',
    maxInputEng: '',
    maxInputSerie: ''
  },
  watch: {
    value (val) {
      if (typeof val == 'string') {
        this.currentValue = JSON.parse(val)
      } else if (this.value) {
        this.currentValue = val
      }
    },
    errors (val) {
      if (!this.currentValue.sku) {
        this.thisErrors.sku = val
      }
      if (!this.currentValue.serie) {
        this.thisErrors.serie = val
      }
      if (!this.currentValue.eng) {
        this.thisErrors.eng = val
      }
      // this.validar()
    }
  },
  mounted () {
    // if (this.value && typeof this.value == 'string' && this.value != '') {
    //     this.currentValue = JSON.parse(this.preResp.sku)
    // }
    this.$dialogPolyfill.doDialog('dialogLoaderCatalog')

    if (this.value != undefined) {
      if (typeof this.value == 'string') {
        this.currentValue = JSON.parse(this.value)
      } else {
        this.currentValue = this.value
      }
    } else {
      this.currentValue.sku = this.preResp.sku
      this.currentValue.eng = this.preResp.versao
      if (this.preResp && this.preResp.versao) {
        if (this.preResp.versao.length > this.maxInputEng) {
          this.currentValue.eng = this.preResp.versao.substr(this.preResp.versao.length - this.maxInputEng)
        }
        if (this.preResp.versao.length < this.maxInputEng) {
          this.currentValue.eng = '0' + this.preResp.versao
        }
      }
      this.currentValue.serie = this.preResp.serie
    }
    this.validar()
    if (!this.$store.getters['task/defaultPreResp'] || !this.$store.getters['task/defaultPreResp'].catalago_disponivel) {
      this.pesquisarModelo(this.currentValue.sku)
    }
  },
  methods: {
    isValid: function () {
      this.errors = []
      this.hasErrors = false
      let confirm = false

      if (this.currentValue.sku && this.currentValue.sku.length == this.maxInputSku &&
          this.currentValue.eng && this.currentValue.eng.length == this.maxInputEng &&
          this.currentValue.serie && this.currentValue.serie.length <= this.maxInputSerie) {
        confirm = true
      }

      if (this.obrigatorio == '1' && !confirm) {
        this.errors.push(this.$t('Este field é obrigatório'))
        this.hasErrors = true
        return false
      }
      return true
    },
    setMask: (self) => {
      return new Promise((resolve) => {
        if (!self.mask) {
          resolve(false)
        }
        self.mask.vmask = null
        if (!self.mask.campo) {
          self.mask = {
            matriz: self.mask.lista,
            campo: self.mask.mascara,
            tipo: 'texto',
            grupo: '1',
            mascara: 'texto'
          }
        }
        resolve('text')
      })
    },
    getTextMask: (that, mask) => {
      let self = that
      return new Promise((resolve, reject) => {
        self.mask.vmask = ''
        if (self.mask.vmask != '') {
          self.showMasks = true
        }
        resolve(true)
      })
    },
    getTextFromBarcode () {
      this.$root.getTextFromBarcode().then((result) => {
        this.$emit('input', result, this.id)
      }).catch((error) => {
        this.$bus.$emit('showSnackBar', {
          message: this.$t(error.msg),
          duration: 2000
        })
      })
    },
    onInput (e) {
      if (e.target.origin == 'barcode' && e.target.id.substr(-4) == '_sku') {
        var regex = RegExp('^\\*?(\\w{10})(\\w{2})$')
        let teste = regex.test(e.target.value)
        if (teste) {
          let matches = regex.exec(e.target.value)
          this.currentValue.sku = matches[1]
          this.currentValue.eng = matches[2]
        } else {
          this.$bus.$emit('showSnackBar', {
            message: this.$t('Etiqueta fora do padrão! Por favor digite as informações.'),
            duration: 5000
          })
        }
      } else if (e.target.id.substr(-4) == '_sku') {
        this.currentValue.sku = e.target.value.substr(0, this.maxInputSku)
      } else if (e.target.id.substr(-4) == '_eng') {
        this.currentValue.eng = e.target.value.substr(0, this.maxInputEng)
      } else if (e.target.id.substr(-6) == '_serie') {
        this.currentValue.serie = e.target.value.substr(0, this.maxInputSerie)
      }
      this.validar(e)
    },
    validar (e) {
      this.thisErrors = {
        sku: [],
        serie: [],
        eng: []
      }
      this.hasErrors = false
      let msgs = [
        'Este campo é obrigatório',
        'Etiqueta fora do padrão! Este campo deve conter exatamente ' + this.maxInputSku + ' caracteres',
        'Etiqueta fora do padrão! Este campo deve conter exatamente ' + this.maxInputEng + ' caracteres',
        'Este campo deve conter no máximo ' + this.maxInputSerie + ' caracteres'
      ]
      if (!this.currentValue || this.currentValue.sku == '' || this.currentValue.sku == null) {
        this.thisErrors.sku.push(this.$t(msgs[0]))
        this.hasErrors = true
      }
      if (!this.currentValue || this.currentValue.eng == '' || this.currentValue.eng == null) {
        this.thisErrors.eng.push(this.$t(msgs[0]))
        this.hasErrors = true
      }
      if (!this.currentValue || this.currentValue.serie == '' || this.currentValue.serie == null) {
        this.thisErrors.serie.push(this.$t(msgs[0]))
        this.hasErrors = true
      }
      if (this.currentValue && this.currentValue.sku != undefined && this.maxInputSku &&
          this.currentValue.sku.length != this.maxInputSku &&
          this.currentValue.sku.length != '') {
        this.thisErrors.sku.push(this.$t(msgs[1]))
        this.hasErrors = true
      }
      if (this.currentValue && this.currentValue.eng != undefined && this.maxInputEng &&
          this.currentValue.eng.length != this.maxInputEng &&
          this.currentValue.eng.length != '') {
        this.thisErrors.eng.push(this.$t(msgs[2]))
        this.hasErrors = true
      }
      if (this.currentValue && this.currentValue.serie != undefined && this.maxInputSerie &&
          this.currentValue.serie.length > this.maxInputSerie &&
          this.currentValue.serie.length != '') {
        this.thisErrors.serie.push(this.$t(msgs[3]))
        this.hasErrors = true
      }

      if (this.currentValue.sku && this.currentValue.sku.length == this.maxInputSku &&
        this.currentValue.eng && this.currentValue.eng.length == this.maxInputEng &&
        this.currentValue.serie && this.currentValue.serie.length <= this.maxInputSerie) {
        const _defaultPreResp = this.$store.getters['task/defaultPreResp']
        if (!_defaultPreResp ||
          !_defaultPreResp.catalago_disponivel ||
          _defaultPreResp.sku.toUpperCase() != this.currentValue.sku.toUpperCase()
        ) {
          this.pesquisarModelo(this.currentValue.sku)
        }
        if (this.hasErrors) {
          return false
        }
        this.$emit('updatePreResp', { key: 'sku', value: this.currentValue.sku })
        this.$emit('updatePreResp', { key: 'versao', value: this.currentValue.eng })
        this.$emit('updatePreResp', { key: 'serie', value: this.currentValue.serie })
        this.$emit('input', JSON.stringify(this.currentValue), this.id)
      } else {
        this.$emit('input', null, this.id)
      }
    },
    pesquisarModelo (modelo) {
      let _self = this
      _self.modelo = modelo
      _self.searching = true
      _self.$bus.$emit('showSnackBar', {
        message: _self.$t('Aguarde...'),
        duration: 1000
      })

      if (_self.dialogIsOpen('dialogTentarNovamente')) {
        _self.closeDialog('dialogTentarNovamente')
      }

      let metaValue = _self.fieldMetadados
      if (metaValue) {
        _self.$emit('updatePreResp', { key: 'sku', value: modelo })
      }
      let applianceLineCode = JSON.parse(_self.currentTask.metaDados.find(meta => { return meta.meta_key == '__appliances' }).meta_value).applianceLineCode

      // se não conseguir atualizar, atualizar uma preresp (catch) (catalago_disponivel=0)
      getters.getOne('task_download', _self.currentTask.id).then(data => {
        if (data && data.jsonValue && data.jsonValue.catalogo && data.jsonValue.catalogo.pecas && Object.keys(data.jsonValue.catalogo.pecas).length > 0 && data.jsonValue.catalogo.sku == modelo) {
          _self.closeDialog('dialogLoaderCatalog')
          _self.$emit('updatePreResp', { key: 'catalago_disponivel', value: 'true' })
          _self.$bus.$emit('showSnackBar', {
            message: _self.$t('Catalogo encontrado!'),
            duration: 3000
          })
        } else {
          _self.openDialog('dialogLoaderCatalog')
          download('?pullTracker[act]=whirpool_get_dados_by_modelo&modelo=' + modelo + '&applianceLineCode=' + applianceLineCode)
            .then((result) => {
              if ('catalogo' in result.data && Object.keys(result.data.catalogo.pecas).length > 0) {
                const config = {
                  pullTracker: {
                    act: 'update_tarefa_meta'
                  },
                  tarefa: _self.currentTask,
                  meta: [{
                    meta_key: '__pre_resp',
                    meta_value: JSON.stringify(_self.preResp)
                  }, {
                    meta_key: '__blockDownload',
                    meta_value: 'true'
                  }]
                }
                updateMetaTask(config).then((result) => { })
                Object.assign(data.jsonValue.catalogo, result.data.catalogo)
                Object.assign(data.jsonValue.defeitos, result.data.defeitos)
                setters.setOne('task_download', data).then(() => { })
                _self.closeDialog('dialogLoaderCatalog')
                _self.$emit('updatePreResp', { key: 'catalago_disponivel', value: 'true' })
              } else {
                _self.closeDialog('dialogLoaderCatalog')
                _self.openDialog('dialogTentarNovamente')
                _self.$bus.$emit('showSnackBar', {
                  message: _self.$t('Nenhum modelo encontrado!'),
                  duration: 3000
                })
              }
            })
            .catch((err) => {
              console.log(err)
              _self.$bus.$emit('showSnackBar', {
                message: _self.$t('Catalogo indisponível! Sem conexão.'),
                duration: 3000
              })
              _self.closeDialog('dialogLoaderCatalog')
              _self.openDialog('dialogTentarNovamente')
            })
        }
      })
    },
    openDialog (dialog) {
      if (this.$el.querySelector('#' + dialog).open) {
        this.$el.querySelector('#' + dialog).close()
        this.$el.querySelector('#' + dialog).showModal()
      } else {
        this.$el.querySelector('#' + dialog).showModal()
      }
    },
    closeDialog (dialog) {
      this.$el.querySelector('#' + dialog).close()
    },
    dialogIsOpen (dialog) {
      return this.$el.querySelector('#' + dialog).open
    },
    closeDialogRetry () {
      this.closeDialog('dialogTentarNovamente')
      this.$emit('updatePreResp', { key: 'catalago_disponivel', value: 'false' })
    }
  }
}
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
