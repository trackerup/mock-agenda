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

    <div class="botton-actions" :class="[routeBlocked() ? 'space-between' : '', this.orderName == '' ? '' : 'hidden']">
      <div class="col-auto col-aproveRoute">
        <button @click="requestAproveRoute()" v-show="routeBlocked()"
                class="mdl-button mdl-button--raised mdl-button--accent orange whited">
        {{ $t('Solicitar aprovação de rota') }}
        </button>
      </div>
      <div class="col-auto col-actions">
        <div class="actions" :class="[fabActive ? 'fab-open' : '']">
          <button class="mdl-button  mdl-button--fab mdl-button--mini-fab orange" @click="$router.push('/occurrence')" >
            <i class="material-icons">warning</i>
          </button>
          <button @click="$router.push('/messages')" class="mdl-button  mdl-button--fab mdl-button--mini-fab orange">
            <i class="material-icons message">message</i>
          </button>
          <button class="mdl-button mdl-button--fab  mdl-button--fab--text button-actions orange" @click="fabActive = !fabActive">
            <span id="nav-icon">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </div>
    <dialog v-mdl class="mdl-dialog" id="dialogLoaderRequestAproveRoute">
      <h6 v-if="!errorAproveRoute" class="mdl-dialog__title">{{ $t('Solicitando aprovação de rota') }}</h6>
      <div v-else class="mdl-dialog__title">
        <center><i class="material-icons warning error">warning</i><br></center>
        <h6>{{ $t('Solicitação de aprovação de rota demorando mais que o normal!') }}</h6>
      </div>
      <div v-if="!errorAproveRoute" class="mdl-dialog__content">
        <div class="tiny-loader"></div>
        <p>{{$t('Aguarde')}}</p>
      </div>
      <div v-else class="mdl-dialog__content">
        <button @click="requestAproveRoute" class="mdl-button mdl-button--raised mld-button-small mdl-button--colored">
          <span>{{$t('Tentar Novamente')}}</span>
        </button>
        <button @click="closeModal" class="mdl-button " v-show="routeBlocked()">
          <span>{{$t('Cancelar')}}</span>
        </button>
      </div>
    </dialog>
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
import { saveTarefas, prepareForAproveRoute } from '@/plugins/persistence/entities/tarefa'
import { deleteFile } from '@/plugins/http/download'
import formatInputDateTime from '@/filters/date/formatInputDateTime'
import { makeUserStartBackground } from '@/services/auth'
import InputAccordingSimple from '@/components/form/fields'

export default {
  name: 'Tasks',
  components: {
    HourSeparator,
    TaskItem,
    InputAccordingSimple
  },
  data () {
    return {
      tasksMorning: [],
      tasksEvening: [],
      tasksNight: [],
      tasksDawn: [],
      synchronizationTasks: null,
      synchronizationRoute: null,
      errorAproveRoute: false,
      allowOrder: true,
      orderName: '',
      fabActive: false
    }
  },
  computed: {
    ...mapGetters({
      tasks: 'task/tasks',
      user: 'user/user',
      viewDate: 'task/viewDate',
      startBackground: 'user/startBackground'
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
      this.$bus.$emit('delete-old-tasks')
    }
  },
  async created () {
    let date = new Date()
    await this.$store.dispatch('task/updateViewDate', {date: date})
    await this.$store.dispatch('task/getTasks', {})
    await this.$store.dispatch('task/setCurrentTask', {task: null})
    let startBackground = this.$store.getters['user/startBackground']
    if (startBackground == 'true') {
      this.initRastreamento()
    }
  },
  beforeMount () {
    const ComponentTasksClass = Vue.extend(SynchronizationTasks)
    this.synchronizationTasks = new ComponentTasksClass()
    const ComponentRouteClass = Vue.extend(SynchronizationRoute)
    this.synchronizationRoute = new ComponentRouteClass()
  },
  mounted () {
    let _self = this
    console.log(this.tasks)
    window.inSync = false

    this.synchronizationTasks.makeTasksSync(this, false, true).then(response => {
      _self.$bus.$emit('tasks-sync', true)
    }).catch(() => {
      _self.$bus.$emit('tasks-sync', false)
    })

    this.fabActive = false

    this.$emit('changeParams', {
      pageTitle: this.$t('OS em preparo'),
      mapMenu: true,
      backMenu: false
    })
    this.$root.dialogOpen = false // garante que menu vai estar disponível
    this.sortTasksByPeriod()
  },
  methods: {
    sortTasksByPeriod () {
      let _self = this
      this.tasksMorning = []
      this.tasksEvening = []
      this.tasksNight = []
      this.tasksDawn = []

      if (this.tasks.all) {
        const date = this.viewDate
        // only tasks with status different of concluida or malsucedida
        const tasks = this.tasks.all.filter(task => {
          return task.rota == _self.user.route.id && task.status != 'concluida' && task.status != 'malsucedida' && task.dataTarefa == date
        })

        tasks.sort(function (a, b) {
          if (a.urgente < b.urgente) { return -1 }
          if (a.urgente > b.urgente) { return 1 }
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
    async setDate (event) {
      await this.$store.dispatch('task/updateViewDate', {date: event.target.value})
      await this.$store.dispatch('task/getTasks', {})
      this.$bus.$emit('tasks-sync', true)
      this.sortTasksByPeriod()
    },
    routeBlocked () {
      if (this.user && this.user.route && this.user.route.status == '1' && this.tasks.bloqueada) {
        return true
      }
      return false
    },
    requestAproveRoute () {
      let _self = this
      _self.timeoutAproveRoute = true
      _self.errorAproveRoute = false
      const dialog = 'dialogLoaderRequestAproveRoute'
      try {
        if (this.$el.querySelector('#' + dialog).open) {
          this.$el.querySelector('#' + dialog).close()
          this.$el.querySelector('#' + dialog).showModal()
        } else {
          this.$el.querySelector('#' + dialog).showModal()
        }
      } catch (error) {
        console.log('dialog error')
      }
      this.initRastreamento()
      this.sincPreAproveRoute().finally(() => {
        try {
          _self.$el.querySelector('#' + dialog).close()
          _self.timeoutAproveRoute = false
          _self.fabActive = false
        } catch (error) {
          console.log('dialog error')
        }
      })

      setTimeout(() => {
        if (_self.timeoutAproveRoute) {
          _self.errorAproveRoute = true
        }
      }, 60000)
    },
    closeModal () {
      const dialog = 'dialogLoaderRequestAproveRoute'
      try {
        this.$el.querySelector('#' + dialog).close()
      } catch (error) {
        console.log('dialog error')
      }
    },
    initRastreamento () {
      this.$bus.$emit('startBackground', true)
      makeUserStartBackground(this.user).then(({ data }) => {
        console.log('Inicio Rastreamento')
      }).catch(({ data }) => {
        this.error = this.$t(data.error)
        const snackbar = {
          message: this.$t(this.error)
        }
        this.$bus.$emit('showSnackBar', snackbar)
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
    },
    async sincPreAproveRoute () {
      return new Promise(async (resolve, reject) => {
        window.inSync = false
        let _self = this
        this.fabActive = false
        this.$bus.$on('tasks-sync-finish', () => {
          _self.$bus.$off('tasks-sync-finish')
        })
        prepareForAproveRoute().then(() => {
          this.synchronizationRoute.requestAproveRoute(this).then(() => {
            this.tasks.all.forEach(task => {
              deleteFile('task_' + task.id)
            })
            resolve()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tasks-page {
    position: unset;
    height: unset;
    padding-bottom: 74px;
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
