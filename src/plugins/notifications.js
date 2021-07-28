import { http } from '@/plugins/http'

export default {
  version: '1',
  mounted () {
    this.initNotification()
  },
  methods: {
    initNotification: function () {
      let _self = this
      console.log('INICIANDO ONESIGNAL')
      document.addEventListener('deviceready', function () {
        if (!('plugins' in window) || !('OneSignal' in window.plugins)) {
          console.log('This browser doesn\'t support OneSignal')
        } else {
          _self.initOnesignal()
        }
      }, false)
    },
    initOnesignal: function () {
      let _self = this
      var notificationOpenedCallback = function (jsonData) {
        if (jsonData.payload.additionalData != undefined) {
          console.log(jsonData.payload.additionalData)
        }
      }
      var notificationReceivedCallback = function (jsonData) {
        if (jsonData.payload.additionalData != undefined) {
          switch (jsonData.payload.additionalData.type) {
            case 'tarefa':
              _self.$bus.$emit('syncronization', 'tasks')
              _self.$bus.$emit('tasks-sync', true)
              break
            case 'mensagem':
              _self.$bus.$emit('force-messages-sync')
              break
          }
        }
      }
      window.plugins.OneSignal
        .startInit(process.env.ONESIGNAL_TOKEN)
        .handleNotificationOpened(notificationOpenedCallback)
        .handleNotificationReceived(notificationReceivedCallback)
        .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
        .endInit()
      window.plugins.OneSignal.getPermissionSubscriptionState(function (status) {
        if (status.subscriptionStatus.subscribed) {
          _self.$store.dispatch('notification/saveNotificationId', {
            notificationId: status.subscriptionStatus.userId
          })
          _self.registerNotId(status.subscriptionStatus.userId).catch(error => console.error(error))
        } else {
          _self.$store.dispatch('notification/clearNotificationId', { })
        }
      })
    },
    registerNotId: function (notId) {
      let user = this.$store.getters['user/user']
      if (user) {
        const data = {
          'pullTracker': {
            'act': 'registrarnNotID',
            'notID': notId,
            'user': user['id']
          }
        }
        return new Promise(async (resolve, reject) => {
          try {
            const response = await http.post('/index.php', data)
            const ret = {data: response.data}
            response.data.success ? resolve(ret) : reject(ret)
          } catch (error) {
            const ret = {data: {
              success: false,
              error: error.message
            }}
            reject(ret)
          }
        })
      }
    }
  }
}
