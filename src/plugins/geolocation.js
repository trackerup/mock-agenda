import { mapGetters } from 'vuex'
import store from '@/store'
import { waitForCordovaReady } from '@/utils'

export default {
  data () {
    return {
      bgGeo: null,
      options: null
    }
  },
  computed: {
    ...mapGetters({
      token: 'user/token',
      user: 'user/user'
    })
  },
  created () {
    const _self = this
    this.$bus.$off('initGeolocation')
    this.$bus.$off('startBackground')
    this.$bus.$on('stopBackground', _self.stopBackground)
  },
  initGeolocation: function (trackerup, BackgroundGeolocation) {
    return new Promise((resolve, reject) => {
      waitForCordovaReady().then(() => {
        window.BackgroundGeolocation = BackgroundGeolocation

        // Listen to location events & errors.
        window.BackgroundGeolocation.onLocation(this.callbackFn, this.failureFn)

        // Fired whenever state changes from moving->stationary or vice-versa.
        window.BackgroundGeolocation.onMotionChange(this.onMotionChange)

        // Fired whenever a geofence transition occurs.
        window.BackgroundGeolocation.onGeofence(this.onGeofence)

        // Fired whenever an HTTP response is received from your server.
        window.BackgroundGeolocation.onHttp(this.onHttp)

        this.setConfig(trackerup).then(() => {
          window.BackgroundGeolocation.ready(
            trackerup.$geolocation.options
          ).then((state) => {
            window.BackgroundGeolocation.requestPermission()
            console.log('BackgroundGeolocation:state', state)
            // initialize whith data
            this.getLocation(trackerup)
          }).catch(response => {
            console.log(response)
          })
        })
      })
    })
  },
  getStatusGeolocation: function (trackerup) {
    return new Promise((resolve, reject) => {
      waitForCordovaReady().then(() => {
        window.BackgroundGeolocation.ready({
          reset: false
        }, function (state) {
          resolve(state.enabled)
        })
      })
    })
  },
  startBackground: (trackerup) => {
    return new Promise((resolve, reject) => {
      waitForCordovaReady().then(() => {
        window.BackgroundGeolocation.ready(
          trackerup.$geolocation.options,
          state => {
            if (!state.enabled) {
              window.BackgroundGeolocation.start().then(() => {
                console.log('- BackgroundGeolocation tracking started')
                trackerup.$geolocation.getLocation(trackerup)
                resolve()
              })
            }
          }
        )
      })
    })
  },
  stopBackground: () => {
    return new Promise((resolve, reject) => {
      waitForCordovaReady().then(() => {
        window.BackgroundGeolocation.stop().then(() => {
          console.log('- BackgroundGeolocation tracking stoped')
          resolve()
        })
      })
    })
  },
  getLocationConfig: () => {
    return new Promise((resolve, reject) => {
      waitForCordovaReady().then(() => {
        window.BackgroundGeolocation.getProviderState().then((providerState) => {
          console.log('- Provider state: ', providerState)
          resolve(providerState)
        })
      })
    })
  },
  startTravelling: () => {
    waitForCordovaReady().then(() => {
      try {
        if (window.jscd.os == 'iOS') {
          window.BackgroundGeolocation.changePace(true)
        }
      } catch (error) {
        console.log(error)
      }
    })
  },
  stopTravelling: () => {
    waitForCordovaReady().then(() => {
      window.BackgroundGeolocation.changePace(false)
    })
  },
  callbackFn: (response) => {
    if (!response.coords) {
      if (typeof response.then == 'function') {
        response.then((response) => {
          store.dispatch('user/setCurrentCoords', {coords: response.coords})
        })
      }
      return false
    }
    store.dispatch('user/setCurrentCoords', {coords: response.coords})
  },
  failureFn: error => {
    console.log('BackgroundGeoLocation error', error)
  },
  onMotionChange: event => {
    console.log('[motionchange] -', event.isMoving, event.location)
    if (!event.location || !event.location.coords) {
      return false
    }
    store.dispatch('user/setCurrentCoords', {coords: event.location.coords})
  },
  onGeofence: geofence => {
    console.log('[geofence] -', geofence.identifier, geofence.location)
  },
  onHttp: response => {
    console.log('[http] -', response.success, response.status, response.responseText)
  },
  setConfig: (trackerup) => {
    try {
      // BackgroundGeoLocation is highly configurable.
      trackerup.$geolocation.options = {
        // Geolocation config
        desiredAccuracy: (typeof window.BackgroundGeolocation.DESIRED_ACCURACY_HIGH != 'undefined') ? window.BackgroundGeolocation.DESIRED_ACCURACY_HIGH : 10,
        distanceFilter: 10,
        stationaryRadius: 30,
        // Activity Recognition config
        activityRecognitionInterval: 5000,
        locationUpdateInterval: 1000,
        fastestLocationUpdateInterval: 5000,
        // stopTimeout: 5,
        preventSuspend: true,
        foregroundService: true,
        // Application config
        stopOnTerminate: false,
        startOnBoot: true,
        // HTTP / SQLite config
        url: process.env.API_URL + '?pullTracker[act]=registerPositionTeste',
        method: 'POST',
        autoSync: true,
        maxDaysToPersist: 3,
        headers: {
          'Authorization': 'Bearer ' + trackerup.$store.getters['user/token']
        },
        params: {
          'pullTracker': {
            'id': trackerup.$store.getters['user/user'].id
          }
        },
        schedule: [
          '2-6 7:00-19:00',
          '7 7:00-12:00'
        ],
        // Logging and Debug
        debug: false, // <-- Debug sounds & notifications.
        logLevel: window.BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        logMaxDays: 3, // <-- 3 days of logs
        locationAuthorizationRequest: 'Always',
        disableLocationAuthorizationAlert: true,
        locationAuthorizationAlert: {
          titleWhenNotEnabled: trackerup.$t('Serviços de localização não estão ativos!'),
          titleWhenOff: trackerup.$t('Serviço de localização desligados'),
          instructions: trackerup.$t('Você deve configurar para sempre habilitar os serviços de localização'),
          cancelButton: trackerup.$t('Cancelar'),
          settingsButton: trackerup.$t('Configuração')
        },
        backgroundPermissionRationale: {
          title: 'Permitir que TrackerUp acesse o local deste dispositivo em segundo plano?',
          message: 'Para que seja possível rastrear sua atividade em segundo plano, favor habilitar a permissão de acesso ao GPS',
          positiveAction: 'Mude para {backgroundPermissionOptionLabel}',
          negativeAction: 'Cancelar'
        },
        notification: {
          title: 'TrackerUp',
          text: trackerup.$t('Localização em segundo Plano ativa'),
          smallIcon: 'drawable/icont',
          largeIcon: 'mipmap/icon'
        }
      }
      return window.BackgroundGeolocation.configure(trackerup.$geolocation.options)
    } catch (error) {

    }
  },
  getLocation: function (trackerup) {
    waitForCordovaReady().then(() => {
      try {
        return window.BackgroundGeolocation.getCurrentPosition(trackerup.$geolocation.options
          , trackerup.$geolocation.callbackFn
          , trackerup.$geolocation.failureFn)
      } catch (error) {
        trackerup.$geolocation.failureFn()
      }
    })
  }
}
