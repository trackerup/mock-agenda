<template>
  <div>
    <div v-if="!readOnly">
      <div class="section section-form">
        <button class="mdl-button mdl-button--raised bgGray button-input"
                @click="newSubAwnser()" v-html="texto">
          <i class="material-icons">insert_chart_outlined</i>{{ $t('Responder formulário adicional') }}<span v-show="obrigatorio">*</span>
        </button>
        <ul class="fieldList">
          <li v-for="item in currentValue" :key="item.id" >
            <button class="mdl-button mdl-button--icon button-cancelar" @click="deleteSubAwnser(item)">
              <i class="material-icons">close</i>
            </button>
            <span @click="editSubAwnser(item)">
            {{ responseLabel(item) }}
            </span>
            <button class="mdl-button mdl-button--icon button-edit" @click="editSubAwnser(item)">
              <i class="material-icons">arrow_right</i>
            </button>
          </li>
        </ul>

        <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

        <dialog class="mdl-dialog full" id="dialogForm">
          <div class="mdl-dialog__content">
            <h5 v-html="texto" class=""></h5>
            <Form
              v-on:save="saveSubForm"
              v-on:cancel="cancel"
              ref="subForm"
              :value="currentEdit"
              :idForm="idForm"
              v-if="dialog.opened"
            />
          </div>
        </dialog>

        <dialog class="mdl-dialog full" id="dialogFormDelete">
          <div class="mdl-dialog__content">
            <h5>{{ $t('Realmente deseja excluir a resposta?') }}</h5>
            {{ responseLabel(currentEdit) }}
            <div class="mdl-dialog__actions">
              <button type="button" class="mdl-button orange" @click="confirmDeleteSubAwnser()">{{ $t('OK') }}</button>
              <button type="button" class="mdl-button close grey" @click="closeDeleteSubAwnser()">{{ $t('Cancelar') }}</button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
    <div v-else class="readOnly" >
      <label><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        <div class="box-subrespostas">
          <ul>
            <li v-for="item in currentValue" :key="item.id" >
              <Form
                ref="subForm"
                :value="item"
                :idForm="idForm"
                :backDisabled="true"
                :title="texto"
                :readOnly="readOnly"
                typeForm="wizardconfirm"
                :readonlyState="true"
                v-if="dialog.opened"
              />
            </li>
          </ul>
        </div>
      </span>
    </div>
  </div>
</template>
<script>
import TRInputBase from './InputBase'
import Form from '@/components/form/Form'
import { jsonValueToString } from '@/utils/'
import formsEntity from '@/plugins/persistence/entities/forms'

export default {
  name: 'InputForm',
  extends: TRInputBase,
  components: {
    Form
  },
  props: {
    idForm: {
      type: String,
      required: true
    }
  },
  data: () => ({
    dialog: {
      opened: true
    },
    currentValue: [],
    currentEdit: null,
    form: null,
    field: null,
    formLoaded: null
  }),
  beforeCreate: function () {
    this.$options.components.Form = require('@/components/form/Form.vue').default
  },
  mounted: function () {
    this.dialog.opened = true
    this.loadValues()
    this.$dialogPolyfill.doDialog('dialogForm')
    this.$dialogPolyfill.doDialog('dialogFormDelete')
  },
  methods: {
    async loadValues () {
      this.formLoaded = await formsEntity.getOneFormById(this.idForm)
      if (this.value != [] && this.value == '[]') {
        this.currentValue = JSON.parse(this.value)
      } else {
        this.currentValue = this.value
      }
    },
    saveSubForm (values) {
      if (this.currentEdit == null) {
        if (typeof this.currentValue == 'undefined' || this.currentValue == null) {
          this.currentValue = []
        }
        this.currentValue.push(values)
      }
      this.$emit('input', this.currentValue, this.id)
      this.$emit('change', this.id)
      this.$forceUpdate()
      this.currentEdit = null
      try {
        this.$root.cardContent = false
      } catch (error) {
        console.log(error)
      }
      this.close()
    },
    cancel () {
      try {
        this.$root.cardContent = false
      } catch (error) {
        console.log(error)
      }
      this.close()
    },
    open () {
      this.$el.querySelector('#dialogForm').showModal()
      try {
        this.$root.cardContent = true
      } catch (error) {
        console.log(error)
      }
    },
    newSubAwnser () {
      this.currentEdit = null
      this.$refs.subForm.clear()
      this.open()
      this.$forceUpdate()
    },
    editSubAwnser (item) {
      this.currentEdit = item
      this.open()
      this.$forceUpdate()
    },
    deleteSubAwnser (item) {
      this.currentEdit = item
      this.$el.querySelector('#dialogFormDelete').showModal()
    },
    confirmDeleteSubAwnser () {
      let _self = this
      this._.remove(this.value, function (currentObject) {
        return _self.currentEdit == currentObject
      })
      this.$emit('input', this.value, this.id)
      this.$emit('change', this.id)
      this.currentEdit = null
      this.closeDeleteSubAwnser()
    },
    closeDeleteSubAwnser (item) {
      this.currentEdit = null
      this.$forceUpdate()
      this.$el.querySelector('#dialogFormDelete').close()
    },
    close () {
      this.$el.querySelector('#dialogForm').close()
    },
    responseLabel (item) {
      if (!item) {
        return ''
      }
      if (this.formLoaded && this.formLoaded.metaDados) {
        let fieldValue = ''
        let fieldMask = ''
        if (!this.form || !this.field) {
          this.form = this.formLoaded
          let metaDados = this.formLoaded.metaDados
          for (let idx = 0; idx < metaDados.length && !this.field; idx++) {
            let metaDado = metaDados[idx]
            if (metaDado.meta_key == 'ancora') {
              let ancora = metaDado.meta_value
              let fields = this.formLoaded.perguntas
              for (let idxField = 0; idxField < fields.length && !this.field; idxField++) {
                let field = fields[idxField]
                let metaDadosField = field.metaDados
                for (let idxMetaField = 0; idxMetaField < metaDadosField.length && !this.field; idxMetaField++) {
                  let metaDadoField = metaDadosField[idxMetaField]
                  if (metaDadoField.meta_key == 'ancora' && metaDadoField.meta_value == ancora) {
                    this.field = field
                  }
                }
              }
            }
          }
        }
        if (this.field) {
          if (typeof item.responses[this.field.id] !== 'undefined') {
            fieldValue = item.responses[this.field.id].valor
            fieldMask = this.field.mascara
            return jsonValueToString(fieldValue, fieldMask)
          }
        }
      }
      return this.$t('Respondido em') + ' ' + this.$options.filters.formatDateTime(item.data)
    }
  },
  beforeDestroy: function () {
    this.dialog.opened = false
    if (this.$refs) {
      if (this.$refs.subForm) {
        if (typeof this.$refs.subForm === 'function') {
          this.$refs.subForm.$destroy()
        }
        this.$refs.subForm = null
      }
    }
  }
}
</script>
