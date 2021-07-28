import { serviceMakeUserSync } from '@/services/synchronization'
import { mapGetters } from 'vuex'
import user from './persistence/entities/user'
import metaData from './persistence/entities/metaData'
import lists from './persistence/entities/lists'
import forms from './persistence/entities/forms'
import locals from './persistence/entities/locals'
import formWizard from './persistence/entities/formWizard'
import { saveRegistroPontoPosSync } from './persistence/entities/folhaPonto'

export default {
  data () {
    return {
      currentInterval: null,
      timeout: 60000
    }
  },
  computed: {
    ...mapGetters({
      // tarefas: 'task/tasks',
      token: 'user/token'
    })
  },
  async mounted () {
    this.listen()
  },
  beforeDestroy () {
    clearInterval(this.currentInterval)
    this.currentInterval = null
  },
  methods: {
    listen () {
      this.$bus.$on('auth-user', async status => {
        if (this.currentInterval != null) {
          clearInterval(this.currentInterval)
          this.currentInterval = null
        }
        if (status == true) {
          await this.makeUserSync()
          this.initIntervalSync()
        }
      })
    },
    /**
     * Initi user synchronization.
     *
     */
    initIntervalSync: function () {
      const _self = this
      this.currentInterval = setInterval(() => {
        _self.makeUserSync().catch(response => {
          // console.log(response.msg)
        })
      }, 60000)
    },
    /**
     * Make user synchronization.
     *
     *
     * @returns {Promise} Returns a promise according to the 'success' flag.
     */
    makeUserSync: async function (parent) {
      let _self = parent || this

      if (parent) {
        const snackbar = {
          message: _self.$t('Sincronizando dados'),
          duration: 4000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      }

      let date = _self.$store.getters['task/viewDate']
      let data = {
        pullTracker: {
          act: 'loginCompleto'
        },
        OS: window.jscd.os,
        osVersion: window.jscd.osVersion,
        screenSize: window.jscd.screen,
        bateria: _self.$store.getters['batteryStatus/level'] || window.localStorage.getItem('batteryStatus.level'),
        lastsinc: _self.$store.getters['synchronization/lastSync'] || window.localStorage.getItem('lastSync'),
        notid: _self.$store.getters['notification/notificationId'] || window.localStorage.getItem('notificationId'),
        data: _self.$options.filters.formatDate(date),
        locaisNoApp: 0
      }
      return new Promise(async (resolve, reject) => {
        if (!_self.token) {
          const ret = {msg: _self.$t('Token não preenchido!')}
          reject(ret)
        } else {
          serviceMakeUserSync(data).then(response => {
            user.synchronization(response, _self)
            metaData.synchronization(response, _self)
            lists.synchronization(response, _self)
            forms.synchronization(response, _self)
            locals.synchronization(response, _self)
            formWizard.synchronization(response, _self)
            saveRegistroPontoPosSync(response.folhaPonto)
            _self.$store.dispatch('synchronization/saveLastSync', {
              lastSync: response.lastsinc
            })
            resolve(response)
          }).catch((json) => {
            let data = json.data
            if (!json.jwt_auth && json.jwt_auth_error) {
              _self.$store.dispatch('user/logout')
              _self.$geolocation.stopBackground()
              _self.$router.push('/login')
              if (_self.bgGeo) {
                _self.bgGeo.stop()
              }
              const mensagem = json.jwt_auth_error
              reject(mensagem)
            } else {
              const mensagem = data.mensagem || data.error
              reject(mensagem)
            }
          })
        }
      })
    }
  }
}
