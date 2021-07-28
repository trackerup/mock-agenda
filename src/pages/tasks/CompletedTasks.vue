<template>
  <div class="tasks-page">
    <div class="content-page">
      <template v-if="tasksMorning.length > 0">
        <HourSeparator :model="morning" @reorder="reorderTasks($event)" :showreorder="routeBlocked()"></HourSeparator>
        <TaskItem v-for="item in tasksMorning" :key="item.id" :task="item" @order="ordernarUrgencia($event)"></TaskItem>
      </template>

      <template v-if="tasksEvening.length > 0">
        <HourSeparator :model="evening" @reorder="reorderTasks($event)" :showreorder="routeBlocked()"></HourSeparator>
        <TaskItem v-for="item in tasksEvening" :key="item.id" :task="item" @order="ordernarUrgencia($event)"></TaskItem>
      </template>

      <template v-if="tasksNight.length > 0">
        <HourSeparator :model="night" @reorder="reorderTasks($event)" :showreorder="routeBlocked()"></HourSeparator>
        <TaskItem v-for="item in tasksNight" :key="item.id" :task="item" @order="ordernarUrgencia($event)"></TaskItem>
      </template>

      <template v-if="tasksDawn.length > 0">
        <HourSeparator :model="dawn" @reorder="reorderTasks($event)" :showreorder="routeBlocked()"></HourSeparator>
        <TaskItem v-for="item in tasksDawn" :key="item.id" :task="item" @order="ordernarUrgencia($event)"></TaskItem>
      </template>

    </div>
    <div class="actions" :class="[this.orderName == '' ? '' : 'hidden']">
      <button @click="$router.push('/messages')"
              class="mdl-button mdl-button--fab orange">
        <i class="material-icons message">message</i>
      </button>
      <!-- <button @click="requestAproveRoute()"
              class="mdl-button mdl-button--fab mdl-button--fab--text" v-show="routeBlocked()">
        <span>OK</span>
      </button> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TaskItem from '@/components/shared/TaskItem.vue'
import HourSeparator from '@/components/shared/HourSeparator.vue'
import { mapGetters } from 'vuex'
import { existsInArray } from '../../utils'
import SynchronizationRoute from '../../plugins/routes/synchronizationRoute'
import { saveTarefas, getTarefasByDate } from '../../plugins/persistence/entities/tarefa'
import { deleteFile } from '@/plugins/http/download'

export default {
  name: 'Tasks',
  components: {
    HourSeparator,
    TaskItem
  },
  data () {
    return {
      tasksMorning: [],
      tasksEvening: [],
      tasksNight: [],
      tasksDawn: [],
      synchronizationRoute: null,
      allowOrder: true,
      orderName: ''
    }
  },
  computed: {
    ...mapGetters({
      tasks: 'task/tasks',
      user: 'user/user'
    }),
    morning () {
      return {
        name: 'morning',
        time: '07:00',
        period: this.$t('Manhã'),
        reorder: false
      }
    },
    evening () {
      return {
        name: 'evening',
        time: '13:00',
        period: this.$t('Tarde'),
        reorder: false
      }
    },
    night () {
      return {
        name: 'night',
        time: '19:00',
        period: this.$t('Noite'),
        reorder: false
      }
    },
    dawn () {
      return {
        name: 'dawn',
        time: '01:00',
        period: this.$t('Madrugada'),
        reorder: false
      }
    }
  },
  watch: {
    tasks (value) {
      this.sortTasksByPeriod()
    }
  },
  async created () {
    let date = new Date()
    await this.$store.dispatch('task/updateViewDate', {date: date})
    await this.$store.dispatch('task/getTasks', {})
    await this.$store.dispatch('task/setCurrentTask', {task: null})
  },
  beforeMount () {
    const ComponentTasksClass = Vue.extend(SynchronizationRoute)
    this.synchronizationRoute = new ComponentTasksClass()
  },
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('OS concluídas'),
      mapMenu: true,
      backMenu: false
    })
    this.sortTasksByPeriod()
  },
  methods: {
    sortTasksByPeriod () {
      this.tasksMorning = []
      this.tasksEvening = []
      this.tasksNight = []
      this.tasksDawn = []
      if (this.tasks.concluida) {
        // only tasks with status different of concluida or malsucedida
        const tasks = this.tasks.concluida.filter(task => {
          return task
        })

        tasks.sort(function (a, b) {
          if (parseInt(a.urgente) < parseInt(b.urgente)) { return -1 }
          if (parseInt(a.urgente) > parseInt(b.urgente)) { return 1 }
          return 0
        })

        tasks.forEach(tarefa => {
          let planedStartParsed = JSON.parse(tarefa.planedStart)
          let planedStartHour = planedStartParsed.hora

          if ((planedStartHour >= 1) && (planedStartHour <= 6)) {
            if (!existsInArray(this.tasksDawn, tarefa)) {
              this.tasksDawn.push(tarefa)
            }
          } else if ((planedStartHour >= 7) && (planedStartHour <= 12)) {
            if (!existsInArray(this.tasksMorning, tarefa)) {
              this.tasksMorning.push(tarefa)
            }
          } else if ((planedStartHour >= 13) && (planedStartHour <= 18)) {
            if (!existsInArray(this.tasksEvening, tarefa)) {
              this.tasksEvening.push(tarefa)
            }
          } else if ((planedStartHour >= 19) && (planedStartHour <= 23)) {
            if (!existsInArray(this.tasksNight, tarefa)) {
              this.tasksNight.push(tarefa)
            }
          }
        })
      }
    },
    routeBlocked () {
      if (this.user && this.user.route && this.user.route.status == '1') {
        return true
      }
      return false
    },
    requestAproveRoute () {
      this.synchronizationRoute.requestAproveRoute(this)
      this.tasks.all.forEach(task => {
        deleteFile('task_' + task.id)
      })
    },
    ordernarUrgencia ($event) {
      var index
      var tarefaAcima
      var tarefaAbaixo
      var tarefa
      switch (this.orderName) {
        case 'morning':
          index = this.tasksMorning.findIndex(obj => {
            return obj.id == $event.id
          })
          tarefa = this.tasksMorning[index]
          if ($event.direction == 'up') {
            if (index > 0) {
              tarefaAcima = this.tasksMorning[index - 1]
              this.$set(this.tasksMorning, index, tarefaAcima)
              this.$set(this.tasksMorning, index - 1, tarefa)
            }
          }
          if ($event.direction == 'down') {
            if (index < (this.tasksMorning.length - 1)) {
              tarefaAbaixo = this.tasksMorning[index + 1]
              this.$set(this.tasksMorning, index, tarefaAbaixo)
              this.$set(this.tasksMorning, index + 1, tarefa)
            }
          }
          break
        case 'evening':
          index = this.tasksEvening.findIndex(obj => {
            return obj.id == $event.id
          })
          tarefa = this.tasksEvening[index]
          if ($event.direction == 'up') {
            if (index > 0) {
              tarefaAcima = this.tasksEvening[index - 1]
              this.$set(this.tasksEvening, index, tarefaAcima)
              this.$set(this.tasksEvening, index - 1, tarefa)
            }
          }
          if ($event.direction == 'down') {
            if (index < (this.tasksEvening.length - 1)) {
              tarefaAbaixo = this.tasksEvening[index + 1]
              this.$set(this.tasksEvening, index, tarefaAbaixo)
              this.$set(this.tasksEvening, index + 1, tarefa)
            }
          }
          break
        case 'night':
          index = this.tasksNight.findIndex(obj => {
            return obj.id == $event.id
          })
          tarefa = this.tasksNight[index]
          if ($event.direction == 'up') {
            if (index > 0) {
              tarefaAcima = this.tasksNight[index - 1]
              this.$set(this.tasksNight, index, tarefaAcima)
              this.$set(this.tasksNight, index - 1, tarefa)
            }
          }
          if ($event.direction == 'down') {
            if (index < (this.tasksNight.length - 1)) {
              tarefaAbaixo = this.tasksNight[index + 1]
              this.$set(this.tasksNight, index, tarefaAbaixo)
              this.$set(this.tasksNight, index + 1, tarefa)
            }
          }
          break
        case 'dawn':
          index = this.tasksDawn.findIndex(obj => {
            return obj.id == $event.id
          })
          tarefa = this.tasksDawn[index]
          if ($event.direction == 'up') {
            if (index > 0) {
              tarefaAcima = this.tasksDawn[index - 1]
              this.$set(this.tasksDawn, index, tarefaAcima)
              this.$set(this.tasksDawn, index - 1, tarefa)
            }
          }
          if ($event.direction == 'down') {
            if (index < (this.tasksDawn.length - 1)) {
              tarefaAbaixo = this.tasksDawn[index + 1]
              this.$set(this.tasksDawn, index, tarefaAbaixo)
              this.$set(this.tasksDawn, index + 1, tarefa)
            }
          }
          break
      }
    },
    async reorderTasks ($event) {
      let _self = this
      if (this.orderName == '') {
        this.orderName = $event
      } else {
        let i = 1
        let promise = null
        switch (this.orderName) {
          case 'morning':
            this.tasksMorning.forEach(task => {
              task.urgente = i
              i++
            })
            promise = saveTarefas(this.tasksMorning)
            break
          case 'evening':
            this.tasksEvening.forEach(task => {
              task.urgente = i
              i++
            })
            promise = saveTarefas(this.tasksEvening)
            break
          case 'night':
            this.tasksNight.forEach(task => {
              task.urgente = i
              i++
            })
            promise = saveTarefas(this.tasksNight)
            break
          case 'dawn':
            this.tasksDawn.forEach(task => {
              task.urgente = i
              i++
            })
            promise = saveTarefas(this.tasksDawn)
            break
        }
        promise.then(function () {
          getTarefasByDate().then(
            async function (tarefas) {
              await _self.$store.dispatch('task/saveTasks', {tasks: tarefas})
              _self.$bus.$emit('tasks-sync', true)
            }
          )
        })
        this.orderName = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .actions {
    position: fixed;
    right: 8px;
    bottom: 24px;
    z-index: 99999;
     transition: 0.3s all;
    .mdl-button--fab {
      display: block;
      & ~ .mdl-button--fab {
        margin-top: 12px;
      }
    }
  }

  /*.tasks-page{
    height: calc( 100vh - 56px );
    position: relative;
  }*/
  .tasks-page {
    position: unset;
    height: unset;
  }
</style>

<style scoped>

  .tasks-page:before {
    content: '';
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 260px;
    height: 140px;
    /* background: url('../../assets/shared/bottom-left.svg'); */
    background-size: 260px 140px;
    background-repeat: no-repeat;
    background-position: bottom right;
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
    -ms-filter: fliph; /*IE*/
    filter: fliph; /*IE*/
    opacity: 0.3;
    filter: alpha(opacity=30); /* For IE8 and earlier */
  }

</style>
