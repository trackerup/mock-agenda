import { post as makeRequestAproveRoute } from '../../services/route'
import { mapGetters } from 'vuex'
import user from '../persistence/entities/user'

export default {
  data () {
    return {
      currentIntervalTasks: null,
      timeout: 15 * 1000,
      token: null,
      tarefas: []
    }
  },

  // Evitar de pegar dados do store no monted hook,
  // Pegar dados do store desta forma. Os dados ficam 'dinamicos' quando
  // mudam de estado. Se pegar os dados de store no mounted, a variavel
  // nunca sera atualizada, mantendo sempre o valor de quando o componente
  // foi montado.
  computed: {
    ...mapGetters({
      // tarefas: 'task/tasks',
      user: 'user/user'
    })
    /* tarefas: {
      async get () {
        return await this.$store.getters['task/tasks'] || this.tarefas || { all: [] }
      },
      set () {}
    } */
  },

  mounted () {
    this.token = this.$store.getters['user/token'] || window.localStorage.getItem('token')
  },
  methods: {
    /**
     * Make tasks synchronization.
     *
     * @returns {Promise} Returns a promise according to the 'success' flag.
     */
    requestAproveRoute: function (parent) {
      if (parent) {
        const snackbar = {
          message: parent.$t('Sincronizando dados'),
          duration: 4000
        }
        parent.$bus.$emit('showSnackBar', snackbar)
      }

      return new Promise(async (resolve, reject) => {
        parent.$bus.$on('tasks-sync-finish', async () => {
          parent.$bus.$off('tasks-sync-finish')
          // configuration to get tarefas
          const data = {
            pullTracker: {
              act: 'solicitarAprovacaoRotaBloqueada'
            }
          }
          await makeRequestAproveRoute(data).then((data) => {
            if (data) {
              user.synchronization(data, parent)
              parent.$bus.$emit('auth-user', true)
              resolve(data)
            } else {
              reject(data)
            }
          }).catch(({ data }) => {
            const mensagem = data.mensagem || data.error
            console.log(mensagem)
            reject(mensagem)
          })
        })
        parent.$bus.$emit('tasks-sync', true)
      })
    }
  }
}
