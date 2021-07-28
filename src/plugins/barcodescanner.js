export default {
  data () {
    return {
      barcodeScanner: null
    }
  },
  methods: {
    initBarCodeScanner: (barcodeScanner) => {
      this.barcodeScanner = barcodeScanner
    },
    getTextFromBarcode: () => {
      return new Promise((resolve, reject) => {
        let barcodeScanner = window.cordova.plugins.barcodeScanner
        barcodeScanner.scan(
          function (result) {
            resolve(result.text)
          },
          function () {
            let ret = {
              error: true,
              msg: 'Não foi possivel ler o código de barras'
            }
            reject(ret)
          },
          {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            resultDisplayDuration: 500, // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: false, // iOS
            disableSuccessBeep: false // iOS and Android
          }
        )
      })
    }
  }
}
