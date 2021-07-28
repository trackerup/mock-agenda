<template>
  <div class="task-before bottom-bar-padding">
    <TaskTitle :task="currentTask" ></TaskTitle>
    <TaskDescription :task="currentTask" />

    <dialog v-if="currentTask" class="mdl-dialog modal-form full" id="dialog-blocked" v-show="blockedDialog.opened">
      <div class="mdl-dialog__content" :class="{'visible': this.$root.cardContent}" >
        <h5 class="mdl-dialog__title" v-if="form && form.titulo">{{ $t(form.titulo) }}</h5>
          <Form
            v-if="form"
            :idForm="form.id"
            :typeForm="'simple'"
            v-on:save="saveFormPecas"
            v-on:cancel="closeblocked"
            :readOnly="user.route.status == '2'"
            :readonlyState="user.route.status == '2'"
            :value="responses"
          />
        <div class="form-actions simple" v-if="user.route.status != '1'">
          <button class="mdl-button grey" @click="closeblocked">{{$t('Cancelar')}}</button>
        </div>
      </div>
    </dialog>

    <div class="bottom-bar">
      <button @click="openFormDialog"
              class="mdl-button mdl-button--raised mdl-button--accent orange whited">
        <i class="material-icons" v-if="!this.currentTask.responses || this.currentTask.responses.length == 0">build</i>
        <i class="material-icons green" v-if="this.currentTask.responses && this.currentTask.responses.length != 0">check</i>
        {{ $t('Requisição de Peças') }}
      </button>
      <div class="actions">
        <message-button />
      </div>
    </div>
  </div>
</template>

<script>
import formsEntity from '@/plugins/persistence/entities/forms'
import TaskTitle from '@/components/shared/task/TaskTitle.vue'
import TaskDescription from '@/components/shared/task/TaskDescription.vue'
import MessageButton from '@/components/shared/MessageButton.vue'
import ResponseItem from '@/components/form/ResponseItem'
import { mapGetters } from 'vuex'
import Form from '@/components/form/Form'

export default {
  components: {
    TaskTitle,
    TaskDescription,
    MessageButton,
    Form,
    ResponseItem
  },
  data () {
    return {
      blockedDialog: {
        opened: false
      },
      responses: [],
      inResponse: false,
      formReqCode: null,
      form: '',
      currentResponse: null
    }
  },
  methods: {
    getResponses () {
      const _self = this
      let responses = this.currentTask.responses.filter(response => {
        return response.idForm == _self.form.id
      })
      this.responses = responses && responses.length > 0 ? JSON.parse(JSON.stringify(responses[0])) : null
      _self.$forceUpdate()
    },
    saveFormPecas (values) {
      this.blockedDialog.opened = false
      this.$root.cardContent = false
      this.$store.dispatch('task/setResponseCurrentTask', {response: values, index: 0})
    },
    closeblocked () {
      this.blockedDialog.opened = false
      this.$root.cardContent = false
    },
    openFormDialog () {
      const _self = this
      if (!_self.form) {
        this.formReqCode = this.currentTask.metaDados.filter(eleme => { return eleme.meta_key == '__FORM_REQ_CODE' })[0]
        formsEntity.getOneFormById(this.formReqCode ? parseInt(this.formReqCode.meta_value) : 21).then(form => {
          _self.form = form
          _self.getResponses()
          _self.blockedDialog.opened = true
          _self.$root.cardContent = true
          _self.$forceUpdate()
        })
      } else {
        _self.blockedDialog.opened = true
        _self.$root.cardContent = true
        _self.$forceUpdate()
      }
    }
  },
  watch: {
    blockedDialog: {
      handler: function (val) {
        if (val.opened) {
          this.$el.querySelector('#dialog-blocked').showModal()
        } else {
          this.$el.querySelector('#dialog-blocked').close()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      user: 'user/user'
    })
  },
  mounted () {
    setTimeout(() => {
      this.$dialogPolyfill.doDialog('dialog-blocked')
    }, 500)
  },
  filters: { }
}
</script>
<style scoped>
.form-container {
  max-height: 65vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
