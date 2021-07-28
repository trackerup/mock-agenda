'use strict'

import Vue from 'vue'
import './style.scss'

Plugin.install = function (Vue) {
  Vue.camHTML = function (resolve, fail) {
    class CamHTMLClass {
      constructor (resolve, fail) {
        this.permissions = null
        this.resizeTimeout = null
        this.stream = null

        Vue.cordova.on('deviceready', () => {
          this.permissions = window.cordova.plugins.permissions
        })

        // setup elements
        this.assembleUI()
        this.resizeThrottled()

        window.addEventListener('resize', this.resizeThrottled())

        this.permissions.checkPermission(this.permissions.CAMERA,
          (status) => {
            if (status.hasPermission && status.hasPermission === true) {
              this.startStreaming()
            } else {
              this.permissions.requestPermission(this.permissions.CAMERA,
                (status) => {
                  if (status.hasPermission && status.hasPermission === true) {
                    this.startStreaming()
                  } else {
                    this.removeLayer()
                    fail('Permissão de câmera negada!')
                  }
                },
                () => {
                  this.removeLayer()
                  fail('Não possui permissão de câmera!')
                }
              )
            }
          }, null
        )

        // cancel action
        this.btCancelar.onclick = () => {
          this.closeCaptureMode()
          fail('no image')
        }

        // capture action
        this.btCapture.onclick = () => {
          let width = this.video.videoWidth
          let height = this.video.videoHeight
          this.canvas.width = width
          this.canvas.height = height
          this.canvas.getContext('2d').drawImage(this.video, 0, 0, width, height)
          this.preview.style.display = 'block'
        }

        // confirm action
        this.btConfirm.onclick = () => {
          let dataURL = this.canvas.toDataURL('image/jpeg')
          this.closeCaptureMode()
          this.preview.style.display = 'none'
          let img = dataURL.substring(23)
          resolve(img)
        }

        // retake action
        this.btRetake.onclick = () => {
          this.preview.style.display = 'none'
        }
      }

      // Fecha o modo de captura
      closeCaptureMode = () => {
        this.removeLayer()
        this.stopStreaming()
      }

      // Tamanho inicial
      resizeThrottled = () => {
        if (!this.resizeTimeout) {
          this.resizeTimeout = setTimeout(() => {
            this.resizeUI()
            this.resizeTimeout = undefined
          }, 66)
        }
      }

      // Criação da UI
      assembleUI = () => {
        var icon = document.createElement('i')
        // camera
        var camera = this.camera = document.createElement('dialog')
        camera.className = 'mdl-dialog full full-fixed image-capture-camera'
        camera.id = 'dialog-photo'
        document.body.appendChild(camera)

        // video
        var video = this.video = document.createElement('video')
        video.className = 'image-capture-video'
        video.autoplay = true
        camera.appendChild(video)

        // bt capture
        var btCapture = this.btCapture = document.createElement('div')
        btCapture.className = 'image-capture-capture'
        btCapture.appendChild(document.createTextNode('◉'))
        camera.appendChild(btCapture)

        // preview
        var preview = this.preview = document.createElement('div')
        preview.style.display = 'none'
        preview.className = 'image-capture-preview'
        camera.appendChild(preview)

        // canvas
        var canvas = this.canvas = document.createElement('canvas')
        canvas.className = 'image-capture-canvas'
        preview.appendChild(canvas)

        // bt confirm
        var btConfirm = this.btConfirm = document.createElement('div')
        btConfirm.className = 'image-capture-confirm'
        icon = document.createElement('i')
        icon.className = 'material-icons'
        icon.innerHTML = 'checkbox_marked_circle'
        btConfirm.appendChild(icon)
        preview.appendChild(btConfirm)

        // bt retake
        var btRetake = this.btRetake = document.createElement('div')
        btRetake.className = 'image-capture-retake'
        icon = document.createElement('i')
        icon.className = 'material-icons'
        icon.innerHTML = 'cancel'
        btRetake.appendChild(icon)
        preview.appendChild(btRetake)

        // bt cancel
        var btCancelar = this.btCancelar = document.createElement('div')
        btCancelar.className = 'image-capture-cancel'
        icon = document.createElement('i')
        icon.className = 'material-icons'
        icon.innerHTML = 'close_circle'
        btCancelar.appendChild(icon)
        camera.appendChild(btCancelar)
      }

      // Setar o tamanho ao fazer redimencionamento
      resizeUI = () => {
        var vw = this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        var vh = this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        this.camera.style.width = vw + 'px'
        this.camera.style.height = vh + 'px'
        this.video.style.width = vw + 'px'
        this.video.style.height = vh + 'px'
        this.canvas.width = vw
        this.canvas.height = vh
      }

      // Inicia o Streaming
      startStreaming = async () => {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          if ('srcObject' in this.video) {
            this.video.srcObject = this.stream
          } else {
            this.video.src = URL.createObjectURL(this.stream)
          }
          this.video.play()
          setTimeout(() => {
            let streamTracks = this.stream.getTracks()
            console.log(streamTracks)
          }, 1500)
          setTimeout(() => {
            this.camera.scrollTo(0, 1)
          }, 100)
        } catch (err) {
          console.log(err)
        }
      }

      // Remove a camada de vídeo e o resize
      removeLayer = () => {
        window.removeEventListener('resize', this.resizeThrottled())
        document.body.removeChild(this.camera)
      }

      // Parar o streaming
      stopStreaming = () => {
        let streamTracks = this.stream.getTracks()
        for (let i = 0; i < streamTracks.length; i++) {
          if (streamTracks[i].readyState == 'live') {
            streamTracks[i].stop()
          }
        }
      }
    }

    // eslint-disable-next-line no-new
    new CamHTMLClass(resolve, fail)
  }
}

Vue.use(Plugin)

export default Plugin
