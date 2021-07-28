<template>
  <div class="tasks-page">
    <div class="content-page">

      <div class="mdl-grid hour-item" v-if="dateFuturo != ''">
        <div class="mdl-toolbar-section-start body-1">
          {{ dataFormat(dateFuturo)}}
        </div>
        <div class="mdl-toolbar-section-end mdl-caption">
        </div>
      </div>

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
              class="mdl-button  mdl-button--fab  orange">
        <i class="material-icons message">message</i>
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TaskItem from '@/components/shared/TaskItem.vue'
import HourSeparator from '@/components/shared/HourSeparator.vue'
import { mapGetters } from 'vuex'
import { existsInArray } from '../../utils'
import SynchronizationTasks from '../../plugins/tasks/synchronizationTasks'
import SynchronizationRoute from '../../plugins/routes/synchronizationRoute'
import { saveTarefas } from '@/plugins/persistence/entities/tarefa'
import formatInputDateTime from '@/filters/date/formatInputDateTime'
import moment from 'moment'

export default {
  name: 'FutureTasks',
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
      synchronizationTasks: null,
      synchronizationRoute: null,
      allowOrder: true,
      orderName: '',
      dateFuturo: ''
    }
  },
  computed: {
    ...mapGetters({
      tasks: 'task/tasks',
      user: 'user/user',
      viewDate: 'task/viewDate'
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
    date.setDate(date.getDate() + 1)
    await this.$store.dispatch('task/updateViewDate', {date: date})
    await this.$store.dispatch('task/getTasks', {})
    await this.$store.dispatch('task/setCurrentTask', {task: null})
  },
  beforeMount () {
    const ComponentTasksClass = Vue.extend(SynchronizationTasks)
    this.synchronizationTasks = new ComponentTasksClass()

    const ComponentRouteClass = Vue.extend(SynchronizationRoute)
    this.synchronizationRoute = new ComponentRouteClass()
  },
  mounted () {
    const _self = this

    window.inSync = false

    this.synchronizationTasks.makeTasksSync(this, false, true).then(response => {
      _self.$bus.$emit('tasks-sync', true)
    }).catch(() => {
      _self.$bus.$emit('tasks-sync', false)
    })

    this.$emit('changeParams', {
      pageTitle: this.$t('OS Futuras'),
      mapMenu: true,
      backMenu: false
    })

    this.sortTasksByPeriod()
  },
  methods: {
    dataFormat (dateFuturo) {
      if (dateFuturo) {
        return moment(dateFuturo).format('DD/MM/YYYY')
      }
      return ''
    },
    sortTasksByPeriod () {
      let _self = this
      this.tasksMorning = []
      this.tasksEvening = []
      this.tasksNight = []
      this.tasksDawn = []

      if (this.tasks.all) {
        let allTasks = this.tasks.all.filter(task => {
          return task.rota == _self.user.route.id && task.status != 'concluida' && task.status != 'malsucedida' && task.dataTarefa >= _self.viewDate
        })

        allTasks.sort(function (a, b) {
          if (a.dataTarefa < b.dataTarefa) { return -1 }
          if (a.dataTarefa > b.dataTarefa) { return 1 }
          return 0
        })
        if (allTasks.length) {
          this.dateFuturo = allTasks[0].dataTarefa

          const tasks = allTasks.filter(task => {
            return task.dataTarefa == this.dateFuturo
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
      }
    },
    routeBlocked () {
      if (this.user && this.user.route && this.user.route.status == '1') {
        return true
      }
      return false
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
      this.reorderTasks('setas')
    },
    async reorderTasks ($event) {
      if ($event != 'setas' && this.orderName != '') {
        this.orderName = ''
      } else {
        if (this.orderName == '') {
          this.orderName = $event
        } else {
          let promise = null
          switch (this.orderName) {
            case 'morning':
              promise = this.updateOrderTask(this.tasksMorning)
              break
            case 'evening':
              promise = this.updateOrderTask(this.tasksEvening)
              break
            case 'night':
              promise = this.updateOrderTask(this.tasksNight)
              break
            case 'dawn':
              promise = this.updateOrderTask(this.tasksDawn)
              break
          }
          promise.then(function (tasks) {
            saveTarefas(tasks)
          })
        }
      }
    },
    updateOrderTask (tasks) {
      return new Promise(async (resolve, reject) => {
        let i = 1
        let _self = this
        await tasks.forEach(async task => {
          await _self.$store.dispatch('task/updateTaskData', {
            task: task,
            data: {
              urgente: i++,
              sinc: 0,
              updated_at: formatInputDateTime(new Date().toISOString())
            }
          })
        })
        _self.sortTasksByPeriod()
        switch (_self.orderName) {
          case 'morning':
            tasks = (_self.tasksMorning)
            break
          case 'evening':
            tasks = (_self.tasksEvening)
            break
          case 'night':
            tasks = (_self.tasksNight)
            break
          case 'dawn':
            tasks = (_self.tasksDawn)
            break
        }
        resolve(tasks)
      })
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
