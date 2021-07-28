<template>
  <div class="form-container" :class="[{'wizard-container': typeForm=='wizardstep'}, {'readonlystep': readOnly}]">
    <div class="fields-container">
      <DataMatrix
        v-bind:values="values"
        v-bind:form="form.perguntas"
        v-on:input="updatedValue"
        v-on:forceUpdate="updateForm"
        ref="DataMatrix"
      >
        <Conditional
          v-bind:values="values"
          v-bind:form="form.perguntas"
          v-on:input="updatedValue"
          v-on:forceUpdate="updateForm"
          ref="Conditional"
        >
          <div v-for="field in questions" :key="field.id" :class="{'readonlyfield': readOnly}">
            <div v-if="parseInt(field.formulario) == parseInt(form.id)">
              <div class="input-blocked" v-if="field.blocked">
                <label class="orange">
                  {{$t('Campo oculto para o/a técnico')}} TÉCNICO
                </label>
                <div class="input-pharse">
                  <i class="material-icons">lock</i>
                  {{$t('Essa Resposta não pode ser lida no app')}}
                </div>
              </div>
              <div v-else>
                <InputText
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'texto')"
                  v-show="doConditional(field)"
                  class="texto"
                />

                <InputSku
                  v-bind="field"
                  ref="input"
                  :currentTask="currentTask"
                  :fieldMetadados="field.metaDados"
                  :value="values.responses[field.id].valor"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:updatePreResp="updatePreResp"
                  v-on:input="updatedValue"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'sku')"
                  v-show="doConditional(field)"
                  :maxInputSku="'10'"
                  :maxInputEng="'3'"
                  :maxInputSerie="'9'"
                  class="texto"
                />

                <InputSum
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-bind:responses="values.responses"
                  v-bind:questions="questions"
                  v-if="parseFieldType(field , 'soma')"
                  v-show="doConditional(field)"
                  class="texto"
                />

                <InputTextarea
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'textoLongo')"
                  v-show="doConditional(field)"
                  class="textoLongo"
                />

                <InputSing
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'assinatura')"
                  v-show="doConditional(field)"
                  class="assinatura"
                />

                <InputForm
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  :idForm="field.lista"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'formulario')"
                  v-show="doConditional(field)"
                  class="section-form"
                />

                <InputPartsSelection
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  v-on:updateForm="updateForm"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :fieldMetadados="field.metaDados"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'parts_selection')"
                  v-show="doConditional(field)"
                  class="input-selecao-pecas"
                />

                <InputPreDefined
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  :id-tarefa="idTarefa"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'predefinido')"
                  v-show="doConditional(field)"
                  class="predefinido"
                />

                <InputImage
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'foto')"
                  v-show="doConditional(field)"
                  class="section-foto"
                />

                <InputImageList
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'fotoConjunto')"
                  v-show="doConditional(field)"
                  class="section-fotoConjunto"
                />
                <InputJsonValue
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :fieldMetadados="field.metaDados"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'json_value')"
                  v-show="doConditional(field)"
                  class="json_value"
                />

                <Separador
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :texto="field.texto"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'separador')"
                  v-show="doConditional(field)"
                />
                <Orientacao
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :texto="field.texto"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'orientacao')"
                  v-show="doConditional(field)"
                />
                <SimNao
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :texto="field.texto"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'simounao')"
                  v-show="doConditional(field)"
                />

                <InputStars
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :texto="field.texto"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || (values.responses[field.id].readonly == 'on')"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'stars')"
                  v-show="doConditional(field)"
                />

                <OkOuFoto
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  :field="field"
                  ref="input"
                  :texto="field.texto"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'Ok_ou_foto')"
                  v-show="doConditional(field)"
                />

                <InputAccordingSimple
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  :fieldMetadados="field.metaDados"
                  v-if="parseFieldType(field , 'conforme_naoConforme_naoSeAplica_simples')"
                  v-show="doConditional(field)"
                  class="input-according-simple"
                />

                <InputAccordingText
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'conforme_naoConforme_naoSeAplica_semFoto')"
                  v-show="doConditional(field)"
                  class="input-according-text"
                />

                <InputAccordingPhoto
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'conforme_naoConforme_naoSeAplica')"
                  v-show="doConditional(field)"
                  class="input-according-photo"
                />

                <InputTraficLight
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'semaforo')"
                  v-show="doConditional(field)"
                  class="input-trafic-light"
                />

                <InputList
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'lista')"
                  v-show="doConditional(field)"
                  class="lista"
                />

                <TarefaAutomatica
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'tarefaAutomatica')"
                  v-show="doConditional(field)"
                  class="lista"
                />

                <InputAutoComplete
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'validacao_lista')"
                  v-show="doConditional(field)"
                  class="input-autocomplete-list"
                />

                <InputSelectMultiBox
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'multiplaEscolha')"
                  v-show="doConditional(field)"
                  class="input-select-multi-box"
                />

                <InputConsumption
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-on:input="updatedValue"
                  :readOnly="readOnly || isReadOnly(field) || values.responses[field.id].readonly"
                  v-on:change="changedValue"
                  v-if="parseFieldType(field , 'consumo')"
                  v-show="doConditional(field)"
                  class="input-select-multi-box"
                />

                <InputHidden
                  v-bind="field"
                  v-on:updatePreResp="updatePreResp"
                  :metaDados="field.metaDados"
                  v-on:input="updatedValue"
                  :preResp="preResp"
                  ref="input"
                  :value="values.responses[field.id].valor"
                  v-if="parseFieldType(field , 'campo_oculto')"
                  v-show="doConditional(field)"
                />

              </div>
            </div>
          </div>
        </Conditional>
      </DataMatrix>
    </div>
    <div class="form-actions wizard" v-if="typeForm=='wizardstep'  && !readOnly">
      <button class="mdl-button " :disabled="backDisabled" @click="cancel"><i class="material-icons">arrow_left</i>{{$t('Anterior')}}
      </button>
      <button class="mdl-button " :disabled="disabledClick" @click="save">{{$t('Proximo')}}<i class="material-icons">arrow_right</i>
      </button>
    </div>

    <div class="form-actions wizardconfirm" v-if="typeForm=='wizardconfirm' && !readOnly">
      <button class="mdl-button  button-edit" @click="cancel"><i class="material-icons">close</i>{{$t('Alterar')}}
      </button>
      <button class="mdl-button  button-confirm " @click="save">{{$t('Aprovar')}}<i class="material-icons">check_circle_outline</i>
      </button>
    </div>

    <div class="form-actions simple" v-if="typeForm=='simple' && !readOnly && !$root.dialogOpen">
      <button class="mdl-button  grey" @click="cancel">{{$t('Cancelar')}}</button>
      <button class="mdl-button  orange" @click="save">{{$t('Salvar')}}</button>
    </div>

  </div>
</template>
<script>

import InputAccordingPhoto from './fields/InputAccordingPhoto'
import InputAccordingSimple from './fields/InputAccordingSimple'
import InputAccordingText from './fields/InputAccordingText'
import InputTraficLight from './fields/InputTraficLight'
import InputForm from './fields/InputForm'
import InputImage from './fields/InputImage'
import InputImageList from './fields/InputImageList'
import InputJsonValue from './fields/InputJsonValue'
import InputList from './fields/InputList'
import InputPreDefined from './fields/InputPreDefined'
import InputSelectMultiBox from './fields/InputSelectMultiBox'
import InputSing from './fields/InputSing'
import InputText from './fields/InputText'
import InputAutoComplete from './fields/InputAutoComplete'
import InputSku from './fields/InputSku'
import InputSum from './fields/InputSum'
import InputHidden from './fields/InputHidden'
import InputTextarea from './fields/InputTextarea'
import OkOuFoto from './fields/OkOuFoto'
import Orientacao from './fields/Orientacao'
import Separador from './fields/Separador'
import SimNao from './fields/SimNao'
import InputConsumption from './fields/InputConsumption'
import InputStars from './fields/InputStars'
import InputPartsSelection from './fields/InputPartsSelection'
import TarefaAutomatica from './fields/TarefaAutomatica'
import DataMatrix from './fields/dataMatrix/DataMatrix'
import Conditional from './fields/conditional/Conditional'
import formsEntity from '../../plugins/persistence/entities/forms'
import { mapGetters } from 'vuex'
import { jsonValueToString } from '@/utils/'
import { regeneratePreResp } from '@/services/tasks'
import uuidv4 from 'uuid/v4'
import _ from 'lodash'

export default {
  name: 'Form',
  components: {
    InputConsumption,
    InputSelectMultiBox,
    DataMatrix,
    Conditional,
    InputForm,
    InputList,
    InputSing,
    InputText,
    InputAutoComplete,
    InputSku,
    InputSum,
    InputTextarea,
    InputImage,
    InputHidden,
    InputImageList,
    InputJsonValue,
    InputPreDefined,
    Separador,
    Orientacao,
    SimNao,
    OkOuFoto,
    InputAccordingPhoto,
    InputAccordingText,
    InputAccordingSimple,
    InputTraficLight,
    InputStars,
    InputPartsSelection,
    TarefaAutomatica
  },
  props: {
    idForm: {
      // type: String,
      required: true
    },
    value: {
      // type: Object,
      required: false,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    typeForm: {
      type: String,
      required: false,
      default: 'simple'
    },
    backDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    readonlyState: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      values: {
        data: null,
        responses: {}
      },
      form: {
        titulo: '',
        perguntas: []
      },
      preResp: [],
      disabledClick: false,
      timeoutDisableClick: null
    }
  },
  async beforeMount () {
    await this.loadValues()
  },
  watch: {
    value (val) {
      if (val && val != null && val.data != null) {
        this.values = val
        this.populateResponses()
        this.$forceUpdate()
      } else {
        this.values = {
          idForm: this.idForm,
          idTarefa: this.idTarefa,
          data: new Date(),
          concluida: 1,
          uuid: uuidv4(),
          responses: {}
        }
      }
      DataMatrix.values = this.values
      DataMatrix.form = this.form
      Conditional.values = this.values
      Conditional.form = this.form
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      defaultPreResp: 'task/defaultPreResp'
    }),
    idTarefa () {
      return this.currentTask ? this.currentTask.id : null
    },
    questions () {
      return this.form ? _.orderBy(this.form.perguntas, function (obj) {
        return parseInt(obj.ordem, 10)
      }) : []
    }
  },
  methods: {
    async loadValues () {
      this.form = await formsEntity.getOneFormById(parseInt(this.idForm))
      if (!this.form) {
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Aguarde sincronização de formulários!'),
          duration: 4000
        })
        this.$bus.$emit('auth-user', true)
        setTimeout(this.loadValues, 3000)
        return
      }
      if (this.value == null) {
        this.values = {
          idForm: this.idForm,
          idTarefa: this.idTarefa,
          data: new Date(),
          uuid: uuidv4(),
          responses: {}
        }
      } else {
        this.values = this.value
      }
      this.populateResponses()
      DataMatrix.values = this.values
      DataMatrix.form = this.form
      Conditional.values = this.values
      Conditional.form = this.form
    },
    updatePreResp (values) {
      this.$emit('updatePreResp', values)
    },
    updatedValue (value, id) {
      const _self = this
      let question = Object.values(_self.form.perguntas).find(question => question.id == id)
      let ancora = Object.values(question.metaDados).find(metaDado => metaDado.meta_key == 'ancora')
      /**
       *task/PR-1743 - Incluir informação de um texto "De acordo";
       *Atualizando sempre os preResps das respostas quando alteradas
       */
      if (value && (typeof value != 'string' || value.indexOf('base64') < 0)) { // Não carrega imageno no preresp
        if (ancora) {
          // _self.preResp[ancora.meta_value] = value
          _self.$emit('updatePreResp', {key: ancora.meta_value, value: value})
          // _self.$store.dispatch('task/setCurrentTaskPreResp', {preResp: JSON.stringify(_self.preResp)})
        }
        let updateValuePreresp = Object.values(question.metaDados).find(metaDado => metaDado.meta_key == 'updateValuePreresp')
        if (updateValuePreresp && _self.preResp[updateValuePreresp.meta_value] != 'undefined') {
          // _self.preResp[updateValuePreresp.meta_value] = jsonValueToString(value, question.mascara)
          _self.$emit('updatePreResp', {key: updateValuePreresp.meta_value, value: jsonValueToString(value, question.mascara)})
          // _self.$store.dispatch('task/setCurrentTaskPreResp', {preResp: JSON.stringify(_self.preResp)})
        }
      }

      if (!_self.values.responses[id]) {
        _self.populateResponses()
      }
      _self.values.responses[id].valor = value
      _self.$forceUpdate()
      _self.$emit('input', _self.values)
      try {
        setTimeout(() => {
          if (_self.$refs && _self.$refs.input) {
            let element = _self.$refs.input && _self.$refs.input.find(element => element.id == id)
            if (element) {
              element.isValid()
            }
            let sumFields = _self.$refs.input.filter(element => element.tipo == 'soma')
            if (sumFields) {
              sumFields.forEach(element => {
                (element.updateSum(_self.$refs.input.find(element => element.id == id)))
              })
            }
          }
        }, 100)
      } catch (error) {
        console.log('Elementos já destruidos')
      }
    },
    changedValue (id) {
      this.$refs.DataMatrix.updatedValue(id)
      this.$refs.Conditional.updatedValue(id)
      setTimeout(() => {
        if (this.$refs) {
          if (this.$refs.input) {
            let element = this.$refs.input.find(element => element.id == id)
            if (element) {
              element.isValid()
            }
          }
        }
      }, 100)
    },
    updateForm () {
      this.$forceUpdate()
    },
    parseFieldType (field, tipo) {
      return this.$refs.DataMatrix.parseFieldType(field, tipo)
    },
    doConditional (field) {
      return this.$refs.Conditional.fieldCondition(field)
    },
    save () {
      if (this.disabledClick) return
      this.disableClick()
      let hasError = false
      let invalidValues = []
      this.$refs.input.forEach(element => {
        (element.getValue())
        if (!element.isValid()) {
          hasError = true
          invalidValues.push(element)
        }
      })
      if (!hasError) {
        this.$emit('save', this.values)
      } else {
        if (invalidValues.length > 0 && invalidValues[0].$el) {
          invalidValues[0].$el.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
        this.$bus.$emit('showSnackBar', {
          message: this.$t('Formulário não possui valores válidos!'),
          duration: 3000
        })
      }
    },
    getValues: function () {
      this.$refs.input.forEach(element => {
        (element.getValue())
      })
    },
    cancel: function () {
      this.$emit('cancel', this.values)
    },
    async clear () {
      if (this.value && this.value.data != null) {
        this.values = this.value
      } else {
        this.values = {
          data: null,
          responses: {}
        }
      }
      this.loadValues()
      this.populateResponses()
      this.$forceUpdate()
    },
    isReadOnly (question) {
      let readonlyValue = Object.values(question.metaDados).find(metaDado => metaDado.meta_key == 'readonly')
      if (readonlyValue) {
        return readonlyValue.meta_value == 'on'
      }
      return false
    },
    updateResponseByPreResp () {
      let _self = this
      _self.form.perguntas.forEach(question => {
        if (_self.isReadOnly(question)) {
          return
        }
        let ancora = Object.values(question.metaDados).find(metaDado => metaDado.meta_key == 'ancora')
        if (!ancora || !_self.preResp[ancora.meta_value]) {
          return
        }

        let questionValue = _self.preResp[ancora.meta_value]

        _self.values.responses[question.id].valor = questionValue
      })
      _self.$forceUpdate()
    },
    populateResponses () {
      let _self = this
      if (!this.form || !this.form.id || !this.values) {
        return this.loadValues()
      }
      if ((this.currentTask) && (this.idTarefa != this.currentTask.uuid)) {
        try {
          let osNumber = this.currentTask.metaDados.find(meta => meta.meta_key == '__OS')
          if (this.defaultPreResp && osNumber && osNumber.meta_value && this.defaultPreResp.OS != osNumber.meta_value) {
            this.preResp = JSON.parse(Object.values(_self.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
            this.updateResponseByPreResp()
          } else {
            if (this.defaultPreResp) {
              this.preResp = this.defaultPreResp
            } else {
              this.preResp = JSON.parse(Object.values(_self.currentTask.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
            }
          }
          if ((!this.preResp && this.preResp != '')) {
            throw new Error('oops')
          }
        } catch (e) {
          _self.$bus.$emit('showSnackBar', {
            message: _self.$t('OS ainda em sincronização!'),
            duration: 3000
          })
          regeneratePreResp(_self.currentTask.id).then((result) => {
            _self.$bus.$emit('tasks-sync', true)
            _self.$store.dispatch('task/setCurrentTaskPreResp', {preResp: JSON.stringify(result.data)})
            _self.populateResponses()
          })
          return
        }
      }
      for (let idxQuestion in this.form.perguntas) {
        let question = this.form.perguntas[idxQuestion]
        if (typeof this.values.responses == 'undefined' || typeof this.values.responses[question.id] == 'undefined') {
          switch (question.tipo) {
            case 'formulario':
              this.values.responses[question.id] = {
                valor: [],
                idPergunta: question.id,
                tipo: question.tipo
              }
              break
            case 'texto':
              if (!question.default && question.mascara == 'money') {
                question.default = '0'
              }
              /* falls through */
            default :
              let initialValue = typeof question.default != 'undefined' && question.default != '' ? question.default : null
              let ancora = Object.values(question.metaDados).find(metaDado => metaDado.meta_key == 'ancora')
              if (ancora && this.preResp[ancora.meta_value]) {
                initialValue = this.preResp[ancora.meta_value]
              }

              let readonlyValue = Object.values(question.metaDados).find(metaDado => metaDado.meta_key == 'readonly')
              if (readonlyValue) {
                question.readOnly = readonlyValue.meta_value == 'on'
              }

              if (typeof this.values.responses == 'undefined') {
                // if (this.values) {
                //   initialValue = this.values
                // }
                this.values = {
                  idForm: this.form.id,
                  idTarefa: this.currentTask.id,
                  data: new Date(),
                  uuid: uuidv4(),
                  responses: {}
                }
              }
              this.values.responses[question.id] = {
                valor: initialValue,
                idPergunta: question.id,
                tipo: question.tipo,
                readonly: question.readonly
              }
          }
        }
      }
      this.$forceUpdate()
    },
    disableClick () {
      if (this.timeoutDisableClick) return
      this.disabledClick = true
      this.timeoutDisableClick = setTimeout(() => {
        this.disabledClick = false
        this.timeoutDisableClick = null
      }, 2000)
    }
  },
  beforeDestroy: function () {
    if (this.$refs) {
      if (this.$refs.input) {
        this.$refs.input.forEach(element => {
          try {
            element.$destroy()
            element = null
          } catch (e) {
          }
        })
        this.$refs.input = null
      }
      if (this.$refs.DataMatrix) {
        this.$refs.DataMatrix.$destroy()
        this.$refs.DataMatrix = null
      }
      if (this.$refs.Conditional) {
        this.$refs.Conditional.$destroy()
        this.$refs.Conditional = null
      }
    }
    clearTimeout(this.timeoutDisableClick)
  },
  beforeCreate () {
    this.$options.components.InputForm = require('./fields/InputForm').default
  }
}
</script>
