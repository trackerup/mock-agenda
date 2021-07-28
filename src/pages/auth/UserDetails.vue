<template>
  <div id="app" class="page-container user-details">
    <div class="mdl-app">
      <div class="mdl-app-content">
        <div class="logo">
            <img v-if="user && user.theme && user.theme.logo" :src="user.theme.logo"/>
            <img v-else src="../../assets/shared/logo_tracker_blank.png"/>
        </div>
        <div class="centered-container saved">
          <div class="mdl-content">
            <h4>{{userName}}</h4>
            <div class="user-info">
                {{userRegistration}}
                <br/>
                {{companyName}}
            </div>
            <template v-if="loaded">
              <h5>{{ $t('Iniciar Rastreamento') }}</h5>
              <button @click="continueLogin" class="mdl-button mdl-button--fab orange" >
                <i class="material-icons arrow-right">keyboard_arrow_right</i>
              </button>
            </template>
            <p>{{version}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import metaData from '@/plugins/persistence/entities/metaData'
import { makeUserStartBackground } from '@/services/auth'
import { registraEntrada, informUserStatus } from '@/plugins/persistence/entities/folhaPonto'

export default {
  name: 'UserDetails',
  data: () => ({
    userMeta: null,
    empresaMeta: null,
    version: process.env.VERSION,
    termos: null,
    loaded: false
  }),
  async created () {
    const _self = this
    this.userMeta = await metaData.getUserMeta([this.user.id, 'matricula'])
    this.empresaMeta = await metaData.getEmpresaMeta([this.user.empresa, 'CNPJ'])
    this.termos = await metaData.getUserMeta([this.user.id, '__user_background_accept'])
    if (!this.termos || !this.termos.meta_value) {
      _self.$bus.$emit('showLocationMessageEmitted', {
        opened: true,
        // Mudar o texto direto no arquivo de Tradução
        msg: _self.$t('Texto Termos de Localização')
      })
    }
  },
  computed: {
    ...mapGetters({
      tasks: 'task/tasks',
      user: 'user/user',
      viewDate: 'task/viewDate',
      startBackground: 'user/startBackground'
    }),
    userName () {
      return this.user ? this.user.nome : ''
    },
    userRegistration () {
      return this.userMeta ? this.userMeta.meta_value : ''
    },
    companyName () {
      return this.empresaMeta ? this.empresaMeta.meta_value : ''
    }
  },
  methods: {
    listen () {
      let _self = this
      this.$bus.$on('startBackground-ContinueLogin', async () => {
        console.log('Iniciando Background Geolocation e Continuando Login')
        // Activate the Synchronization
        _self.$geolocation.initGeolocation(_self, window.BackgroundGeolocation)
        if (_self.startBackground === 'true') {
          _self.$bus.$emit('startBackground', true)
          // eslint-disable-next-line
        }
      })
    },
    async continueLogin () {
      const _self = this
      // Activate the Synchronization
      this.$bus.$emit('auth-user', true)
      this.$bus.$emit('tasks-sync', true)
      await this.$store.dispatch('task/getTasks', {})
      informUserStatus({ act: 'initRastreamento' })
      _self.$geolocation.initGeolocation(_self, window.BackgroundGeolocation)
      _self.$geolocation.startBackground(_self)
      window.cordova.plugins.backgroundMode.enable()
      makeUserStartBackground(this.user).then(({ data }) => {
        console.log('Inicio Rastreamento')
        if (_self.tasks.travelStarted.length && window.jscd.os == 'iOS') {
          window.cordova.plugins.backgroundMode.enable()
          window.BackgroundGeolocation.changePace(true)
        } else {
          window.BackgroundGeolocation.changePace(false)
        }
      }).catch(({ data }) => {
        this.error = this.$t(data.error)
        const snackbar = {
          message: this.$t(this.error)
        }
        this.$bus.$emit('showSnackBar', snackbar)
      })
      this.$emit('authenticated', true)
      this.$router.push('/tasks')
      registraEntrada()
    },
    async unsaveLogin () {
      this.$geolocation.stopBackground(this)
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
      // Disable Synchronization
      this.$bus.$emit('auth-user', false)
    }
  },
  mounted () {
    const _self = this
    this.listen()
    if (this.$geolocation) {
      this.$geolocation.getStatusGeolocation().then(
        enabled => {
          if (enabled) {
            _self.continueLogin()
          } else {
            _self.loaded = true
          }
        }
      )
      // CASO O PLUGIN DER PROBLEMA E NÂO INICIALIZAR
      setTimeout(() => {
        _self.loaded = true
      }, 3000)
    } else {
      _self.loaded = true
    }
  },
  destroyed () {
    this.$bus.$off('startBackground-ContinueLogin')
  }
}
</script>

<style lang="scss" scoped>
.mdl-app-content {
  h4 {
    margin: 0;
    margin-top: 50px;
    line-height: 30px;
  }
  .user-info {
    letter-spacing: 0.018em;
    line-height: 20px;
    font-size: 14px;
    color: rgba(0,0,0,0.6);
    margin-bottom: 20px;
  }
  h5 {
    letter-spacing: 0.013em;
    margin: 0 0 12px;
    line-height: 24px;
  }
}

.mdl-app-content{
  width:100%;
  height: 100vh;
  padding: 0;
}

  .centered-container {
    padding: 32px;
  }

  .centered-container .mdl-content {
    z-index: 1;
    width: 100%;
    max-width: 400px;
    position: relative;
    text-align:center;
}
</style>
