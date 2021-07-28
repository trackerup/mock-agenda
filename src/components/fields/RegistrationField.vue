<template>
    <div class="textfield-with-icon">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
        <input ref="registrationinput" class="mdl-textfield__input" type="text" id="RegistrationInput"  v-mdl v-model="model.login">
        <label class="mdl-textfield__label" for="RegistrationInput">{{ $t('Login') }}</label>
      </div>
      <transition name="fade">
        <i class="material-icons" v-show="model.login != ''" @click="limpacampo">close</i>
      </transition>
    </div>
</template>

<script>
export default {
  name: 'RegistrationField',
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  data: () => ({}),
  methods: {
    limpacampo () {
      this.model.login = ''
      document.getElementById('RegistrationInput').closest('.mdl-textfield').classList.remove('is-dirty')
    }
  }
}
</script>
<style lang="scss" scoped>

.textfield-with-icon {
  margin-bottom: 20px;
}

</style>
