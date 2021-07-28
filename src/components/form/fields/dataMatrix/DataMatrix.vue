<template>
  <span>
    <slot></slot>
  </span>
</template>
<script>
import { loadValueMatrix } from '@/services/dataMatrixService'

export default {
  name: 'DataMatrix',
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
      fieldsMatrixLocal: null
    }
  },
  methods: {
    isMatrixDataField (field) {
      return (
        ['ancora_matriz', 'proc_matriz', 'intersecao_matriz'].indexOf(
          field.tipo
        ) >= 0
      )
    },
    parseFieldType (field, tipo) {
      if (field.tipo == tipo) {
        return true
      } else if (this.isMatrixDataField(field)) {
        if (typeof this.fieldsMatrixLocal == 'undefined' || this.fieldsMatrixLocal == null) {
          this.fieldsMatrixLocal = {}
        }
        let matrixData = {}
        try {
          matrixData = JSON.parse(field.mascara)
        } catch (err) {
          matrixData = field.mascara
        }
        if (typeof matrixData.tipo == 'undefined') {
          switch (field.tipo) {
            case 'intersecao_matriz':
              matrixData = {
                tipo: 'texto',
                mascara: '',
                grupo: 'default',
                conf: matrixData,
                campo: field.mascara,
                readonly: 'on'
              }
              break
            case 'ancora_matriz':
              matrixData = {
                tipo: 'texto',
                mascara: '',
                grupo: 'default',
                matriz: field.lista,
                campo: field.mascara,
                readonly: 'false'
              }
              break
            default:
              matrixData = {
                tipo: 'texto',
                mascara: '',
                grupo: 'default',
                matriz: field.lista,
                campo: field.mascara,
                readonly: 'on'
              }
              break
          }
        }
        field.matrixData = matrixData
        field.mascara = matrixData.mascara
        if (typeof this.fieldsMatrixLocal[matrixData.grupo] == 'undefined') {
          this.fieldsMatrixLocal[matrixData.grupo] = {}
        }
        let idMatrix = false
        let idField = false
        switch (field.tipo) {
          case 'intersecao_matriz':
            idMatrix = matrixData.conf.origem[0]
            idField = matrixData.conf.origem[1]
            break
          case 'proc_matriz':
            idMatrix = matrixData.matriz
            idField = matrixData.campo
            break
        }
        if (idMatrix != false) {
          if (typeof this.fieldsMatrixLocal[matrixData.grupo][idMatrix] == 'undefined') {
            this.fieldsMatrixLocal[matrixData.grupo][idMatrix] = {}
          }
          this.fieldsMatrixLocal[matrixData.grupo][idMatrix][idField] = field
        }
        field.tipoMatrix = field.tipo
        field.tipo = matrixData.tipo
        field.readOnly = matrixData.readonly == 'on'
        return matrixData.tipo == tipo
      }
      return false
    },
    updatedValue (id) {
      let field = null
      for (let idxForm in this.form) {
        if (this.form[idxForm].id == id) {
          field = this.form[idxForm]
          break
        }
      }
      if (typeof field.matrixData != 'undefined') {
        this.doMatrixData(field).then(response => {
          window.checkDirty()
        })
        return true
      }
      return false
    },
    matrixData (form, field, value) {
      return new Promise(async (resolve, reject) => {
        if (typeof field.matrixData != 'undefined') {
          if (['ancora_matriz', 'intersecao_matriz'].indexOf(field.tipoMatrix) >= 0) {
            loadValueMatrix(field, value).then(response => {
              resolve(response.data.post)
            }).catch(response => {
              reject(response)
            })
          } else {
            const ret = {data: {
              success: false
            }}
            reject(ret)
          }
        } else {
          const ret = {data: {
            success: false
          }}
          reject(ret)
        }
      })
    },
    doMatrixData (field) {
      let matrixData = field.matrixData
      let _self = this
      this.$bus.$emit('showSnackBar', {
        message: this.$t('Aguarde...'),
        duration: 1000
      })
      return this.matrixData(_self, field, _self.values.responses[field.id].valor).then(response => {
        response.forEach(element => {
          let matriz = field.tipoMatrix == 'intersecao_matriz' ? matrixData.conf.destino[0] : matrixData.matriz
          let alvo = _self.fieldsMatrixLocal[matrixData.grupo][matriz][parseInt(element.id_meta)]
          if (typeof alvo != 'undefined') {
            _self.$emit('input', element.valor, alvo.id)
            if (alvo.tipoMatrix == 'intersecao_matriz' && alvo.id != field.id) {
              this.doMatrixData(alvo).then(response => {
                window.checkDirty()
              })
            }
          }
        })
        _self.$emit('forceUpdate')
      }).catch(response => {
        this.$bus.$emit('showSnackBar', {
          message: this.$t(response.mensagem) ? response.mensagem : this.$t('Nenhum valor encontrado.'),
          duration: 1000
        })

        let matriz = field.tipoMatrix == 'intersecao_matriz' ? matrixData.conf.destino[0] : matrixData.matriz
        let alvos = _self.fieldsMatrixLocal[matrixData.grupo][matriz]
        for (let idAlvo in alvos) {
          let element = alvos[idAlvo]
          _self.$emit('input', '', element.id)
          if (element.tipoMatrix == 'intersecao_matriz') {
            this.doMatrixData(element)
          }
        }
        _self.$emit('forceUpdate')
      })
    }
  }
}
</script>
