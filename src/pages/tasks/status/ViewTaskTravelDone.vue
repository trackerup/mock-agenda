<template>
  <div class="task-before bottom-bar-padding">
    <TaskTitle :task="currentTask" ></TaskTitle>

    <button
        class="mdl-button button-warning"
        @click="goToTaskProblem">
      <i class="material-icons">warning</i>
      {{ $t('Consumidor Ausente e/ou Endereço não localizado') }}
    </button>

    <TaskDescription :task="currentTask" />
    <div class="bottom-bar">
      <button @click="changeStatus('iniciada')" v-if="currentTask.status == 'travelDone' && user.route.status != '1'"
              class="mdl-button mdl-button--raised mdl-button--accent orange whited">
        <i class="material-icons">play_circle_filled</i>{{ $t('Iniciar Tarefa') }}
      </button>
      <div class="actions">
        <MessageButton />
      </div>
    </div>
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
      user: {
        route: {
          status: 0
        }
      }
    }
  },
  methods: {
    async changeStatus () {
      const permitidoInformarChegada = await this.$routeService.permitirInformarChegadaTarefaAtual(this)
      if (permitidoInformarChegada != true) {
        this.$bus.$emit('showMessageEmitted', {
          msg: permitidoInformarChegada
        })
        logTask(this.currentTask.id, permitidoInformarChegada, 'info')
      } else {
        this.$geolocation.stopTravelling()
        this.$store.dispatch('task/startTask')
      }
    },
    goToTaskProblem () {
      this.$router.push('/taskProblem/' + this.currentTask.id)
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask'
    })
  },
  mounted () { },
  filters: { }
}
</script>
