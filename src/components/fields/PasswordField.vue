<template>
    <div class="textfield-with-icon">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
        <input ref="passwordInput" class="mdl-textfield__input" type="password" id="passwordInput" v-model="model.senha">
        <label class="mdl-textfield__label" for="passwordInput">{{ $t('Senha') }} </label>
      </div>
      <i class="material-icons" @click="showpassword">visibility</i>
    </div>
</template>

<script>
export default {
  name: 'PasswordField',
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  data: () => ({}),
  methods: {
    showpassword (event) {
      if (event.target.innerHTML == 'visibility') {
        document.getElementById('passwordInput').type = 'text'
        event.target.innerHTML = 'visibility_off'
      } else {
        document.getElementById('passwordInput').type = 'password'
        event.target.innerHTML = 'visibility'
      }
    }
  }
}
</script>
