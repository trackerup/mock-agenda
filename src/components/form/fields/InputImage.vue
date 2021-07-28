<template>
<div>
  <div v-if="!readOnly" class="container-foto" :class="{'is-invalid': obrigatorio}">
    <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
    <div class="mdl-grid">
      <div class="imageThumb mdl-layout-item mdl-size-33 imgThumb" v-if="value && (value.startsWith('data:image') || value.startsWith('http'))">
        <div class="image">
          <img :src="value" alt="Sem conexão no momento, impossível exibir imagem!" />
        </div>
        <button class="mdl-button mdl-button--fab mdl-button--mini-fab cancel grey" @click="deleteImage()">
          <i class="material-icons">close</i>
        </button>
      </div>

      <div class="mdl-layout-item mdl-size-33 cameraButton">
        <button class="mdl-button mdl-button--fab grey" :disabled="blockingClick" @click="debounceTakePic">
          <i class="material-icons">camera_enhance</i>
        </button>
      </div>
    </div>
    <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>
  </div>
  <div v-else class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        <div class="imageThumb mdl-layout-item mdl-size-33 imgThumb" v-if="value">
          <div class="image">
            <img :src="value" alt="Sem conexão no momento, impossível exibir imagem!" />
          </div>
        </div>
      </span>
    </div>
</div>
</template>
<script>
import TRInputBase from './InputBase.vue'
import Vue from 'vue'

export default {
  name: 'InputImage',
  extends: TRInputBase,
  props: {
    embebed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    camHTML: '',
    timeoutTakePic: null,
    blockingClick: false
  }),
  created () {
    this.camHTML = window.localStorage.getItem('camHTMLService') || 'disabled'
  },
  mounted () {
    if (window.appState.takingPicture && window.appState.fieldId == this.id) {
      // como deu erro trocamos para camera alternativa para as próximas
      window.localStorage.setItem('camHTMLService', 'enabled')

      const data = window.appState.result
      const _self = this
      if (data) {
        setTimeout(() => {
          _self.emitChanges(data)
          _self.$el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
        }, 100)
      } else if (window.appState.error) {
        console.log(window.appState.error)
        this.showErrorEmitted(window.appState.error.result.toString())
      }
    }
  },
  methods: {
    emitChanges (data) {
      const image64 = 'data:image/jpeg;base64,' + data
      this.$emit('input', image64, this.id)
      this.$emit('change', this.id)
      this.$bus.$emit('loading', false)
      this.clearAppState()
    },

    showErrorEmitted (errorMessage) {
      errorMessage = this.categorizeCameraErrorMessage(errorMessage.toString())
      const message = this.$t(errorMessage[0])
      if (errorMessage[1] === 'snack') {
        this.$bus.$emit('showSnackBar',
          {
            message,
            duration: 2000
          }
        )
      } else {
        this.$bus.$emit('showErrorEmitted', { msg: message })
      }
      this.$bus.$emit('loading', false)
      this.clearAppState()
    },
    debounceTakePic () {
      let _self = this
      _self.blockingClick = true
      if (typeof _self.timeoutTakePic !== 'undefined') {
        clearTimeout(_self.timeoutTakePic)
      }

      _self.timeoutTakePic = setTimeout(() => {
        _self.takePic()
      }, 500)
    },
    takePic: function () {
      const _self = this
      try {
        window.appState.takingPicture = true
        window.appState.fieldId = _self.id
        window.appState.routeName = this.$route.fullPath
        window.localStorage.setItem(process.env.APP_STORAGE_KEY, JSON.stringify(window.appState))

        if (window.jscd.os != 'iOS' && this.camHTML == 'enabled') {
          Vue.camHTML(
            _self.emitChanges,
            _self.showErrorEmitted
          )
          if (document.querySelector('#dialog-photo') !== null) {
            this.$dialogPolyfill.doDialog('dialog-photo')
            document.querySelector('#dialog-photo').showModal()
          }
        } else {
          navigator.camera.getPicture(
            _self.emitChanges,
            _self.showErrorEmitted,
            {
              quality: 50,
              destinationType: navigator.camera.DestinationType.DATA_URL,
              sourceType: navigator.camera.PictureSourceType.CAMERA,
              targetHeight: 800,
              targetWidth: 800,
              correctOrientation: true,
              saveToPhotoAlbum: false
            }
          )
        }
      } catch (e) {
        console.log(e)
      }
    },
    deleteImage () {
      this.$emit('input', '', this.id)
    },
    categorizeCameraErrorMessage (errorMessage) {
      let type = 'dialog'
      errorMessage = errorMessage.toLowerCase()
      if ((errorMessage.includes('in use') || errorMessage.includes('use')) && !errorMessage.includes('max')) {
        errorMessage = 'Outro aplicativo está bloqueando o uso da câmera'
      } else if (errorMessage.includes('disabled')) {
        errorMessage = 'A câmera do dispositivo está desabilitada por alguma política do dispositivo e não pode ser aberta'
      } else if (errorMessage.includes('disconnected')) {
        errorMessage = 'A câmera do dispositivo encontra-se desconectada'
      } else if (errorMessage.includes('notfound')) {
        errorMessage = 'A câmera do dispositivo não foi encontrada'
      } else if (errorMessage.includes('20') || errorMessage.includes('permission')) {
        errorMessage = 'É necessário aceitar as permissões para acesso à câmera e armazenamento'
      } else if (errorMessage.includes('no image')) {
        errorMessage = 'Nenhuma imagem selecionada'
        type = 'snack'
      } else {
        errorMessage = 'Erro ao abrir a câmera, verifique a câmera do celular' + ' - Error: ' + errorMessage
      }
      return [errorMessage, type]
    },
    convertImgToBase64URL (url) {
      var img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        var canvas = document.createElement('CANVAS')
        var ctx = canvas.getContext('2d')
        var dataURL
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0)
        dataURL = canvas.toDataURL('image/jpeg')
        this.$emit('input', dataURL, this.id)
        this.$emit('change', this.id)
        canvas = null
      }
      img.src = url
    },
    clearAppState () {
      this.blockingClick = false
      window.appState.takingPicture = false
      window.appState.fieldId = null
      window.appState.error = null
      window.appState.routeName = null
      window.localStorage.setItem(process.env.APP_STORAGE_KEY, JSON.stringify(window.appState))
    }
  }
}
</script>
