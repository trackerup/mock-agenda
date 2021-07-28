<template>
  <div id="app" class="page-container login">
    <div class="mdl-app">
      <div class="toolbarbg mdl-app-toolbar">
        <div class="mdl-toolbar-section-start">
          <button @click="goLoginPage" class="mdl-button mld-button-icon-text button-back">
            <i class="material-icons">chevron_left</i>
            {{ $t('Voltar') }}
          </button>
        </div>
        <h5 class="pageTitle">{{ $t('Recuperar Dados') }}</h5>
        <div class="mdl-toolbar-section-end"></div>
      </div>
      <div class="mdl-app-content">
        <div class="logo">
          <img src="../../assets/shared/logo_tracker_blank.png"/>
        </div>
        <div class="centered-container">
          <div class="mdl-content ">
            <h5 class="subheading">{{ $t('Recuperar Dados') }}</h5>

            <!-- Matrícula -->
            <div>
              <span>IndexDB</span>
              <div class="mdl-textfield" v-mdl>
                <input ref="fileToImportIdb" class="mdl-textfield__input" type="file" id="fileToImportIdb"  v-mdl  @change="setFileIdb" >
              </div>
            </div>

            <div>
              <span>LocalStorage</span>
              <div class="mdl-textfield" v-mdl>
                <input ref="fileToImportLs" class="mdl-textfield__input" type="file" id="fileToImportLs"  v-mdl @change="setFileLocalStorage" >
              </div>
            </div>
            <span class="mdl-error">{{error}}</span>

            <span class="mdl-toolbar-section-end">
              <button @click="importData" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect">
                <i class="material-icons arrow-right">keyboard_arrow_right</i>
              </button>
            </span>
          </div>
        </div>
        <!-- <div class="powered_by">
          powered by
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { importData } from '@/plugins/persistence/services/export'
export default {
  name: 'RecoverData',
  data: () => ({
    error: '',
    jsonString: null,
    lsString: null
  }),
  beforeMount () {
  },
  mounted () {
    this.adjustHeight()
  },
  destroyed () {
    this.unSetHeight()
  },
  methods: {
    goLoginPage () {
      this.$router.push('/login')
    },
    setFileIdb (event) {
      const _self = this
      const fileForUpload = event.target
      var reader = new FileReader()
      const file = fileForUpload.files.item(0)
      reader.readAsText(file, 'UTF-8')
      reader.onload = function (evt) {
        _self.jsonString = evt.target.result
      }
      reader.onerror = function (evt) {
        _self.error = JSON.stringify(evt)
      }
    },
    setFileLocalStorage (event) {
      const _self = this
      const fileForUpload = event.target
      var reader = new FileReader()
      const file = fileForUpload.files.item(0)
      reader.readAsText(file, 'UTF-8')
      reader.onload = function (evt) {
        _self.lsString = evt.target.result
      }
      reader.onerror = function (evt) {
        _self.error = JSON.stringify(evt)
      }
    },
    importData () {
      if (this.jsonString && this.lsString) {
        const _self = this
        const snackbar = {
          message: this.$t('Importando os dados'),
          duration: 1000
        }
        this.$bus.$emit('showSnackBar', snackbar)
        importData(_self.jsonString).then(message => {
          var data = JSON.parse(_self.lsString)
          Object.keys(data).forEach(function (k) {
            localStorage.setItem(k, data[k])
          })
          const snackbar = {
            message: _self.$t(message),
            duration: 5000
          }
          _self.$bus.$emit('showSnackBar', snackbar)
          setTimeout(() => {
            window.location.href = window.location.href
          }, 3000)
        }).catch(err => {
          alert('Error: ' + err)
        })
      } else {
        this.error = 'Selecione os arquivos'
      }
    },
    adjustHeight () {
      let inputfield = document.getElementsByTagName('input')
      if (inputfield.length > 0) {
        let i = 0
        for (i; i < inputfield.length; i++) {
          inputfield[i].blur()
        }
      }
      let height = document.documentElement.clientHeight
      let documentElement = document.getElementById('app')
      if (documentElement != null) {
        documentElement.style.height = height + 'px'
      }

      documentElement = document.getElementsByClassName('mdl-app')[0]
      if (documentElement != null) {
        documentElement.style.height = height + 'px'
      }

      documentElement = document.getElementsByClassName('mdl-app-content')[0]
      if (documentElement != null) {
        documentElement.style.height = height + 'px'
      }
    },
    unSetHeight () {
      let documentElement = document.getElementsByClassName('mdl-app-content')[0]
      documentElement.style.height = 'unset'
    }
  }

}
</script>

<style scoped>
  .login{
    height: 100vh;
    background: #1a3444; /* Old browsers */
    background: -moz-linear-gradient(top,  #1a3444 0%, #1a3444 40Vh, #ffffff 40vh, #ffffff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  #1a3444 0%,#1a3444 40vh,#ffffff 40vh,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  #1a3444 0%,#1a3444 40vh,#ffffff 40vh,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a3444', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */

  }
  .logo{
    /* width: 283px; */
    height:40vh;
    width: 216px;
    /* background-color:#fff; */
    border-width: 0px;
    margin: 0 auto;
    /* background-image: url('../../assets/shared/logo_tracker_blank.png'); */
    /* background-size: contain; */
    /* background-repeat: no-repeat; */
    /* background-position: center center; */
    display: flex;
    align-items: center;
  }
  .mdl-app-content{
    width:100%;
    height: 100vh;
    box-sizing: border-box;
    position: relative;
    padding: 0
  }
  .centered-container {
    padding: 32px;
  }
  .centered-container .mdl-content {
    z-index: 1;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .recoverPaswordText{
    padding-top: 10px;
    padding-right: 10px;
    color:#CC0000;
    text-align: right;
    line-height: 14px;
    font-size: 12px;
    display: none;
  }
  .mdl-app{
    height: 100vh;
  }
  .centered-container.saved{
    top:50px;
  }
  .mdl-error{
    color:#CC0000;
    font-size: 12px;
    line-height: 14px;
    position: absolute;
    margin-top: -4px;
    letter-spacing: 0.034em;
  }
  .powered_by{
    position: absolute;
    bottom: 10px;
    right: 5px;
    font-size: 0.7em;
    background: url('../../assets/shared/tracker-up.png');
    background-size: 90px;
    background-position: right bottom;
    background-repeat: no-repeat;
    width: 95px;
    height: 45px;
  }
  .savedLogin{
    margin-top: 16vh;
  }
  .toolbarbg{
    position: fixed;
    width: 100%;
    display: flex;
  }
  .toolbarbg button{
    margin-left: 0px;
    margin-right: 0px;
  }
  .toolbarbg .pageTitle{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .mdl-app {
    position: unset
  }
</style>
