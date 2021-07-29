<template>
  <div class="task-before bottom-bar-padding">
    <TaskTitle :task="currentTask" ></TaskTitle>
    <TaskDescription :task="currentTask" />
    <div class="bottom-bar">
      <button @click="changeStatus()"
              class="mdl-button mdl-button--raised mdl-button--accent orange whited">
        <i class="material-icons">near_me</i>{{ $t('Iniciar Deslocamento') }}
      </button>
      <div class="actions">
        <MessageButton />
      </div>
    </div>
    <dialog v-mdl class="mdl-dialog" id="dialogConfirmStopTask">
      <h3 class="mdl-dialog__title">{{ $t('Existe uma tarefa em andamento, deseja interrompela?') }}</h3>
      <div class="mdl-dialog__content">
        {{ taskInProgress }}
      </div>
      <div class="mdl-dialog__actions">
        <button @click="stopTasksAndStartTravel" class="mdl-button mdl-button--raised mld-button-small mdl-button--colored">
          <span>{{$t('Confirmar')}}</span>
        </button>
        <button @click="cancelStopTask" class="mdl-button ">
          <span>{{$t('Cancelar')}}</span>
        </button>
      </div>
    </dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskTitle from '@/components/shared/task/TaskTitle.vue'
import TaskDescription from '@/components/shared/task/TaskDescription.vue'
import MessageButton from '@/components/shared/MessageButton.vue'
import { logTask } from '@/plugins/persistence/entities/tarefaLog'

export default {
  components: {
    TaskTitle,
    TaskDescription,
    MessageButton
  },
  data () {
    return {
      tasksInProgress: false
    }
  },
  methods: {
    changeStatus () {
      if (this.tasks.travelStarted.length || this.tasks.travelDone.length || this.tasks.iniciada.length) {
        this.$el.querySelector('#dialogConfirmStopTask').showModal()
      } else {
        this.$store.dispatch('task/startTravel')
        this.$geolocation.startTravelling()
      }
    },
    stopTasksAndStartTravel () {
      // interrompe a tarefas em andamento
      this.tasks.travelStarted.forEach(task => {
        this.$store.dispatch('task/stopTask', {task: task})
      })
      this.tasks.travelDone.forEach(task => {
        this.$store.dispatch('task/stopTask', {task: task})
      })
      this.tasks.iniciada.forEach(task => {
        this.$store.dispatch('task/stopTask', {task: task})
      })
      this.$store.dispatch('task/startTravel')
      this.$geolocation.startTravelling()
      this.$el.querySelector('#dialogConfirmStopTask').close()
    },
    cancelStopTask () {
      // Retorna um logTask para não iniciar o deslocamento
      logTask(this.currentTask.id, 'travelStartedFail', 'travelStartedFail')
      this.$el.querySelector('#dialogConfirmStopTask').close()
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      user: 'user/user',
      tasks: 'task/tasks'
    }),
    taskInProgress () {
      let _inProgress = {}
      if (this.tasks.travelStarted.length) {
        _inProgress = this.tasks['travelStarted'][0]
      } else if (this.tasks['travelDone'].length) {
        _inProgress = this.tasks['travelDone'][0]
      } else if (this.tasks['iniciada'].length) {
        _inProgress = this.tasks['iniciada'][0]
      }
      let _numOs = _inProgress.nome ? _inProgress.nome : _inProgress.id
      if (!_inProgress.nome && _inProgress.metaDados) {
        for (let idx in _inProgress.metaDados) {
          if (_inProgress.metaDados[idx].meta_key == '__OS') {
            return _inProgress.metaDados[idx].meta_value
          }
        }
      }
      return _numOs
    }
  },
  mounted () {
    this.$dialogPolyfill.doDialog('dialogConfirmStopTask')
  },
  filters: { }
}
</script>
