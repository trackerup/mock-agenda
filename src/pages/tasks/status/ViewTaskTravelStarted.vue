<template>
  <div class="task-before bottom-bar-padding">
    <TaskTitle :task="currentTask" ></TaskTitle>
    <TaskDescription :task="currentTask" />
    <div class="bottom-bar">
      <button @click="changeStatus" v-if="user && user.route.status != '1'"
                class="mdl-button mdl-button--raised mdl-button--accent green whited">
          <i class="material-icons">location_on</i>{{ $t('Informar Chegada') }}
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
    return { }
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
        this.$store.dispatch('task/travelDone')
        this.$geolocation.stopTravelling()
        this.$emit('updateTask')
      }
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      user: 'user/user'
    })
  },
  mounted () { },
  filters: { }
}
</script>
