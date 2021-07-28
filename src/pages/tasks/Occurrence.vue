<template>
  <div class="page-occurrence">
    <div class="mdl-app-content">
      <h6>Escolha qual Formulario melhor atende a sua Ocorrência</h6>

      <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label textfield-with-icon" :class="[{'is-dirty': value != ''}]">
        <input class="mdl-textfield__input"
              v-on:input="onInput"
              type="text"
              v-model="value"
              id="pesquisar">
        <label class="mdl-textfield__label" for="pesquisar" ><span>Pesquisar</span></label>
        <i class="material-icons mdl-textfield__label__icon reorder clearicon" v-show="value != ''" @click="clear">close</i>
        <i class="material-icons mdl-textfield__label__icon reorder" v-show="value == ''">search</i>
      </div>

      <div class="accordeon">
        <template v-for="(category, index) in formsCategory">
          <div class="painel" :class="[category.ativo ? 'painel--ativo' : '']"  v-if="category.forms && category.forms.length"  :key="index">
            <div class="painel__title" @click="openFormsAccordeon(category)">
              <span>{{category.nome}}</span>
              <i class="material-icons" v-if="category.ativo">
                keyboard_arrow_up
              </i>
              <i class="material-icons" v-else>
                keyboard_arrow_down
              </i>
            </div>
              <div class="painel__content" v-show="category.ativo">
                <ul class="painel__list mdl-list">
                  <li class="mdl-list__item" v-for="(form, index) in category.forms" :key="index" @click="setFormOccurence(form)">
                    <span class="mdl-list__item-primary-content">
                      {{form.titulo}}
                    </span>
                  </li>
                </ul>
              </div>
          </div>
         </template>
      </div>
    </div>
    <dialog class="mdl-dialog full" id="dialog-occurence" v-show="occurenceDialog.opened">
      <div class="mdl-dialog__content">
        <h5 class="mdl-dialog__title" v-if="form && form.titulo">{{ $t(form.titulo) }}</h5>
        <div class="inResponse">
            <Form
              v-if="form"
              :idForm="form.id"
              :typeForm="'simple'"
              v-on:save="saveResponseOccurence"
              v-on:cancel="cancelResponseOccurence"
              v-on:input="updateForm"
              :value="formValues"
              ref="occurrenceForm"
            />
        </div>
      </div>
    </dialog>
  </div>
</template>

<script>

import formsEntity from '@/plugins/persistence/entities/forms'
import formsCategoryEntity from '@/plugins/persistence/entities/formsCategory'
import { newOccurrence, deleteTaskById } from '../../plugins/persistence/entities/tarefa'
import Form from '@/components/form/Form'
import { mapGetters } from 'vuex'

export default {
  name: 'Occurrence',
  components: {
    Form
  },
  data () {
    return {
      forms: [],
      formsCategory: [],
      formsCategoryMeta: [],
      value: '',
      occurenceDialog: {
        opened: false
      },
      form: false,
      task: null,
      currentResponse: null,
      formValues: null
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      coords: 'user/coords',
      user: 'user/user'
    })
  },
  async beforeMount () {
    await this.getForms()
    await this.getFormsCategory()
  },
  mounted () {
    const _self = this
    this.$emit('changeParams', {
      pageTitle: (this.$t('Ocorrência')),
      mapMenu: false,
      backMenu: true
    })
    if (window.localStorage.getItem('__current_form_occurrence')) {
      // restaura a ocorrencia
      const _idForm = window.localStorage.getItem('__current_form_occurrence')
      this.getForms().then(forms => {
        _self.form = Object.values(forms).find(form => { return form.id == _idForm })
        _self.formValues = JSON.parse(window.localStorage.getItem('__current_response_occurrence'))
        _self.occurenceDialog.opened = true
      })
    }
  },
  watch: {
    currentRoute (current) {
      this.checkRoute(current)
    },
    occurenceDialog: {
      handler: function (val) {
        if (val.opened) {
          this.$el.querySelector('#dialog-occurence').showModal()
        } else {
          this.$el.querySelector('#dialog-occurence').close()
        }
      },
      deep: true
    }
  },
  methods: {
    getForms () {
      const _self = this
      return new Promise(async (resolve, reject) => {
        formsEntity.getAllForms().then(forms => {
          _self.forms = forms
          resolve(_self.forms)
        })
      })
    },
    async getFormsCategory () {
      this.formsCategory = []
      try {
        // let taskForms = JSON.parse(this.task.forms)
        this.formsCategory = await formsCategoryEntity.getAllFormsCategory()
        this.formsCategoryMeta = await formsCategoryEntity.getAllFormsMetaCategory()
        this.processaForms()
      } catch (err) {
        console.log(err)
      }
    },
    processaForms () {
      let _self = this
      this.formsCategory.map((category) => {
        category.ativo = false
        category.forms = []
        category.forms = _self.forms.filter((form) => {
          return _self.formsCategoryMeta.filter((meta) => {
            if (meta.idCategoria == category.id && meta.idFormulario == form.id) {
              if (_self.value != '') {
                if (form.titulo.toLowerCase().indexOf(_self.value.toLowerCase()) == 0) {
                  return true
                }
              } else {
                return true
              }
              return false
            }
            return false
          }).length
          // return option.titulo.indexOf(this.value) > -1
        })
      })
      let formsSemCategory = this.forms.filter((form) => {
        if (_self.value != '') {
          if (form.titulo.toLowerCase().indexOf(_self.value.toLowerCase()) >= 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
        // return option.titulo.indexOf(this.value) > -1
      })
      if (formsSemCategory.length) {
        this.formsCategory.push(
          {
            'nome': 'Formulários',
            'forms': formsSemCategory
          }
        )
      }
      this.$forceUpdate()
    },
    openFormsAccordeon (selectCategory) {
      let status = selectCategory.ativo
      this.formsCategory.map((category) => {
        category.ativo = false
      })
      selectCategory.ativo = !status
      this.$forceUpdate()
      // window.componentHandler.upgradeDom()
    },
    onInput (e) {
      this.processaForms()
      this.$forceUpdate()
    },
    clear () {
      this.value = ''
      this.processaForms()
      this.$forceUpdate()
    },
    async setFormOccurence (form) {
      this.form = form
      window.localStorage.removeItem('__current_response_occurrence')
      window.localStorage.setItem('__current_form_occurrence', form.id)
      this.occurenceDialog.opened = true
    },
    updateForm (values) {
      window.localStorage.setItem('__current_response_occurrence', JSON.stringify(values))
    },
    async saveResponseOccurence (values) {
      newOccurrence(this.user, this.form, this.coords, values)
      window.localStorage.removeItem('__current_response_occurrence')
      this.$bus.$emit('showMessageEmitted', {
        msg: this.$t('Ocorrência salva com sucesso!')
      })
      this.formValues = null
      let _form = this.form
      this.form = null
      setTimeout(() => {
        this.form = _form
      }, 50)
    },
    clearOccurenceData () {
      this.form = null
      this.occurenceDialog.opened = false
      window.localStorage.removeItem('__current_response_occurrence')
      window.localStorage.removeItem('__current_form_occurrence')
    },
    cancelResponseOccurence () {
      this.clearOccurenceData()
      this.deleteTemporaryTask()
      this.$router.push('/tasks')
    },
    deleteTemporaryTask () {
      let thisTask = Object.assign({}, this.currentTask)
      deleteTaskById(thisTask.id)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('task/setCurrentTask', {task: null})
  }
}
</script>
<style lang="scss" scoped>
.mdl-app-content {
  height: auto;
  min-height:100%;
}
</style>
