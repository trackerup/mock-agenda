<template>
<div>
  <div class="content-page">

      <div class="mdl-card" @click="sendData">
        <div class="row">
          <div class="icon">
            <i class="material-icons black">save</i>
          </div>
          <h4 class="title">{{ $t('Relatório de uso do app') }}</h4>
        </div>
        <div class="text">{{ $t('Clique para enviar um relatório do sistema para o suporte. Essa ação pode levar alguns minutos.') }}</div>
      </div>

      <div class="mdl-card"  @click="sincAll">
        <div class="row">
          <div class="icon">
            <i class="material-icons black">sync</i>
          </div>
          <h4 class="title">{{ $t('Sincronizar tudo') }}</h4>
        </div>
        <div class="text">{{ $t('Clique para enviar todos os dados deste aparelho. Essa ação pode levar alguns minutos.') }}</div>
      </div>

      <div class="mdl-card" @click="switchCam">
        <div class="row">
          <div class="icon">
            <i class="material-icons black">camera</i>
          </div>
          <h4 class="title">
            {{typeCamTitle}}
          </h4>
        </div>
        <div class="text">
          {{typeCamContent}}
        </div>
      </div>

      <div class="mdl-card" @click="deleteAllData">
        <div class="row">
          <div class="icon">
            <i class="material-icons black">delete</i>
          </div>
          <h4 class="title">{{ $t('Limpar Dados') }}</h4>
        </div>
        <div class="text">{{ $t('Clique para limpar dados do aplicativo. Será necessário realizar login novamente.') }}</div>
      </div>

      <div class="mdl-card" @click="logout">
        <div class="row">
          <div class="icon">
            <i class="material-icons black">input</i>
          </div>
          <h4 class="title">{{ $t('Sair do app') }}</h4>
        </div>
        <div class="text">{{ $t('Clique para sair do aplicativo. Será necessário realizar login novamente.') }}</div>
      </div>

      <div class="mdl-card">
        <select @change="changeLocale" v-model="lang">
          <option value="pt">{{ $t('Português') }}</option>
          <option value="en">{{ $t('Inglês') }}</option>
          <option value="es">{{ $t('Espanhol') }}</option>
        </select>
      </div>

  </div>
  <dialog class="mdl-dialog full full-fixed" id="dialogFormDelete">
    <div class="mdl-dialog__content">
      <h5>{{ $t('Realmente deseja excluir todos os dados do aplicativo?') }}</h5>
      <h5 class="orange">
        {{ $t('Esta ação é irrevesível.') }}
      </h5>
      {{ $t(' O aplicativo será fechado e todos os dados serão perdidos!') }}
      <div class="mdl-dialog__actions">
        <button type="button" v-if="deleteBloqued > 0" class="mdl-button grey">{{ $t('Aguarde ') + deleteBloqued }}</button>
        <button type="button" v-if="deleteBloqued == 0" class="mdl-button orange" @click="confirmDeleteAllData()">{{ $t('Limpar Dados') }}</button>
        <button type="button" class="mdl-button close grey" @click="closeDeleteAllData()">{{ $t('Cancelar') }}</button>
      </div>
    </div>
  </dialog>
</div>
</template>

<script>

import { loadMessages } from '../../plugins/translations'
import { resetDB } from '@/plugins/persistence/config/index.js'
import { prepareForSincAll } from '@/plugins/persistence/entities/tarefa'
import { makeUserStopBackground } from '@/services/auth'
import { setTimeout } from 'timers'
import { exportData } from '@/plugins/persistence/services/export'
import { sendJsonData } from '@/services/synchronization'

export default {
  name: 'Settings',
  data: () => ({
    lang: '',
    deleteBloqued: 5,
    typeCamNow: '',
    typeCamTitle: '',
    typeCamContent: ''
  }),
  async mounted () {
    this.lang = await this.$store.getters['lang/locale']
    this.$emit('changeParams', {
      pageTitle: this.$t('Configurações'),
      mapMenu: false,
      backMenu: false
    })
    this.$dialogPolyfill.doDialog('dialogFormDelete')
  },
  created () {
    this.verifyCam()
  },
  methods: {
    verifyCam () {
      let camHTML = window.localStorage.getItem('camHTMLService') || 'disabled'

      if (camHTML == 'enabled') {
        this.typeCamNow = 'câmera alternativa'
        this.typeCamTitle = 'Câmera nativa'
        this.typeCamContent = 'Clique para alterar para câmera nativa'
      } else {
        this.typeCamNow = 'câmera nativa'
        this.typeCamTitle = 'Câmera alternativa'
        this.typeCamContent = 'Clique para alterar para câmera alternativa'
      }
    },
    switchCam () {
      let camHTML = window.localStorage.getItem('camHTMLService')
      camHTML = (camHTML == 'enabled') ? 'disabled' : 'enabled'
      window.localStorage.setItem('camHTMLService', camHTML)
      this.verifyCam()

      const typeCamNow = this.typeCamNow
      const snackbar = {
        message: this.$t(`Alterado para ${typeCamNow}`),
        duration: 2000
      }
      this.$bus.$emit('showSnackBar', snackbar)
    },
    async logout () {
      this.$store.dispatch('notification/saveNotificationId', {
        notificationId: 'false'
      })
      window.localStorage.setItem('notificationId', 'false')
      this.$bus.$emit('tasks-sync', false)
      this.$bus.$emit('auth-user', false)
      this.$bus.$emit('messages-sync', false)
      /**
       * task/PR-804 - Rastreamento em segundo plano
       * Adicionado chamada de função que encerra o rastreamento idem a utilizada na função 'Encerrar Atendimento'
       */
      this.$root.registerNotId('false').catch(error => console.error(error))
      this.$geolocation.stopBackground(this)
      window.cordova.plugins.backgroundMode.disable()
      await makeUserStopBackground(this.user).then(({ data }) => {
        console.log('stop rastreamento')
      }).catch(({ data }) => {
        this.error = this.$t(data.error)
        const snackbar = {
          message: this.$t(this.error)
        }
        this.$bus.$emit('showSnackBar', snackbar)
      })
      await resetDB()
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    async sincAll () {
      window.inSync = false
      let _self = this
      this.$bus.$on('tasks-sync-finish', () => {
        _self.$bus.$off('tasks-sync-finish')
        const snackbar = {
          message: _self.$t('Sincronização finalizada'),
          duration: 4000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      })
      const snackbar = {
        message: _self.$t('Sincronizando todos os dados'),
        duration: 5000
      }
      this.$bus.$emit('showSnackBar', snackbar)
      prepareForSincAll().then((tarefas) => {
        this.$bus.$emit('auth-user', true)
        this.$bus.$emit('tasks-sync', true)
      })
    },
    async changeLocale (e) {
      const locale = e.target.value
      loadMessages(locale)
      await this.$store.dispatch('lang/setLocale', { locale })
    },
    deleteAllData () {
      this.deleteBloqued = 5
      this.$el.querySelector('#dialogFormDelete').showModal()
      setTimeout(this.countDownDeleteBloqued, 1000)
    },
    countDownDeleteBloqued () {
      this.deleteBloqued--
      if (this.deleteBloqued > 0) {
        setTimeout(this.countDownDeleteBloqued, 1000)
      }
    },
    confirmDeleteAllData () {
      var success = function (status) {
        alert('Message: ' + status)
      }

      var error = function (status) {
        alert('Error: ' + status)
      }
      try {
        window.ClearData.cache(success, error)
      } catch (e) {
        console.log(e)
      }
      this.$el.querySelector('#dialogFormDelete').close()
    },
    closeDeleteAllData () {
      this.$el.querySelector('#dialogFormDelete').close()
    },
    sendData () {
      const _self = this
      const snackbar = {
        message: this.$t('Enviado todos os dados'),
        duration: 5000
      }
      this.$bus.$emit('showSnackBar', snackbar)
      exportData().then(jsonString => {
        sendJsonData({'jsonString': jsonString, 'localStorage': JSON.stringify(window.localStorage)}).then((retorno) => {
          const snackbar = {
            message: _self.$t(retorno.mensagem),
            duration: 5000
          }
          _self.$bus.$emit('showSnackBar', snackbar)
        })
      }).catch(err => {
        alert('Error: ' + err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mdl-card {
  .row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .icon {
    min-width: 24px;
    max-width: 24px;
    flex: 0 1 24px;
    margin-right: 8px;
    i {
      line-height: 29px;
    }
  }
  .title {
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
    margin: 0;
  }
  .text {
    font-size: 14px;
    //letter-spacing: 0.018em;
    line-height: 20px;
    color: rgba(0,0,0,0.60);
  }
}
.content-page {
  padding-top: 10px;
  width: 100%;
}
select {
  border: 0;
  padding: 10px 16px;
  width: 100%;
  background: none;
  outline: none;
}

</style>
