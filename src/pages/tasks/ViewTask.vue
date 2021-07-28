<template>
  <div class="content-page">
    <ViewTaskBloqued v-on:updateTask="updateTask" v-if="currentTask && currentTask.status == 'bloqueada'" />
    <ViewTaskPending v-on:updateTask="updateTask" v-if="currentTask && (currentTask.status == 'pendente' || currentTask.status == 'interrompida')" />
    <ViewTaskTravelStarted v-on:updateTask="updateTask" v-if="currentTask && currentTask.status == 'travelStarted'" />
    <ViewTaskTravelDone v-on:updateTask="updateTask" v-if="currentTask && currentTask.status == 'travelDone'" />
    <ViewTaskStarted v-on:updateTask="updateTask" v-if="currentTask && currentTask.status == 'iniciada'" />
    <ViewTaskFinished v-on:updateTask="updateTask" v-if="currentTask && (currentTask.status == 'concluida' || currentTask.status == 'malsucedida')" />
    <div v-if="currentTask === null" class="task-before">
      <div class="mdl-card taskitem">
          {{$t('Aguarde...')}}
      </div>
    </div>
  </div>
</template>

<script>
import ViewTaskBloqued from './status/ViewTaskBloqued.vue'
import ViewTaskPending from './status/ViewTaskPending.vue'
import ViewTaskTravelStarted from './status/ViewTaskTravelStarted.vue'
import ViewTaskTravelDone from './status/ViewTaskTravelDone.vue'
import ViewTaskStarted from './status/ViewTaskStarted.vue'
import ViewTaskFinished from './status/ViewTaskFinished.vue'
import formsEntity from '../../plugins/persistence/entities/forms'
import CardExpand from '../../components/layout/CardExpand'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {
    CardExpand,
    ViewTaskBloqued,
    ViewTaskPending,
    ViewTaskTravelStarted,
    ViewTaskTravelDone,
    ViewTaskStarted,
    ViewTaskFinished
  },
  data () {
    return {
      typeForm: 'simple',
      // typeForm: 'wizardstep',
      // typeForm: 'wizardconfirm',
      blockedDialog: {
        opened: false
      },
      blockedDialogOS: {
        opened: false
      },
      forms: []
    }
  },
  watch: {
    currentRoute (current) {
      this.checkRoute(current)
    },
    blockedDialog: {
      handler: function (val) {
        if (val.opened) {
          this.$el.querySelector('#dialog-blocked').showModal()
        } else {
          this.$el.querySelector('#dialog-blocked').close()
        }
      },
      deep: true
    },
    blockedDialogOS: {
      handler: function (val) {
        if (val.opened) {
          this.$el.querySelector('#dialog-blocked-os').showModal()
        } else {
          this.$el.querySelector('#dialog-blocked-os').close()
        }
      },
      deep: true
    },
    currentTask (value) {
      this.$emit('changeParams', {
        pageTitle: value && (value.status == 'iniciada' ? this.$t('Em atendimento') : this.$t('Detalhes da tarefa')),
        mapMenu: value && value.status != 'iniciada',
        backMenu: true,
        routeMap: '/taskMap'
      })
    }
  },
  methods: {
    changePageParams (o = null) {
      if (o == null) {
        o = {
          pageTitle: this.$t('Detalhes da tarefa'),
          mapMenu: true,
          backMenu: true,
          routeMap: '/taskMap/' + this.task.id
        }
      }
      this.$emit('changeParams', o)
    },
    setCurrentTask () {
      this.responses = this.currentTask.responses
      this.$forceUpdate()
    },
    async getForms () {
      this.forms = []
      try {
        let taskForms = JSON.parse(this.task.forms)
        for (let idForm in taskForms) {
          this.forms.push(await formsEntity.getOneFormById(taskForms[idForm]))
        }
      } catch (err) {
        console.log(err)
      }
    },
    exitToList (e) {
      if (this && this.$t) {
        const snackbar = {
          message: this.$t('OS ' + this.numOS + ' foi excluida'),
          duration: 3000
        }
        this.$bus.$emit('showSnackBar', snackbar)
        this.$root.dialogOpen = false
        this.$router.back()
      }
    },
    updateTask () {
      // this.$forceUpdate()
    }
  },
  async beforeMount () {
    await this.setCurrentTask()
    await this.getForms()
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      tasks: 'task/tasks',
      user: 'user/user',
      coords: 'user/coords'
    }),
    numOS () {
      let numOs = this.task.id
      if (this.task.metaDados) {
        for (let idx in this.task.metaDados) {
          if (this.task.metaDados[idx].meta_key == '__OS') {
            return this.task.metaDados[idx].meta_value
          }
        }
      }
      return numOs
    },
    periodo () {
      return this.task.planedStart == '{"hora":7,"minuto":0}' ? this.$t('Manhã') : this.$t('Tarde')
    },
    metaData () {
      let metaData = []
      if (this.task.metaDados) {
        for (let idx in this.task.metaDados) {
          if (!this.task.metaDados[idx].meta_key.startsWith('__')) {
            try {
              metaData.push({
                meta_key: this.task.metaDados[idx].meta_key,
                meta_value: JSON.parse(this.task.metaDados[idx].meta_value)
              })
            } catch (err) {
              metaData.push(this.task.metaDados[idx])
            }
          }
        }
      }
      return metaData
    },
    taskStarted () {
      return ['iniciada'].includes(this.task.status)
    },
    response () {
      return this.responses && this.responses.length > 0 ? this.responses[0] : null
    }
  },
  mounted () {
    let divs = document.getElementsByClassName('expandNow')
    for (let i = 0; i < divs.length; i++) {
      const element = divs[i]
      element.childNodes[0].childNodes[0].childNodes[2].click()
    }
    if (!window.appState.takingPicture) {
      this.$bus.$emit('loading', false)
    }
    this.$bus.$on('currentTaskDeleted', this.exitToList)
    setTimeout(() => {
      this.$dialogPolyfill.doDialog('dialog-blocked')
      this.$dialogPolyfill.doDialog('dialog-blocked-os')
    }, 500)
  },
  filters: {
    formatDataMeta: function (value) {
      if (value) {
        return value.slice(6, 8) + '/' + value.slice(4, 6) + '/' + value.slice(0, 4)
      } else {
        return value
      }
    },
    formatDataComment: function (value) {
      if (value) {
        try {
          return moment(value).format('DD/MM/YYYY HH:mm:ss')
        } catch (error) {
          return value
        }
      } else {
        return value
      }
    }
  },
  beforeDestroy () {
    if (this.$refs) {
      if (this.$refs.subForm) {
        this.$refs.subForm.$destroy()
        this.$refs.subForm = null
      }
    }
  }
}
</script>

<style lang="scss">
  .card-wizard {
    z-index: initial;
    position: static;
    min-height: 40vh;
  }
  .form-taskproblem,
  .task-before,
  .task-started {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 12px;
  }
  .task-started {
    box-sizing: border-box;
  }
  .bottom-bar {
    z-index: 1;
    position: fixed;
    bottom: 0px;
    background-color: #6D6E71;
    height: 56px;
    width: 100%;
    .mdl-button--raised {
      margin-top: 12px;
      margin-left: 14px;
      font-size: 12px;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.089em;
      line-height: 36px;
      border-radius: 4px;
      padding-left: 10px;
      padding-right: 10px;
      .material-icons {
        margin-right: 8px;
        margin-top: -2px;
      }
    }
    .actions {
      position: absolute;
      right: 11px;
      bottom: 25px;
      z-index: 1;
    }
  }

  .taskproblem {
    width: 100%;
    h5 {
      text-align: center;
      margin-bottom: 15px;
      margin-top: 5px;
      line-height: 24px;
      letter-spacing: 0.013em;
      color: #6D6E71;
    }
    .containerform {
      margin: 0 16px;
    }

    .actions {
      position: absolute;
      right: 11px;
      bottom: 25px;
      z-index: 1;
    }
  }

  .button-warning {
    background-color: #D00010;
    margin: 0 8px 10px;
    color: #fff;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    border: 0;
    text-transform: none;
    font-size: 12px;
    font-weight: 500;
    text-align: left;
    padding-left: 9px;
    padding-right: 9px;
    .material-icons {
      margin-right: 6px;
    }
  }

  .content-page {
    height: 100%;
  }
</style>
