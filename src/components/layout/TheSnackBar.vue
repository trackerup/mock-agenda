<template>
    <div class="snackbar" :class="{'show': snackbar.isOpened}" >
      <div class="snackbar-content">
        <span>{{ snackbar.message }}
          <button class="mdl-button  mdl-button--primary" @click="$router.push(snackbar.action)" v-show="hasActiveApp(snackbar.route)" >
            {{ $t(snackbar.button) }}
          </button>
        </span>
        <i class="material-icons" @click="snackbar.isOpened = false">close</i>
      </div>
    </div>
</template>

<script>
import { empty } from '../../utils'

export default {
  name: 'TheSnackBar',
  data: () => ({
    snackbar: {
      isOpened: false,
      message: '',
      button: 'Ir',
      action: '',
      route: '',
      duration: 4000,
      position: 'center',
      timeout: null
    }
  }),
  mounted () {
    this.listen()
  },
  methods: {
    listen () {
      this.$bus.$on('showSnackBar', data => {
        clearTimeout(this.snackbar.timeoutID)
        this.snackbar.isOpened = true
        this.snackbar.message = !empty(data.message) ? data.message : this.snackbar.message
        this.snackbar.button = !empty(data.button) ? data.button : this.snackbar.button
        this.snackbar.route = !empty(data.route) ? data.route : ''
        this.snackbar.action = !empty(data.action) ? data.action : this.snackbar.action
        this.snackbar.duration = !empty(data.duration) ? data.duration : this.snackbar.duration
        this.snackbar.position = !empty(data.position) ? data.position : this.snackbar.position
        this.$forceUpdate()
        this.snackbar.timeoutID = setTimeout(() => {
          this.snackbar.isOpened = false
        }, this.snackbar.duration)
      })
    },
    hasActiveApp (appName) {
      if (appName == '') {
        return false
      }
      const link = this.$router.resolve({
        name: appName
      })
      if (link && link.href !== '/') {
        this.snackbar.action = link.href
        return true
      }
      return false
    }
  },
  destroyed () {
    this.$bus.$off('showSnackBar')
  }
}
</script>
