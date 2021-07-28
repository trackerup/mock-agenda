<script>
export default {
  props: {
    'id': {
      required: true
    },
    'formulario': {
      required: true
    },
    'ordem': {
      required: true
    },
    'mascara': {
      required: false,
      default: ''
    },
    'texto': {
      required: true
    },
    'tipo': {
      required: true
    },
    'lista': {
      required: false,
      default: ''
    },
    'default': {
      required: false,
      default: ''
    },
    'obrigatorio': {
      required: false,
      default: ''
    },
    'originalForm': {
      required: false,
      destaque: '0',
      default: '0'
    },
    'destaque': {
      required: false,
      default: '0'
    },
    'condicional': {
      required: false,
      default: false
    },
    'value': {
      // não existe type para atenter todos os campos
      required: true
    },
    'readOnly': {
      required: false,
      default: false
    },
    'blocked': {
      type: Boolean,
      required: false,
      default: false
    },
    'messageError': {
      required: false,
      default: ''
    }
  },
  data () {
    return {
      errors: [],
      hasErrors: false
    }
  },
  created () {
    this.hasErrors = false
  },
  methods: {
    getValue () {
      // to-do - implementar metodo generico
    },
    isValid: function () {
      this.errors = []
      this.hasErrors = false
      if (this.obrigatorio == '1' && !this.value) {
        this.errors.push(this.$t('Este field é obrigatório'))
        this.hasErrors = true
        return false
      }
      return true
    }
  },
  updated () {
    window.checkDirty()
  },
  computed: {
  },
  render: function (createElement) {
    return ''
  }
}
</script>
