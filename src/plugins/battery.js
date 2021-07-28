export default {
  version: '1',
  mounted () {
    this.initBatteryStatus()
  },
  methods: {
    initBatteryStatus: function () {
      let _self = this
      document.addEventListener('deviceready', function () {
        window.addEventListener('batterystatus', batteryStatus => {
          _self.$store.dispatch('batteryStatus/saveBatteryStatus', {
            batteryStatus: batteryStatus
          })
        }, false)
      }, false)
    }
  }
}
