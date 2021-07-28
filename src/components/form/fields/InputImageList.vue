<template>
  <div>

    <div v-if="!readOnly" class="container-fotoConjunto">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <div class="mdl-layout">
        <div class="imageThumb mdl-layout-item mdl-size-33" v-for="(image, index) in images" :key="index">
          <div class="image">
            <img :src="image"/>
          </div>
          <button class="mdl-button mdl-button--fab mdl-button--mini-fab cancel grey"
                  @click="deleteImage(index)">
            <i class="material-icons">close</i>
          </button>
        </div>

        <div class="mdl-layout-item mdl-size-33 cameraButton">
          <button class="mdl-button mdl-button--fab grey" @click="takePic">
            <i class="material-icons">camera_enhance</i>
          </button>
        </div>
      </div>

      <span class="mdl-error" v-for="(item, index) in errors" :key="index" v-html="item"></span>

    </div>
    <div v-if="readOnly" class="readOnly">
      <label class="orange"><span v-html="texto"></span> <span v-show="obrigatorio">*</span></label>
      <span class="value">
        <div class="imageThumb mdl-layout-item mdl-size-33" v-for="(image, index) in images" :key="index">
          <div class="image">
            <img :src="image"/>
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
  name: 'InputImageList',
  extends: TRInputBase,
  data: () => ({
    camHTML: '',
    images: []
  }),
  beforeMount () {
    if (Array.isArray(this.value)) {
      this.images = this.value
    }
  },
  created () {
    this.camHTML = window.localStorage.getItem('camHTMLService') || 'disabled'
  },
  methods: {
    takePic () {
    // eslint-disable-next-line
    cordova.plugins.backgroundMode.enable()
      try {
        if (this.camHTML == 'enabled') {
          Vue.camHTML(data => {
            this.images.push('data:image/jpeg;base64,' + data)
            this.$emit('input', this.images, this.id)
          },
          (errorMessage) => {
            this.$bus.$emit('showErrorEmitted', { msg: this.$t(this.categorizeCameraErrorMessage(errorMessage.toString())) })
          })
          if (document.querySelector('#dialog-photo') !== null) {
            this.$dialogPolyfill.doDialog('dialog-photo')
            document.querySelector('#dialog-photo').showModal()
          }
        } else {
          navigator.camera.getPicture(data => {
            // eslint-disable-next-line
            cordova.plugins.backgroundMode.disable()
            this.images.push('data:image/jpeg;base64,' + data)
            this.$emit('input', this.images, this.id)
          },
          (errorMessage) => {
            this.$bus.$emit('showErrorEmitted', { msg: this.$t(this.categorizeCameraErrorMessage(errorMessage.toString())) })
          }, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            targetHeight: 800,
            targetWidth: 800,
            correctOrientation: true
          })
        }
      } catch (e) {
        console.log(e)
        // e.message implementar log
        // eslint-disable-next-line
        cordova.plugins.backgroundMode.disable()
      }
    },
    deleteImage (index) {
      this.images.splice(index, 1)
      this.$emit('input', this.images, this.id)
    },
    categorizeCameraErrorMessage (errorMessage) {
      errorMessage = errorMessage.toLowerCase()
      let type = 'dialog'
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
        errorMessage = 'Erro ao abrir a câmera' + ' - Error: ' + errorMessage
      }
      return [errorMessage, type]
    }
  }
}
</script>
