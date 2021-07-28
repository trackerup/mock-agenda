<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CustomStyle',
  data () {
    return {
      primaryColorWarn: '#CC0000',
      secondaryColorVariantNormal: '#1a3444',
      primaryColor: '#f26829',
      primaryColorVariant: '#f2682999',
      secondaryColor: '#1a3444',
      secondaryColorVariant: '#1a3444d9',
      secondaryColorLight: '#c5c5c5'
    }
  },
  created () {
    this.montaLayout()
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  },
  watch: {
    user: function (val) {
      if (val) {
        if (val.theme) {
          this.primaryColorWarn = '#CC0000' // val.theme.primaryColorWarn
          this.secondaryColorVariantNormal = val.theme.secondaryColorVariantNormal
          this.primaryColor = val.theme.primaryColor
          this.primaryColorVariant = this.primaryColor + '99'
          this.secondaryColor = val.theme.secondaryColor
          this.secondaryColorVariant = this.secondaryColor + 'd9'
          this.secondaryColorLight = val.theme.secondaryColorLight
          this.montaLayout()
        } else {
          this.setDefault()
        }
      }
    }
  },
  methods: {
    setDefault () {
      this.primaryColorWarn = '#CC0000'
      this.secondaryColorVariantNormal = '#1a3444'
      this.primaryColor = '#f26829'
      this.primaryColorVariant = this.primaryColor + '99'
      this.secondaryColor = '#1a3444'
      this.secondaryColorVariant = this.secondaryColor + 'd9'
      this.secondaryColorLight = '#c5c5c5'
    },
    montaLayout () {
      document.querySelector(':root').style.setProperty('--primaryColorWarn', this.primaryColorWarn)
      document.querySelector(':root').style.setProperty('--primaryColor', this.primaryColor)
      document.querySelector(':root').style.setProperty('--primaryColorVariant', this.primaryColorVariant)
      document.querySelector(':root').style.setProperty('--secondaryColor', this.secondaryColor)
      document.querySelector(':root').style.setProperty('--secondaryColorVariant', this.secondaryColorVariant)
      document.querySelector(':root').style.setProperty('--secondaryColorLight', this.secondaryColorLight)
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">

.app-content {
  .loading-processamento {
    background: var(--secondaryColor);
    color: #fff;
    .mdl-card {
      background: var(--secondaryColor);
    }
    .mdl-button {
      color: #fff;
    }
  }

.mdl-button--fab {
  background: var(--secondaryColor) !important;
  color: #fff;

  &.orange {
    background: var(--primaryColor);

    &:hover,
    &.mdl-button--colored,
    &:focus:not(:active) {
      background: var(--primaryColor);
    }
  }

  &:hover,
  &.mdl-button--colored,
  &:focus:not(:active) {
    background: var(--secondaryColor);
  }
}

.mdl-chip {
  background: #fff;
  border: 1px solid #DCDEDF;
  margin-right: 8px;
  margin-bottom: 8px;
  .mdl-chip__action {
    opacity: 1;
  }
}
.mdl-chip--deletable-right {
  &.orange {
    background: var(--primaryColor);
    border-color: var(--primaryColor);
    color: #fff;
    .material-icons {
      color: #fff;
    }
  }
}

.mdl-textfield {
  background-color: rgba(0, 0, 0, 0.06);

  .mdl-textfield__input {
    color: rgba(0, 0, 0, 0.87);
  }

  .mdl-textfield__label {
    color: rgba(0, 0, 0, 0.54);
  }

  textarea.mdl-textfield__input {
    color: rgba(0, 0, 0, 0.87);
  }

  &.mdl-textfield--floating-label.is-focused .mdl-textfield__label,
  &.mdl-textfield--floating-label.is-dirty .mdl-textfield__label,
  &.mdl-textfield--floating-label.has-placeholder .mdl-textfield__label {
    color: var(--primaryColor);
  }

  &.mdl-textfield--floating-label {

    input[type="date"].mdl-textfield__input,
    input[type="time"].mdl-textfield__input,
    input[type="datetime-local"].mdl-textfield__input {

      &:focus {
        +.mdl-textfield__label {
          color: var(--primaryColor);
        }
      }
    }
  }

  &.mdl-textfield--floating-label.is-invalid {
    .mdl-textfield__label {
      color: var(--primaryColorWarn)
    }
  }

  .mdl-textfield__label:after {
    background: var(--primaryColor);
  }

  &.mdl-date {
    .mdl-textfield__input {
      &:focus {
        +.mdl-textfield__label {
          color: var(--primaryColor);;
        }
      }
    }
  }

  .mdl-icon-toggle__label {
    color: rgba(0, 0, 0, 0.4);
  }
}

.mdl-error {
  color: var(--primaryColorWarn);
}

.radioFctaGroup .radioFcta {
  border-bottom: 1px solid #E3E3E3;

  .mdl-radio-no-mdl {

    .mdl-radio__button:checked+.radio__outer-circle {
      border-color: var(--primaryColor);
    }

    .radio__outer-circle {
      border: 2px solid rgba(0, 0, 0, .54);
    }

    .radio__inner-circle {
      background: var(--primaryColor);
    }

  }
}

.mdl-card {
  border: solid 1px rgba(0, 0, 0, 0.12);

  h6 {
    color: rgba(0, 0, 0, 0.6);

    .material-icons {
      color: rgba(0, 0, 0, 0.6);
    }
  }

  .dados {
    color: rgba(0, 0, 0, 0.6);
  }

  &.expand {
    h6 {
      .material-icons {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}

.taskitem {
  .row-conteudo {
    .reordenacao {
      background-color: var(--primaryColor);
      button {
        .material-icons {
          color: #fff;
        }
      }
    }
  }

  .row {
    .icon {
      &.icon-close {
        .material-icons {
          background: #939598;
          color: #fff;
        }
      }
    }
  }

  .status {
    color: rgba(0, 0, 0, 0.6)
  }

  .title {
    color: rgba(0, 0, 0, 0.87);
  }

  .address {
    color: rgba(0, 0, 0, 0.6);
  }

  .material-icons {
    color: var(--primaryColor);

    &.grey {
      color: #939598 !important;
    }
  }
}

.input-blocked {

  i {
    color: #939598;
  }

  label {
    color: var(--primaryColor);
  }
}

.mdl-checkbox {
  border-bottom: 2px solid #6D6E71;
  &.is-checked {
    .mdl-checkbox__box-outline {
      border-color: var(--secondaryColor);
    }

    .mdl-checkbox__tick-outline {
      background-color: var(--secondaryColor);
    }
  }

  .mdl-checkbox__box-outline {
    border-color: #747474;
  }

  .mdl-checkbox__label {
    color: rgba(0, 0, 0, 0.87);
  }
}

.input-selecao-pecas,
.section-field,
.section-stars,
.section-checkbox,
.section-conforme,
.section-okfoto,
.section-simnao,
.section.campo_livre,
.section.section-form,
.container-fotoConjunto,
.container-foto {

  label:not(.mdl-textfield__label) {
    color: var(--primaryColor);
  }
}

.container-fotoConjunto,
.container-foto {
  background: rgba(109, 110, 113, 0.07);
}

.cameraButton {

  .mdl-button--fab {
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
    background: #939598 !important;

    &:focus:not(:active),
    &:hover {
      background: #939598
    }
  }
}

.section.section-form {

  .fieldList {
    background: rgba(0, 0, 0, 0.07);
    border-color: var(--secondaryColor);
    .button-cancelar {
      .material-icons {
        color: #fff;
        background: #6D6E71;
      }
    }
  }
}

.section.campo_livre {
  color: rgba(0, 0, 0, 0.6);
}

.inputPredefinedPontogeo {

  label {
    color: var(--primaryColor);
  }
}

.section-okfoto,
.section-simnao,
.section-conforme {
  .mdl-tabs__tab {

    .label {
      color: #6D6E71;
    }

    .material-icons {
      color: #6D6E71;
    }

    &.active {
      &.check_circle_outline {
        .material-icons {
          color: var(--secondaryColor);
        }

        border-color: var(--secondaryColor);
      }

      &.cancel {
        .material-icons {
          color: var(--primaryColorWarn);
        }

        border-color: var(--primaryColorWarn);
      }

      &.more_horiz {
        .material-icons {
          color: var(--primaryColor);
        }

        border-color: var(--primaryColor);
      }
    }
  }
}

.form-actions {

  &.fixed-actions {

    &.wizard {
      background: #fff
    }
  }

  &.wizard {
    .mdl-button {
      color: #939598;

      .material-icons {
        background: var(--secondaryColor);
        color: #fff;
      }
    }

    .mdl-button[disabled][disabled] {
      .material-icons {
        background: #939598;
      }

    }
  }

  &.wizardconfirm {

    .button-edit {
      color: #6D6E71;

      .material-icons {
        color: var(--primaryColorWarn);
      }
    }

    .button-confirm {
      color: var(--secondaryColor);
    }
  }
}

.imageThumb {

  .image {
    background-color: #FFF;
    border: solid #939598 1px;
  }

  button.cancel {
    background: #939598 !important;
  }
}

.modal-form {
  h5 {
    .orange {
      color: var(--primaryColor);
    }
  }
}

.mdl-layout__drawer {
  .client-logo {
    background: var(--secondaryColor);
  }

  .agent-info {

    .matricula {
      color: rgba(0, 0, 0, 0.6)
    }
  }

  hr.hr-agent {
    border-color: rgba(0, 0, 0, 0.1);
  }

  .mdl-list {
    .mdl-list__item {
      &.ativo {
        background: rgba(var(--primaryColor), .1);
        color: var(--primaryColor);

        .mdl-list__item-icon {
          color: var(--primaryColor);
        }
      }
    }
  }
}

.mdl-dialog {

  &.full {
    background: rgba(0.3, 0.3, 0.3, 0.3);

    .mdl-dialog__content {
      color: rgba(0, 0, 0, 0.6);
      background: white;
    }

    .page-content {
      background: white;
    }

    .mdl-tabs__tab {
      color: #6D6E71;
    }

    .mdl-tabs.is-upgraded .mdl-tabs__tab.is-active:after {
      background: var(--secondaryColor);
    }
  }

  &::backdrop {
    background: rgba(109, 110, 113, 0.4)
  }

  .mdl-dialog__title {
    color: rgba(0, 0, 0, 0.87);
  }

  h5 {
    .orange {
      color: var(--primaryColor);
    }
  }

  h5.orange {
    color: var(--primaryColor);
  }

  .mdl-dialog__content {
    color: rgba(0, 0, 0, 0.6);
  }
}

.separador {
  background: rgba(0, 0, 0, 0.08);
}

.field_livre,
.orientacao {
  color: rgba(0, 0, 0, 0.6);
}
.mdl-layout__header {
  background: var(--secondaryColor);
  color: #fff;

  .mdl-button {
    color: #fff;
  }
}

.inputSearch {
  .mdl-textfield {
    .mdl-textfield__input {
      background-color: #FFF;
      border: solid 1px var(--secondaryColor);
    }
    &.mdl-textfield--floating-label.is-focused .mdl-textfield__label,
    &.mdl-textfield--floating-label.is-dirty .mdl-textfield__label,
    &.mdl-textfield--floating-label.has-placeholder .mdl-textfield__label {
      color: var(--primaryColor);
      background: #fff;
    }
  }
}

#dialog-error {
  .mdl-dialog__title {
    color: var(--primaryColorWarn);
  }
}

#dialog-message {
  .mdl-dialog__title {
    color: var(--primaryColor);
  }
}

.textOrange {
  color: var(--primaryColor);
}

.component-signature {
  .container-button {

    button {
      color: #FFF;
      background-color: #939598;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
    }
  }
}

.is-invalid label {
  color: var(--primaryColorWarn) !important;
}

.readOnly {

  label {
    color: var(--primaryColor);
  }

  .value {
    color: rgba(0, 0, 0, 0.87);
  }

  .labelvalue {
    color: rgba(0, 0, 0, 0.6);

    .material-icons {

      &.check_circle_outline,
      &.conforme {
        color: var(--secondaryColor);
      }

      &.cancel,
      &.naoConforme {
        color: var(--primaryColorWarn);
      }

      &.more_horiz,
      &.naoSeAplica {
        color: var(--primaryColor);
      }
    }
  }

  .box-respostas {
    border: 1px solid #707070;
  }

  .box-subrespostas ul {

    li {
      border: 1px solid #707070;
    }
  }
}

.form-container {
  &.wizard-container {
    &.readonlystep {
      .readonlyfield:nth-child(odd) {
        background: rgba(#939598, 0.15);
      }
    }
  }
}

.list__resposta {
  .mdl-list__item {
    background: #eee;
  }
}

.snackbar {
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
  background-color: #000 !important;

  .snackbar-content {
    color: #fff;
  }
}

.toolbarbg {
  background-color: var(--primaryColor) !important;
}

.toolbarbg * {
  color: #fff !important;
}

.material-icons {
  &.black {
    color: #000 !important;
  }

  &.grey {
    color: #939598;
  }

  &.orange {
    color: var(--primaryColor) !important;
  }

  &.green {
    color: var(--secondaryColor) !important;
  }

  &.red {
    color: var(--primaryColorWarn) !important;
  }
}

button.orange {
  background-color: var(--primaryColor) !important;
  color: #FFF !important;
}

button.green {
  background-color: var(--secondaryColor) !important;
  color: #FFF !important;
}

button.whited {
  color: #fff !important;
}

button.grey {
  background-color: #939598 !important;
  color: #FFF !important;
}

.bold {
  font-weight: bold !important;
}

.hour-item {
  background: rgba(0, 0, 0, 0.08);

  .body-1 {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .mdl-caption {
    color: rgba(0, 0, 0, 0.6);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .reordernar {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.loading {

  label {
    color: var(--primaryColor);
  }
}

.input-selecao-pecas {
  .mdl-list {
    border-color: var(--secondaryColor);
    background-color: rgba(0, 0, 0, 0.06);
    .mdl-list__item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    .mdl-list__item-secondary-content {

      .qtd-actions {
        input {
          background-color: #DFDFDF;
          border-bottom-color: rgba(0,0,0,.12);
        }
        .material-icons {
          color: #333;
        }
      }
      .mdl-list__item-secondary-action {
        .material-icons {
          color: var(--primaryColorWarn);
        }
      }

    }
  }
  .add-peca, .searchSubPart {
    background: var(--primaryColor);
    &.red {
      background: #939598;
    }
  }
}

.tiny-loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primaryColor);
}

.small-loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid var(--primaryColor);
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid var(--primaryColor);
}

.user-details{
    height: 100vh;
    background: linear-gradient(180deg,var(--secondaryColor) 40vh, #fff 200px);

    background: var(--secondaryColor);
    background: -moz-linear-gradient(top,  var(--secondaryColor)  0%, var(--secondaryColor)  40%, #ffffff 40%, #ffffff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  var(--secondaryColor)  0%,var(--secondaryColor)  40%,#ffffff 40%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  var(--secondaryColor)  0%,var(--secondaryColor)  40%,#ffffff 40%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='var(--secondaryColor) ', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */
  }
  .accordeon .painel__title {
    background: var(--primaryColor)
  }
}

</style>
