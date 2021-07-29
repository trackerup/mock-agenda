<template>
  <div class="app-content">
    <div class="page-container mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
      <header class="demo-header mdl-layout__header" :class="{'hide': this.$root.dialogOpen}" id="header">
        <div class="mdl-layout__header-row">
          <button v-show="!backMenu" @click="menuVisible = !menuVisible" class="mdl-button mld-button-icon-text menu">
            <i class="material-icons">menu</i>
            {{ $t('Menu') }}
          </button>
          <button @click="clickBack" v-show="backMenu" class="mdl-button mld-button-icon-text button-back">
            <i class="material-icons">chevron_left</i>
            {{ $t('Voltar') }}
          </button>
          <div class="mdl-layout-spacer"></div>
          <span class="mdl-layout-title ">{{pageTitle}}</span>
          <div class="mdl-layout-spacer"></div>
          <div v-show="!mapMenu"  class="mdl-layout-spacer"></div>
          <button @click="$router.push(routeMap)" v-show="mapMenu" class="mdl-button mld-button-icon-text mapa">
            {{ $t('Mapa') }}
            <i class="material-icons">map</i>
          </button>
        </div>
      </header>
      <div class="mdl-layout__drawer" :class="{'is-visible': menuVisible}">
        <div class="client-logo">
            <img src="./assets/shared/logo_tracker_blank.png"/>
        </div>
        <div class="agent-info">
          <h5>{{ userName }}</h5>
          <div class="matricula">{{ userRegistration }}</div>
        </div>
        <hr class="hr-agent">
        <ul class='mdl-list'>
          <li class="mdl-list__item" :class="{'ativo': currentRoute == 'tasks.index'}" @click="toPage('/tasks')">
            <i class="material-icons mdl-list__item-icon">location_on</i>
            <span class="mdl-list__item-primary-content">{{ $t('Tarefas em aberto') }}</span>
          </li>
          <li class="mdl-list__item" :class="{'ativo': currentRoute == 'planning'}" @click="toPage('/planning')">
            <i class="material-icons mdl-list__item-icon">location_on</i>
            <span class="mdl-list__item-primary-content">{{ $t('Planejamento') }}</span>
          </li>
          <li class="mdl-list__item" :class="{'ativo': currentRoute == 'tasks.completed'}" @click="toPage('/completedTasks')">
            <i class="material-icons mdl-list__item-icon">check_circle_outline</i>
            <span class="mdl-list__item-primary-content">{{ $t('Tarefas concluídas') }}</span>
          </li>
          <li class="mdl-list__item" :class="{'ativo': currentRoute == 'task.future'}" @click="toPage('/futureTasks')">
            <i class="material-icons mdl-list__item-icon">list_alt</i>
            <span class="mdl-list__item-primary-content">{{ $t('Tarefas futuras') }}</span>
          </li>
          <li class="mdl-list__item" :class="{'ativo': currentRoute == 'chat.messages'}" @click="toPage('/messages')">
            <i class="material-icons mdl-list__item-icon">message</i>
            <span class="mdl-list__item-primary-content">{{ $t('Mensagens') }}</span>
          </li>
          <li class="mdl-list__item">
            <i class="material-icons mdl-list__item-icon">access_time</i>
            <span class="mdl-list__item-primary-content">{{ $t('Intervalo de almoço') }}</span>
          </li>
          <li class="mdl-list__item">
            <i class="material-icons mdl-list__item-icon">location_off</i>
            <span class="mdl-list__item-primary-content">{{ $t('Encerrar rastreamento') }}</span>
          </li>
          <li class="mdl-list__item">
            <i class="material-icons mdl-list__item-icon">sync</i>
            <span class="mdl-list__item-primary-content">{{ $t('Sincronizar Tudo') }}</span>
          </li>
          <!-- <li class="mdl-list__item" :class="{'ativo': currentRoute == 'tasks.form.form'}" @click="toPage('/task/1/form/1')">
            <i class="material-icons mdl-list__item-icon">sync</i>
            <span class="mdl-list__item-primary-content">{{ $t('Formulario') }}</span>
          </li> -->
          <li class="mdl-list__item align-bottom" @click="toPage('/settings')">
            <i class="material-icons mdl-list__item-icon">tune</i>
            <span class="mdl-list__item-primary-content">{{ $t('Configurações') }}</span>
          </li>
        </ul>
      </div>
      <main class="mdl-layout__content panel">
        <router-view
          @changeParams="changePageParams"
          v-show="!loading"
        />
        <div v-show="loading"
          class="loading-processamento"
        >
          {{$t('Aguarde processamento...')}}
          <div id="p2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate is-active"></div>
          <div class="demo-card-square mdl-card mdl-shadow--2dp">
            <img src="./assets/shared/logo_tracker_blank.png"/>
          </div>
          <button  @click="cancelLoading" v-if="showCancelLoading" class="mdl-button mld-button-icon-text mapa">
            {{ $t('Cancelar') }}
          </button>
        </div>
      </main>
      <div class="mdl-layout__obfuscator" v-if="authenticated" @click="menuVisible = !menuVisible" :class="{'is-visible': menuVisible}"></div>
    </div>
    <the-snack-bar></the-snack-bar>
    <custom-style></custom-style>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TheSnackBar from './components/layout/TheSnackBar'
import CustomStyle from './components/layout/CustomStyle'
import metaData from '@/plugins/persistence/entities/metaData'

export default {
  name: 'App',
  components: {TheSnackBar, CustomStyle},
  data () {
    return {
      userMeta: null,
      empresaMeta: null,
      pageTitle: '',
      authenticated: false,
      menuVisible: false,
      mapMenu: true,
      routeMap: '/routeMap',
      backMenu: false,
      showErrors: {
        opened: false,
        data: {
          msg: this.$t('Erro')
        }
      },
      showMessage: {
        opened: false,
        data: {
          msg: this.$t('Alerta')
        }
      },
      showLocationMessage: {
        opened: false,
        data: {
          msg: this.$t('Texto Termos de Localização')
        }
      },
      loading: false,
      showCancelLoading: false,
      error: null,
      synchronizationTasks: null
    }
  },
  computed: {
    currentRoute () {
      return this.$route.name
    },
    ...mapGetters({
      user: 'user/user',
      token: 'user/token'
    }),
    userName () {
      return this.user ? this.user.nome : ''
    },
    userRegistration () {
      return this.userMeta ? this.userMeta.meta_value : ''
    },
    imageLoading () {
      // return 'data:image/jpeg;base64,' + window.appState.result
      return './assets/shared/tracker-up.png'
    },
    seeFutureTask () {
      const _self = this
      const today = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]
      if (typeof _self.$store.getters['task/tasks'].all == 'undefined') {
        return false
      }
      return !(_self.$store.getters['task/tasks'].all.some(elem => (elem.dataTarefa == today) && (elem.status != 'concluida' && elem.status != 'malsucedida')))
    }
  },
  watch: {
    showErrors: {
      handler: function (val, oldVal) {
        if (val.opened == true) {
          this.$el.querySelector('#dialog-error').showModal()
        }
        if (val.opened == false) {
          this.$el.querySelector('#dialog-error').close()
        }
      },
      deep: true
    },
    showMessage: {
      handler: function (val, oldVal) {
        if (val.opened == true) {
          this.$el.querySelector('#dialog-message').showModal()
        }
        if (val.opened == false) {
          this.$el.querySelector('#dialog-message').close()
        }
      },
      deep: true
    },
    showLocationMessage: {
      handler: function (val, oldVal) {
        if (val.opened == true) {
          this.$el.querySelector('#dialog-location').showModal()
        }
        if (val.opened == false) {
          this.$el.querySelector('#dialog-location').close()
        }
      },
      deep: true
    }
  },
  updated () {
    if (this.user && !this.userMeta) {
      this.userMeta = metaData.getUserMeta([this.user.id, 'matricula'])
    }
  },
  beforeMount () {
  },
  mounted () {
    this.$router.push('/schedule')
  },
  destroyed () {
  },
  methods: {
    clickBack () {
      let _self = this
      try {
        if (_self.pageTitle != _self.$t('Em atendimento')) {
          _self.$router.back()
        } else {
          _self.$router.push('/tasks')
        }
      } catch (error) {
        _self.$router.push('/tasks')
      }
    },
    changePageParams (params) {
      if (typeof (params.pageTitle) != 'undefined') {
        this.pageTitle = params.pageTitle
      }
      if (typeof (params.mapMenu) != 'undefined') {
        this.mapMenu = params.mapMenu
      }
      if (typeof (params.backMenu) != 'undefined') {
        this.backMenu = params.backMenu
      }
      if (typeof (params.routeMap) != 'undefined') {
        this.routeMap = params.routeMap
      } else {
        this.routeMap = '/routeMap'
      }
    },
    toPage (path) {
      this.$router.push(path)
      this.menuVisible = false
    }
  }
}
</script>
<style>

.logo{
  border: solid #ccc 2px;
  border-radius:0 5px 0 5px;
  width: 90%;
  margin: 10px auto;
}
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.toolbarbg button{
  margin-left: 0px;
  margin-right: 0px;
}

</style>
<style lang="scss" scoped>
.app-content .mdl-dialog.full {
   .page-content {
    padding: 8px;
    text-align: justify;
  }
  .mdl-dialog__actions {
    padding: 8px;
  }
}
</style>
