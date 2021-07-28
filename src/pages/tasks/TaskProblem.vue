<template>
  <div v-if="task != null" class="taskproblem">
    <form novalidate class="form-taskproblem" @submit.prevent="saveProblem">
      <TaskTitle :task="task" ></TaskTitle>
      <h5 v-show="task.status != 'travelDone'">{{ $t('Justifique porque não será') }}<br/>{{ $t('possível atender essa OS') }}</h5>

      <div class="containerform">
        <div v-mdl class="mdl-textfield mdl-js-textfield  mdl-textfield--floating-label">
            <textarea
              v-on:input="onInput"
              id="sample5"
              name="sample5"
              class="mdl-textfield__input"
              rows="3"
              required></textarea>
          <label class="mdl-textfield__label" for="sample5">{{ $t('Justificativa') }}</label>
        </div>

        <div class="text-right">
          <button type="submit" class="mdl-button  mdl-button--fab ">
            <i class="material-icons arrow-right">keyboard_arrow_right</i>
          </button>
        </div>
      </div>
    </form>

    <div class="actions">
      <MessageButton />
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getOneTaskById } from '../../plugins/persistence/entities/tarefa'
import TaskTitle from '@/components/shared/task/TaskTitle.vue'
import MessageButton from '@/components/shared/MessageButton.vue'

export default {
  name: 'TaskProblem',
  components: {
    TaskTitle,
    MessageButton
  },
  data () {
    return {
      taskComment: ''
    }
  },
  methods: {
    saveProblem () {
      const _self = this
      if (_self.taskComment == '') {
        _self.$bus.$emit('showMessageEmitted', {
          msg: _self.$t('Por favor, preencha a justificativa!')
        })
      } else {
        _self.$store.dispatch('task/failTask', {coment: this.taskComment})
        let snackbar = {
          message: _self.$t('Justificativa salva com sucesso!'),
          duration: 4000
        }
        if (typeof _self.tasks.all != 'undefined' && _self.tasks.all.length) {
          if (!_self.tasks.pendente.length) {
            snackbar = {
              message: _self.$t('As OSs disponíveis para atendimento foram finalizadas!'),
              route: 'task.future',
              button: _self.$t('Ver OS futuras'),
              duration: 10000
            }
            _self.$geolocation.stopBackground(_self)
          }
          _self.$bus.$emit('showSnackBar', snackbar)
          _self.$router.push('/tasks')
        }
      }
    },
    onInput (e) {
      this.taskComment = e.target.value
    },
    async setCurrentTask () {
      let currentTask = await getOneTaskById(parseInt(this.$route.params.id))
      await this.$store.dispatch('task/setCurrentTask', {task: currentTask})
      if (this.task.status == 'travelDone') {
        this.taskComment = 'Consumidor Ausente e/ou Endereço não localizado'
      }
      this.$forceUpdate()
    }
  },
  computed: {
    ...mapGetters({
      task: 'task/currentTask',
      tasks: 'task/tasks'
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
    }
  },
  async created () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Recusar OS'),
      mapMenu: false,
      backMenu: true
    })
    this.$forceUpdate()
    this.taskComment = 'Consumidor Ausente e/ou Endereço não localizado'
  },
  async beforeMount () {
    await this.setCurrentTask()
  },
  beforeDestroy () {
    this.$store.dispatch('task/setCurrentTask', {task: null})
  }
}
</script>

<style lang="scss" scoped>

  .form-taskproblem,
  .task-started {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 12px;
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

  .task-started {
    height: 100%;
    h4 {
      margin: 0 0 6px;
    }
    .card-conteudo {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0px;
      padding-right: 0px;

      .card-content {
        overflow-y: auto;
        padding-left: 12px;
        padding-right: 12px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
      }
    }
    .actions {
      position: absolute;
      right: 4px;
      bottom: 9px;
      z-index: 1;
    }
  }

  .content-page {
    height: 100%;
  }
</style>
