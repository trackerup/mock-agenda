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
        <h5 class="pageTitle">{{ $t('Recuperar senha') }}</h5>
        <div class="mdl-toolbar-section-end"></div>
      </div>

      <div class="mdl-app-content">

        <div class="logo"></div>
        <div class="centered-container">
          <div class="mdl-content ">
            <h5 class="subheading">{{ $t('Recuperar senha') }}</h5>

            <!-- Matrícula -->
            <registration-field :model="user" />

            <span class="mdl-toolbar-section-end">
                  <button @click="recoverPassword" class="mdl-button  mdl-button--fab ">
                    <i class="material-icons arrow-right">keyboard_arrow_right</i>
                  </button>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import RegistrationField from '../../components/fields/RegistrationField'
export default {
  name: 'RecoverPassword',
  components: {RegistrationField},
  data: () => ({
    error: '',
    user: {
      login: ''
    }
  }),
  methods: {
    goLoginPage () {
      this.$router.push('/login')
    },
    recoverPassword () {
      // console.log('pass send')
    }
  }

}
</script>

<style scoped>
  .login{
    background-color: transparent!important;
    background-image: url('../../assets/shared/top-right.svg'), url('../../assets/shared/bottom-left.svg') ;
    background-size: 360px 330px, 260px 140px;
    background-repeat: no-repeat, no-repeat;
    background-position: top right,bottom left;
  }
  .logo{
    width: 283px;
    height:97px;
    background-color:#fff;
    border: solid #ccc 2px;
    border-radius:0 5px 0 5px;
    margin: 9.5vh auto 7.5vh;
    background-image: url('../../assets/shared/tracker-up.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .mdl-app-content{
    width:100%;
    height: 100vh;
  }
  .mdl-layout-item {
    align-items: center;
    justify-content: center;
  }
  .centered-container .mdl-alignment-center{
    text-align:center;
  }
  .centered-container .mdl-content {
    z-index: 1;
    width: 100%;
    max-width: 400px;
    position: relative;
    margin-top: 50px;
  }

  .toolbarbg{
    position: fixed;
    width: 100%;
    display: flex;
  }

  .mdl-content h5.subheading {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 500;
    color: #6D6E71;
    letter-spacing: 0.013em;
    line-height: 24px;
  }
  .mdl-section-end .mdl-button--fab {
    display: inline-block;
    margin: 0;
  }
  .textfield-with-icon {
    margin-bottom: 0 !important;
  }
</style>
