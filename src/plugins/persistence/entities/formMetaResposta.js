import { setters } from '../services'
import { createResposta } from '../entities/formResposta'

export async function saveMetaRespostas (listaRespostas) {
  for (var i in listaRespostas.metaResponses) {
    const element = listaRespostas.metaResponses[i]

    const metaResponseBasic = {
      idResposta: listaRespostas.idResponse,
      idPergunta: element.idPergunta,
      idForm: listaRespostas.idForm,
      slug: null,
      tipo: element.tipo
    }

    switch (element.tipo) {
      case 'formulario':
        var listOfResp = element.value
        var childResponsesIds = []

        if (listOfResp.length > 0) {
          metaResponseBasic.valor = '[]'
          // First we add a empty array to parent form_meta_resposta
          await setters.setOneWithInsertId('form_meta_resposta', metaResponseBasic).then(async function (parentMetaRespId) {
            for (var j in listOfResp) {
              var respFormDeForm = listOfResp[j]
              respFormDeForm.data = new Date().getTime()
              respFormDeForm.parent = listaRespostas.idResponse
              createResposta(respFormDeForm).then(function (valorIdResp) {
                // Then we add a response to the form father with the child response id
                childResponsesIds.push(valorIdResp)
                metaResponseBasic.valor = '[' + childResponsesIds.toString() + ']'
                metaResponseBasic.id = parentMetaRespId
                setters.setOne('form_meta_resposta', metaResponseBasic)
              })
            }
          })
        }

        break

      case 'consumo':
        metaResponseBasic.valor = '{"itens":[]}'
        setters.setOne('form_meta_resposta', metaResponseBasic)
        break

      default:
        if (typeof element.value == 'object') {
          metaResponseBasic.valor = JSON.stringify(element.value)
        } else {
          metaResponseBasic.valor = element.value
        }
        setters.setOne('form_meta_resposta', metaResponseBasic)
        break
    }
  }
}
