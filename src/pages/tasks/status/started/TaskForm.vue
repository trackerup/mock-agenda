<template>
    <div class="card-conteudo card-wizard col">
        <div class="card-content not-padding" id="card-content" :class="{'visible': this.$root.cardContent}">
            <div class="bottom-bar-padding">
                <task-description :task="currentTask" />
                <div class="mdl-card" :class="{'visible': this.$root.cardContent}" v-if="forms.length > 0">
                    <h6>{{$t('Formulários')}}</h6>
                    <div class="section section-form input-selecao-pecas" v-for="(form, index) in forms" :key="index" :model="form">
                        <button class="mdl-button mdl-button--raised bgGray button-input" :class="{'orange': getFormMandatory(form) && getResponsesCount(form) == 0}" @click="addResponseItem(form)" :disabled="!canEdit()">
                            <i class="material-icons" v-if="canEdit()">add</i>{{ form.titulo }} <span v-show="getFormMandatory(form)">*</span>
                        </button>
                        <ul v-mdl class="mdl-list">
                            <li class="mdl-list__item mdl-list__item" v-for="(response, indexForm) in getResponses(form)" :key="indexForm">
                                <span class="mdl-list__item-primary-content" @click="editResponseItem(form, response)">
                                    <span>{{response.data | formatDateTime}}</span>
                                </span>
                                <span class="mdl-list__item-secondary-content mdl-list__item-secondary-action">
                                    <a href="#" @click="editResponseItem(form, response)"><i class="material-icons orange" v-if="canEdit()">edit_circle</i></a>
                                    <a href="#" @click="removeResponseItem(form, response)"><i class="material-icons" v-if="canEdit()">remove_circle</i></a>
                                    <a href="#" @click="editResponseItem(form, response)"><i class="material-icons orange">search</i></a>
                                </span>
                            </li>
                            <li v-if="getResponsesCount(form) == 0" class="mdl-list__item mdl-list__item">
                                <span class="mdl-list__item-primary-content">
                                    <span>{{$t('Nenhuma resposta encontrada!')}}</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <dialog class="mdl-dialog modal-form full" id="formDialog" v-show="formDialog.opened">
                    <div class="mdl-dialog__content" :class="{'visible': this.$root.cardContent}">
                        <h5 class="mdl-dialog__title" v-if="form && form.titulo" :class="{'notinResponse': form && !inResponse}">{{ $t(form.titulo) }}</h5>
                        <div v-if="inResponse" class="inResponse">
                            <Form
                                :idForm="form.id"
                                :typeForm="'simple'"
                                v-on:save="saveResponseItem"
                                v-on:cancel="cancelResponseItem"
                                :value="currentResponse"
                                :readOnly="!canEdit()"
                            />
                            <div v-if="!canEdit()" class="form-actions simple">
                                <button class="mdl-button mdl-js-button grey" @click="cancelResponseItem">{{$t('Voltar')}}</button>
                            </div>
                        </div>
                    </div>
                </dialog>
                <dialog v-mdl class="mdl-dialog" id="dialogConfirmRemoveItem">
                    <h6 class="mdl-dialog__title">{{ $t('Confirmar exclusão') }}</h6>
                    <div class="mdl-dialog__content">
                        <p>{{ $t('Deseja realmente remover esta resposta {content} ?', { content: '' })}}</p>
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
                <div class="bottom-bar">
                    <button @click="doneTask()" v-if="canEdit()" class="mdl-button mdl-button--raised mdl-button--accent orange whited">
                        <i class="material-icons">check</i>{{ $t('Finalizar Tarefa') }}
                    </button>
                    <button @click="$router.back()" v-if="!canEdit()" class="mdl-button mdl-button--raised mdl-button--accent orange whited">
                        <i class="material-icons">keyboard_backspace</i>{{ $t('Voltar') }}
                    </button>
                    <div class="actions">
                        <message-button />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Form from '@/components/form/Form'
import { mapGetters } from 'vuex'
import CardExpand from '@/components/layout/CardExpand'
import formsEntity from '@/plugins/persistence/entities/forms'
import TaskDescription from '../../../../components/shared/task/TaskDescription.vue'
import MessageButton from '../../../../components/shared/MessageButton.vue'

export default {
  components: {
    CardExpand,
    TaskDescription,
    MessageButton,
    Form
  },
  data () {
    return {
      forms: [],
      form: '',
      formDialog: {
        opened: false
      },
      inResponse: false,
      currentResponse: null
    }
  },
  watch: {
  },
  methods: {
    doneTask () {
      let valid = true
      if (this.currentTask.formsExtra) {
        this.forms.forEach(form => {
          if (this.getFormMandatory(form) && this.getResponsesCount(form) == 0) {
            valid = false
          }
        })
      }
      if (valid) {
        this.$store.dispatch('task/doneTask', {responses: []})
      } else {
        this.$bus.$emit('showErrorEmitted', {
          msg: this.$t('Existem Formulários obrigatórios não respondidos!')
        })
      }
    },
    async getForms () {
      this.forms = []
      try {
        let taskForms = JSON.parse(this.currentTask.forms)
        for (let idForm in taskForms) {
          this.forms.push(await formsEntity.getOneFormById(parseInt(taskForms[idForm])))
        }
      } catch (err) {
        console.log(err)
      }
    },
    getResponses (form) {
      let responses = false
      if (this.currentTask.responses) {
        responses = this.currentTask.responses.filter(response => {
          return response.idForm == form.id
        })
      }
      return responses && responses.length > 0 ? responses : []
    },
    getResponsesCount (form) {
      return this.getResponses(form).length
    },
    getFormMandatory (form) {
      if (this.currentTask.formsExtra) {
        const _formsExtra = JSON.parse(this.currentTask.formsExtra)
        if (_formsExtra.obrigatorios) {
          return _formsExtra.obrigatorios.filter(idForm => {
            return idForm == form.id
          }).length > 0
        }
      }
    },
    addResponseItem (form) {
      if (this.canEdit()) {
        this.openForm(form)
        this.currentResponse = null
        this.inResponse = true
      }
    },
    editResponseItem (form, response) {
      this.openForm(form)
      this.currentResponse = JSON.parse(JSON.stringify(response))
      this.inResponse = true
    },
    cancelResponseItem () {
      this.closeForm()
      this.currentResponse = {}
      this.inResponse = false
      this.form = null
    },
    removeResponseItem (form, response) {
      this.form = form
      this.$store.dispatch('task/removeResponseCurrentTask', {index: this.currentTask.responses.indexOf(response)})
      this.inResponse = false
      this.$forceUpdate()
    },
    saveResponseItem (values) {
      if (this.currentTask.responses) {
        const _origi = this.currentTask.responses.find(ele => { return ele.uuid == values.uuid })
        if (_origi) {
          const index = this.currentTask.responses.indexOf(_origi)
          this.$store.dispatch('task/setResponseCurrentTask', {response: values, index: index})
        } else {
          this.$store.dispatch('task/addResponseCurrentTask', {response: values})
        }
      } else {
        this.$store.dispatch('task/addResponseCurrentTask', {response: values})
      }
      this.currentResponse = {}
      this.inResponse = false
      this.closeForm()
    },
    openForm (form) {
      this.form = form
      this.formDialog.opened = true
      this.$root.cardContent = true
      this.$el.querySelector('#formDialog').showModal()
      this.$forceUpdate()
    },
    closeForm () {
      this.formDialog.opened = false
      this.$root.cardContent = false
      this.$el.querySelector('#formDialog').close()
    },
    canEdit () {
      return this.currentTask.status == 'iniciada' && this.user.route.status != '2'
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      tasks: 'task/tasks',
      user: 'user/user'
    }),
    formResponses () {
      const _self = this
      return this.currentTask.responses && this.form ? this.currentTask.responses.filter(response => {
        return response.idForm == _self.form.id
      }) : null
    }
  },
  beforeMount () {
    this.getForms()
  },
  mounted () {
    setTimeout(() => {
      this.$dialogPolyfill.doDialog('dialog-blocked')
    }, 100)
  },
  filters: {
  }
}
</script>
<style>
.mdl-list__item-primary-content {
  height: 40px;
}
.mdl-list__item-secondary-action a{
  max-width: 50px;
}
.task-description {
padding-bottom: 0;
}
.form-container {
  overflow-y: auto;
}
.mdl-button--raised[disabled][disabled], .mdl-button--raised.mdl-button--disabled.mdl-button--disabled {
    color: black;
}
</style>
