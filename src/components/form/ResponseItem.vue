<template>
    <span>{{descItem}}</span>
</template>
<script>
import moment from 'moment'
export default {
  name: 'ResponseItem',
  props: {
    form: {
      type: Object,
      required: true
    },
    response: {
      type: Object,
      required: true
    }
  },
  computed: {
    descItem () {
      const _ancora = this.form.metaDados.filter(ele => { return ele.meta_key == 'ancora' })
      if (_ancora && _ancora.length == 1) {
        const _question = this.form.perguntas.filter(question => {
          return question.metaDados.filter(meta => {
            return meta.meta_key == 'ancora' && meta.meta_value == _ancora[0].meta_value
          }).length
        })
        const _resposta = Object.values(this.response.responses).filter(ele => {
          return ele.idPergunta == _question[0].id
        })
        switch (_question[0].tipo) {
          case 'parts_selection':
            let qtd = 0
            JSON.parse(_resposta[0].valor).forEach(peca => { qtd += peca.quantidade })
            return qtd + this.$t(' peças selecionadas')
          default:
            return _resposta[0].valor ? _resposta[0].valor : this.response.data
        }
      }
      let sValue = (this.response.data instanceof Date ? this.response.data.toISOString() : typeof this.response.data == 'object' ? this.response.data : String(this.response.data))
      return moment(sValue).format('DD/MM/YYYY')
    }
  }
}
</script>
