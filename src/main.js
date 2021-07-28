import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import VueSignaturePad from 'vue-signature-pad'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

import 'material-design-lite/dist/material.deep_orange-orange.min.css'
import './assets/theme.scss'
import 'material-design-lite/material.min.js'

import './filters'

/**
 * This is the Vuex store and it is
 * avaible to all your components
 */
import store from '@/store'

/**
 * This is the Router
 */
import router from './router'

import jscd from '@/plugins/jscd'

import swipedetect from '@/plugins/swipedetect'

import checkDirty from '@/plugins/checkDirty'

/**
 * $http plugin based on axios
 */
import httpPlugin from '@/plugins/http'

/**
 * eventbus plugin
 */
import eventbus from './plugins/eventbus'

/**
 * Database plugins
 */
import { configDB } from './plugins/persistence/config'

/**
 * Internationalization
 */
import i18n from './plugins/translations'

/**
 * Vue directives
 */
import Mdl from './directives/Mdl.js'

/**
 * Battery Status
 */
import battery from './plugins/battery'

/**
 * Notifications (OneSignal)
 */
import notifications from './plugins/notifications'

/**
 * HTML Cam
 */
import './plugins/camHTML'

/**
 * DialogPolyfill
 */
import dialogPolyfill from './plugins/dialogPolyfill'

/**
 * BarCode Scanner
 */
import barcodescanner from './plugins/barcodescanner'

import routeService from './plugins/routeService'

import VueCordova from 'vue-cordova'
import money from 'v-money'

// register directive v-money and component <money>
Vue.use(money, {precision: 4})

Vue.use(VueCordova)
Vue.directive('mdl', Mdl)

/**
 * Make $bus avaible to all components
 */
Vue.use(eventbus)
Vue.use(swipedetect)
Vue.use(dialogPolyfill)

Vue.prototype.$swipedetect = swipedetect
Vue.prototype.$routeService = routeService
Vue.prototype.$dialogPolyfill = dialogPolyfill

Vue.use(VueLodash, {lodash: lodash})

/**
 * Make $http avaible to all components
 * Send store and router to httpPlugin (injection)
 */
Vue.use(httpPlugin, { store, router })

// Effortlessly keep vue-router and vuex store in sync.
sync(store, router) // https://github.com/vuejs/vuex-router-sync/tree/next

Vue.use(VueSignaturePad)

Vue.config.productionTip = false

const cordovaScript = document.createElement('script')
cordovaScript.setAttribute('type', 'text/javascript')
cordovaScript.setAttribute('src', process.env.BASE_URL + 'cordova.js')
document.body.appendChild(cordovaScript)

// disabilitando a detecção de telefone do ios
var metaTag = document.createElement('meta')
metaTag.name = 'format-detection'
metaTag.content = 'telephone=no'
document.getElementsByTagName('head')[0].appendChild(metaTag)

/* If env is dev create a interval for camera */
if (process.env.NODE_ENV == 'development') {
  setInterval(function () {
    let hasCamera = document.getElementsByClassName('cordova-camera-capture').length
    let dialogs = document.getElementsByTagName('dialog')

    for (var idxDialog in dialogs) {
      if (dialogs.hasOwnProperty(idxDialog)) {
        if (hasCamera >= 1) {
          if (dialogs[idxDialog].open && !dialogs[idxDialog].classList.contains('hasCamera')) {
            dialogs[idxDialog].classList.add('hasCamera')
            let fragment = document.createDocumentFragment()
            fragment.appendChild(document.getElementsByClassName('cordova-camera-capture')[0])
            dialogs[idxDialog].appendChild(fragment)
          }
        } else {
          if (dialogs[idxDialog].classList.contains('hasCamera')) {
            dialogs[idxDialog].classList.remove('hasCamera')
          }
        }
      }
    }
  }, 1000)
}

var trackerup = new Vue({
  router,
  i18n,
  store,
  eventbus,
  dialogPolyfill,
  el: '#app',
  mixins: [jscd, swipedetect, battery, notifications, routeService, dialogPolyfill, barcodescanner, checkDirty],
  components: { App },
  template: '<App/>',
  data: {
    dialogOpen: false,
    cardContent: false
  }
})
window.trackerup = trackerup

var storedState = window.localStorage.getItem(process.env.APP_STORAGE_KEY)
if (storedState) {
  try {
    window.appState = JSON.parse(storedState)
  } catch (error) {
    window.appState = {
      takingPicture: false,
      imageUri: '',
      fieldId: null,
      result: false,
      error: null,
      routeName: null
    }
  }
} else {
  window.appState = {
    takingPicture: false,
    imageUri: '',
    fieldId: null,
    result: false,
    error: null,
    routeName: null
  }
}
window.cordovaIsReady = false
Vue.cordova.on('deviceready', () => {
  console.log('Cordova : device is ready !')
  window.cordovaIsReady = true
  // eslint-disable-next-line
  StatusBar.overlaysWebView(false)
  // eslint-disable-next-line
  StatusBar.backgroundColorByHexString("#000d1d")
  // eslint-disable-next-line
  StatusBar.styleLightContent()

  document.addEventListener('backbutton', (e) => {
    e.preventDefault()
  }, false)
  var requestedBytes = 1024 * 1024 * 150 // 100MB
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
  if (navigator.webkitPersistentStorage) {
    navigator.webkitPersistentStorage.requestQuota(
      requestedBytes, function (grantedBytes) {
        window.requestFileSystem(window.PERSISTENT, grantedBytes, function (fileSystem) {
          window.rootFS = fileSystem.root
        }, function (error) {
          console.log(error)
        })
      }, function (e) {
        console.log('Error', e)
      }
    )
  } else {
    window.requestFileSystem(window.PERSISTENT, requestedBytes, function (fileSystem) {
      window.rootFS = fileSystem.root
    }, function (error) {
      console.log(error)
    })
  }
  configDB()
  Vue.cordova.on('pause', () => {
    window.localStorage.setItem('pause', 'pausou')
  })
  Vue.cordova.on('resume', async (event) => {
    console.log('resume app')
    // Check to see if we need to restore an image we took
    if (!event) {
      trackerup.$bus.$emit('loading', false)
    } else {
      if (window.appState.takingPicture && event.pendingResult) {
        trackerup.$bus.$emit('loading', true)
        // Figure out whether or not the plugin call was successful and call
        // the relevant callback. For the camera plugin, "OK" means a
        // successful result and all other statuses mean error

        if (event.pendingResult.pluginStatus === 'OK') {
          window.appState.result = event.pendingResult.result
          trackerup.$bus.$emit('loading', false)
        } else {
          window.appState.result = false
          window.appState.error = event.pendingResult
          trackerup.$bus.$emit('loading', false)
        }
      } else if (window.appState.takingPicture && !event.pendingResult) {
        trackerup.$bus.$emit('loading', false)
        window.appState = {
          takingPicture: false,
          imageUri: '',
          fieldId: null,
          result: false,
          error: null
        }
      }
      if (event.pendingResult && event.pendingResult.pluginServiceName === 'Camera') {
        // como deu erro trocamos para camera alternativa para as próximas
        window.localStorage.setItem('camHTMLService', 'enabled')
      }
    }
  })
})
