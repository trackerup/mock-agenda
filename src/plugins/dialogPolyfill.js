
import DialogPolyfill from 'dialog-polyfill'

export default {
  data () {
    return {
      timeout: 1000
    }
  },
  doDialog: function (id) {
    setTimeout(() => {
      var divs = document.getElementsByTagName('dialog')
      for (let i = 0; i < divs.length; ++i) {
        DialogPolyfill.registerDialog(divs[i])
      }
    }, this.timeout)
  }
}
