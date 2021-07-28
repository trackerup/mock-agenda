<template>
  <div class="mdl-card card-conteudo card-wizard col">
    <div v-if="currentTask" class="card-content" id="card-content" :class="{'visible': this.$root.cardContent}">
        <FormWizard :task="currentTask" v-on:wizardSaved="wizardSaved"/>
    </div>
  </div>
</template>

<script>
import FormWizard from '@/components/form/FormWizard'
import { mapGetters } from 'vuex'
import uuidv4 from 'uuid/v4'

export default {
  components: {
    FormWizard
  },
  data () {
    return { }
  },
  watch: {
  },
  methods: {
    wizardSaved (responses) {
      const _self = this
      let _responses = []
      for (let idx in responses) {
        try {
          if (responses.hasOwnProperty(idx) && responses[idx].value) {
            let _response = responses[idx].value
            _response.idForm = responses[idx].idForm
            _response.uuid = uuidv4()
            _responses.push(_response)
          }
        } catch (error) {
          console.log(error)
        }
      }
      _self.$store.dispatch('task/doneTask', {responses: _responses})
      window.appState.takingPicture = false
      window.appState.fieldId = null
      window.appState.result = false
      window.appState.error = null
      window.appState.routeName = null
      window.localStorage.setItem(process.env.APP_STORAGE_KEY, JSON.stringify(window.appState))
      let _tasks = _self.$store.getters['task/tasks']
      if (_tasks && _tasks.all && _tasks.all.length) {
        if (!_tasks.pendente.length) {
          const snackbar = {
            message: _self.$t('As OSs disponíveis para atendimento foram finalizadas!'),
            route: 'task.future',
            button: _self.$t('Ver OS futuras'),
            duration: 5000
          }
          _self.$geolocation.stopBackground(_self)
          _self.$bus.$emit('showSnackBar', snackbar)
        }
      }
      _self.$router.push('/tasks')
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
    })
  }
}
</script>
