<template>
  <div id="app" class="page-container login">
    <div class="mdl-app">
      <div class="mdl-app-content">
        <div class="logo">
          <img src="../../assets/shared/logo_tracker_blank.png"/>
        </div>
        <div class="centered-container">
          <div class="mdl-content ">
            <!-- Matrícula -->
            <registration-field :model="user" />

            <!-- Senha -->
            <password-field :model="user" />

            <span class="mdl-error">{{error}}</span>

            <span class="mdl-toolbar-section-end">
              <button @click="login" class="mdl-button   orange" v-if="logando==false">
                {{ $t('Entrar') }}
              </button>
              <div class="loading" v-if="logando==true">
                <label>Por favor Aguarde</label>
                <div class="load"></div>
              </div>
            </span>
            <p class="mdl-toolbar-section-end">{{version}}</p>
            <span @click="goRecoverPasswordPage" class="mdl-toolbar-section-end recoverPaswordText">
              {{ $t('Recuperar') }}<br/> {{ $t('a senha') }}
            </span>
            <br />
            <button @click="goRecoverDataPage" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-toolbar-section-end" v-if="nodeEnv == 'development'">
              {{ $t('Recuperar Dados') }}<br/>
            </button>
          </div>
        </div>
        <!-- <div class="powered_by">
          powered by
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { RegistrationField, PasswordField } from '../../components/fields'
import { makeUserLogin } from '../../services/auth'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Synchronization from '../../plugins/synchronization'
import SynchronizationMessages from '../../plugins/synchronizationMessages'
import SynchronizationTasks from '../../plugins/tasks/synchronizationTasks'

export default {
  name: 'Login',
  components: {PasswordField, RegistrationField},
  data: () => ({
    error: '',
    user: {
      id: '',
      login: '',
      senha: '',
      loginApp: true
    },
    synchronization: null,
    synchronizationTasks: null,
    synchronizationMessages: null,
    version: process.env.VERSION,
    nodeEnv: process.env.NODE_ENV,
    logando: false
  }),
  computed: {
    ...mapGetters({
      // tarefas: 'task/tasks',
      token: 'user/token'
    })
  },
  methods: {
    goRecoverPasswordPage () {
      this.$router.push('/recover')
    },
    goRecoverDataPage () {
      this.$router.push('/recoverData')
    },
    login () {
      console.log('clicou login')
      this.error = ''
      this.logando = true
      makeUserLogin(this.user).then(({ data }) => {
        console.log('depois makeuserLogin')
        this.saveLogin(data)
      }).catch(({ data }) => {
        console.log('')
        this.logando = false
        this.error = this.$t(data.error)
        const snackbar = {
          message: this.$t(this.error)
        }
        this.$bus.$emit('showSnackBar', snackbar)
      })
    },
    async saveLogin (data) {
      const _self = this
      if (data.error) {
        this.error = this.$t(data.error)
        this.logando = false
      } else {
        await this.$store.dispatch('user/saveToken', {
          token: data.token
        })
        const snackbar = {
          message: this.$t('Login realizado com sucesso!')
        }
        this.$root.initNotification()
        this.$bus.$emit('showSnackBar', snackbar)
        this.synchronization.makeUserSync(this).then(async response => {
          _self.$bus.$emit('auth-user', true)
          await _self.$store.dispatch('user/updateUser', {
            user: response.user
          }).catch(() => {
            _self.$bus.$emit('auth-user', false)
          })
          await _self.synchronizationTasks.makeTasksSync(this, true).then(response => {
            _self.$bus.$emit('tasks-sync', true)
            _self.$router.push('/details')
          }).catch(() => {
            _self.$bus.$emit('tasks-sync', false)
          })
          await _self.synchronizationMessages.makeMessagesSync(_self).then(response => {
            _self.$bus.$emit('messages-sync', true)
          }).catch(response => {
            _self.$bus.$emit('messages-sync', false)
          })
        })
      }
    },
    adjustHeight () {
      let inputfield = document.getElementsByTagName('input')
      if (inputfield.length > 0) {
        let i = 0
        for (i; i < inputfield.length; i++) {
          inputfield[i].blur()
        }
      }
      let height = document.documentElement.clientHeight
      let documentElement = document.getElementById('app')
      if (documentElement != null) {
        documentElement.style.height = height + 'px'
      }

      documentElement = document.getElementsByClassName('mdl-app')[0]
      if (documentElement != null) {
        documentElement.style.height = height + 'px'
      }

      documentElement = document.getElementsByClassName('mdl-app-content')[0]
      if (documentElement != null) {
        documentElement.style.height = height + 'px'
      }
    },
    unSetHeight () {
      let documentElement = document.getElementsByClassName('mdl-app-content')[0]
      documentElement.style.height = 'unset'
    }
  },
  beforeMount () {
    this.logando = false
    const ComponentClass = Vue.extend(Synchronization)
    this.synchronization = new ComponentClass()
    const ComponentTasksClass = Vue.extend(SynchronizationTasks)
    this.synchronizationTasks = new ComponentTasksClass()
    let ComponentMessagesClass = Vue.extend(SynchronizationMessages)
    this.synchronizationMessages = new ComponentMessagesClass()
  },
  mounted () {
    this.adjustHeight()
  },
  destroyed () {
    this.unSetHeight()
  }

}
</script>

<style lang="scss" scoped>

.mdl-button--fab {
  margin-right: 4px;
  margin-left: auto;
}

.app-content {
  .mdl-button {
    background: #f26829 !important;
    color: #fff !important;
  }
  .mdl-textfield .mdl-textfield__label:after {
    background: #f26829 !important;
  }

  .mdl-textfield {

    &.mdl-textfield--floating-label.is-focused .mdl-textfield__label,
    &.mdl-textfield--floating-label.is-dirty .mdl-textfield__label,
    &.mdl-textfield--floating-label.has-placeholder .mdl-textfield__label {
      color: #f26829 !important;
    }
  }
}

</style>
<style scoped>
  .login{
    height: 100vh;
    background: #1a3444; /* Old browsers */
    background: -moz-linear-gradient(top,  #1a3444 0%, #1a3444 40Vh, #ffffff 40vh, #ffffff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  #1a3444 0%,#1a3444 40vh,#ffffff 40vh,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  #1a3444 0%,#1a3444 40vh,#ffffff 40vh,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a3444', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */

  }
  .logo{
    /* width: 283px; */
    height:40vh;
    width: 216px;
    /* background-color:#fff; */
    border-width: 0px;
    margin: 0 auto;
    /* background-image: url('../../assets/shared/logo_tracker_blank.png'); */
    /* background-size: contain; */
    /* background-repeat: no-repeat; */
    /* background-position: center center; */
    display: flex;
    align-items: center;
  }
  .mdl-app-content{
    width:100%;
    height: 100vh;
    box-sizing: border-box;
    position: relative;
    padding: 0
  }
  .centered-container {
    padding: 32px;
  }
  .centered-container .mdl-content {
    z-index: 1;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .recoverPaswordText{
    padding-top: 10px;
    padding-right: 10px;
    color:#CC0000;
    text-align: right;
    line-height: 14px;
    font-size: 12px;
    display: none;
  }
  .mdl-app{
    height: 100vh;
  }
  .centered-container.saved{
    top:50px;
  }
  .mdl-error{
    color:#CC0000;
    font-size: 12px;
    line-height: 14px;
    position: absolute;
    margin-top: -4px;
    letter-spacing: 0.034em;
  }
  .powered_by{
    position: absolute;
    bottom: 10px;
    right: 5px;
    font-size: 0.7em;
    background: url('../../assets/shared/tracker-up.png');
    background-size: 90px;
    background-position: right bottom;
    background-repeat: no-repeat;
    width: 95px;
    height: 45px;
  }
  .savedLogin{
    margin-top: 16vh;
  }
  .toolbarbg{
    position: fixed;
    width: 100%;
    display: flex;
  }
  .toolbarbg button{
    margin-left: 0px;
    margin-right: 0px;
  }
  .toolbarbg .pageTitle{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .mdl-app {
    position: unset
  }
</style>
