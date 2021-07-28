<template>
  <span>
    <slot></slot>
  </span>
</template>
<script>
export default {
  name: 'Conditional',
  props: {
    values: {
      type: Object,
      required: true
    },
    form: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      fieldsConditionLocal: null
    }
  },
  methods: {
    isFieldCondition (field) {
      return (
        field.condicional && field.condicional != '' && field.condicional != 'false'
      )
    },
    fieldCondition (field) {
      field.isVisible = true
      if (this.isFieldCondition(field)) {
        if (typeof this.fieldsConditionLocal == 'undefined' || this.fieldsConditionLocal == null) {
          this.fieldsConditionLocal = {}
        }
        let conditionData = field.condicional
        field.conditionData = conditionData
        let idField = conditionData.campo
        this.fieldsConditionLocal[idField] = field
        return this.doConditionData(field)
      }
      return field.isVisible
    },
    updatedValue (id) {
      this.$emit('forceUpdate')
    },
    doConditionData (field) {
      if (this.isFieldCondition(field)) {
        let conditionData = field.conditionData
        if (this.values.responses[conditionData.campo]) {
          let valorCondicionalAlvo = this.values.responses[conditionData.campo].valor
          if (!valorCondicionalAlvo) {
            valorCondicionalAlvo = ''
          }
          let valorCondicionalDestino = conditionData.valor
          if (conditionData.alvo == 'field') {
            valorCondicionalDestino = this.values.responses[conditionData.destino].valor
          }
          if (!valorCondicionalDestino) {
            valorCondicionalDestino = ''
          }
          let gatilho = false
          try {
            switch (conditionData.cond) {
              case '=' :
                // eslint-disable-next-line
                if (typeof valorCondicionalAlvo != 'string') valorCondicionalAlvo = valorCondicionalAlvo.toString()
                gatilho = (valorCondicionalAlvo.toUpperCase() == valorCondicionalDestino.toUpperCase())
                break
              case '>' :
                gatilho = (parseFloat(valorCondicionalAlvo) > parseFloat(valorCondicionalDestino))
                break
              case '>=' :
                gatilho = (parseFloat(valorCondicionalAlvo) >= parseFloat(valorCondicionalDestino))
                break
              case '<' :
                gatilho = (parseFloat(valorCondicionalAlvo) < parseFloat(valorCondicionalDestino))
                break
              case '<=' :
                gatilho = (parseFloat(valorCondicionalAlvo) <= parseFloat(valorCondicionalDestino))
                break
              case '!=' :
                gatilho = (valorCondicionalAlvo != valorCondicionalDestino)
                break
              case 'LIKE' :
                if (valorCondicionalAlvo != '') {
                  var valorAlvo = valorCondicionalAlvo
                  if (typeof valorAlvo == 'object') {
                    for (var i = 0; i < valorAlvo.length && !gatilho; i++) {
                      let item = valorAlvo[i]
                      gatilho = item.indexOf(valorCondicionalDestino) >= 0
                    }
                  } else {
                    gatilho = valorCondicionalAlvo.indexOf(valorCondicionalDestino) >= 0
                  }
                }
                break
              case 'IN' :
              case 'NIN' :
                if (typeof valorCondicionalAlvo == 'object') {
                  for (let idx = 0; idx < valorCondicionalAlvo.length && !gatilho; idx++) {
                    let item = valorCondicionalAlvo[idx]
                    gatilho = (item != '' && (
                      valorCondicionalDestino.indexOf('|') >= 0
                        ? (valorCondicionalDestino.split('|').indexOf(item) >= 0)
                        : (valorCondicionalDestino.indexOf(item) >= 0)
                    ))
                  }
                } else {
                  gatilho = (valorCondicionalAlvo != '' &&
                      (
                        valorCondicionalDestino.indexOf('|') >= 0
                          ? (valorCondicionalDestino.split('|').indexOf(`${valorCondicionalAlvo}`) >= 0)
                          : (valorCondicionalDestino.indexOf(`${valorCondicionalAlvo}`) >= 0)
                      ))
                }
                gatilho = (conditionData.cond == 'IN' ? gatilho : !gatilho)
                break
            }
          } catch (err) {
            gatilho = false
          }
          switch (conditionData.acao) {
            case 'exibe':
              field.isVisible = gatilho
              break
            case 'exibe_obriga':
              field.isVisible = gatilho
              field.obrigatorio = gatilho ? '1' : '0'
              break
            case 'obriga':
              field.obrigatorio = gatilho ? '1' : '0'
              break
          }
        } else {
          field.isVisible = false
        }
        this.errors = []
        this.hasErrors = false
      }
      return field.isVisible
    }
  }
}
</script>
