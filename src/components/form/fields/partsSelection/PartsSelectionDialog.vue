<template>
    <div>
        <div class="mdl-dialog full full-fixed dialogPartSelection" id="partsSelectionDialog">
            <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header class="mdl-layout__header">
                    <div class="mdl-layout__header-row">
                        <div class="flex-start">
                            <button @click="$emit('cancel')" class="mdl-button mld-button-icon-text button-back">
                                <i class="material-icons">keyboard_arrow_left</i>
                                {{ $t('Voltar') }}
                            </button>
                        </div>
                        <h5 class="pageTitle">{{$t('Seleção de Peças')}}</h5>
                        <div class="flex-end"></div>
                    </div>
                </header>
                <main class="mdl-layout__content">
                    <div class="page-content">
                        <!-- lIVRE -->
                        <div v-mdl class="mdl-tabs mdl-js-tabs " v-if="livre">
                            <!-- lIVRE SEM PEÇAS -->
                            <div v-mdl class="mdl-tabs mdl-js-tabs " v-if="(!pecas || !Object.values(pecas).length)">
                                <div class="mdl-tabs__panel is-active">
                                    <div class="mdl-card livre firstNivel">
                                        <label class="orange"><span>Digite o nome da peça</span> <span>*</span></label>
                                        <InputBarcode v-on:input="(e, value) => { this.pecaLivre.peca = e.target.value}" id="searchTerm" showClear="true" :value="pecaLivre.peca"></InputBarcode>
                                        <div class="mdl-error">{{messagePecaLivre}}</div>
                                        <div v-if="(lastDepth != 'pecas') ">
                                            <label class="orange"><span>Digite a ocorrência</span></label>
                                            <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="[{'is-dirty': pecaLivre.ocorrencia != ''}]">
                                                <input class="mdl-textfield__input" type="text" id="pecaLivreOcorrencia" v-model="pecaLivre.ocorrencia">
                                            </div>
                                            <div class="pecaLivre-fctao">
                                                <InputChip id="inputChip" :value="pecaLivre.fctao.fctaoId" v-on:input="(value, id) => { pecaLivre.fctao = {fctaoId: value.id, fctaoDescription: value.titulo} } " class="listaChip" :itens="listFctaoItens" texto="Selecione a ocorrência da peça" />
                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <span style="border-bottom: 0;">
                                                <button class="mdl-button mdl-button--raised orange" @click="setValueLivre(pecaLivre.peca, pecaLivre.ocorrencia, pecaLivre.fctao)" v-if="!pecaLivre.isClicked">
                                                    <i class="material-icons" style="margin-right: 4px;">add_circle_outline</i>{{$t('Adicionar Peça')}}
                                                </button>
                                                <button class="mdl-button mdl-button--raised green" v-if="pecaLivre.isClicked">
                                                    <i class="material-icons" style="margin-right: 4px;">check</i>{{$t('Peça Adicionada')}}
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- lIVRE SEM PEÇAS -->
                            <!-- lIVRE COM PEÇAS -->
                            <div v-mdl class="mdl-tabs mdl-js-tabs livre" v-else>
                                <div class="mdl-tabs__panel is-active">
                                    <div class="mdl-card livre firstNivel">
                                        <label class="orange"><span>Pesquisar</span></label>
                                        <InputBarcode v-on:input="codBarReturn" :id="this.id + 'searchTerm'" showClear="true" :value="searchTerm" />
                                        <template v-for="(peca,index) in pecas">
                                            <div class="mdl-card" v-if="isVisible(peca)" :key="index">
                                                <div class="recursive-accordion" @click="pecaLivre.peca = index">
                                                    <div class="recursive-accordion__item" :class="[{'active': pecaLivre.peca == index}]">
                                                        <span>
                                                            <span class="recursive-accordion__title" style="border:0;">
                                                                <span class="descricaoItem">
                                                                    {{index}}
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="recursive-accordion__children" v-if="(pecaLivre.peca == index && lastDepth != 'pecas') ">
                                                    <label class="orange"><span>Digite a ocorrência</span></label>
                                                    <div v-mdl class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="[{'is-dirty': pecaLivre.ocorrencia != ''}]">
                                                        <input class="mdl-textfield__input" type="text" id="pecaLivreOcorrencia" v-model="pecaLivre.ocorrencia">
                                                    </div>
                                                    <div class="pecaLivre-fctao">
                                                        <InputChip id="inputChip" :value="pecaLivre.fctao.fctaoId" v-on:input="(value, id) => {pecaLivre.fctao = {fctaoId: value.id, fctaoDescription: value.titulo}} " class="listaChip" :itens="listFctaoItens" texto="Selecione a ocorrência da peça" />
                                                    </div>
                                                </div>
                                                <div class="text-center">
                                                    <span style="border-bottom: 0;" v-if="pecaLivre.peca == index">
                                                        <button class="mdl-button mdl-button--raised orange" @click="setValueLivre(pecaLivre.peca, pecaLivre.ocorrencia, pecaLivre.fctao)" v-if="!pecaLivre.isClicked">
                                                            <i class="material-icons" style="margin-right: 4px;">add_circle_outline</i>{{$t('Adicionar')}}
                                                        </button>
                                                        <button class="mdl-button mdl-button--raised green" v-if="peca.isClicked">
                                                            <i class="material-icons" style="margin-right: 4px;">check</i>{{$t('Peça Adicionada')}}
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <!-- lIVRE COM PEÇAS -->
                        </div>
                        <!-- lIVRE -->
                        <!-- WHIRLPOOL -->
                        <div v-mdl class="mdl-tabs mdl-js-tabs" v-else>
                            <div class="mdl-tabs__panel is-active accordion__pecas">
                                <div class="recursive-accordion__item title barcode" :class="[{' active': true}]">
                                    <span class="recursive-accordion__title pad">
                                        <div class="full accordionSearch">
                                            <InputBarcode v-on:input="codBarReturn" texto="Pesquisar" :id="this.id + 'searchTerm'" showClear="true" :value="searchTerm" />
                                        </div>
                                    </span>
                                </div>
                                <div v-for="(peca,index) in pecas" :key="index">
                                    <div class="mdl-card firstNivel" v-if="isVisible(peca)">
                                        <div class="recursive-accordion" @click="
                              (peca.ocorrencia.length == 0) ? showMessageNoOcorrencies() : clickHandler(peca)">
                                            <div class="recursive-accordion__item">
                                                <span>
                                                    <span class="recursive-accordion__title">
                                                        <span class="descricaoItem" v-html="getDescription(peca)"></span>
                                                        <span v-for="(codSub, indexCodSub) in peca.codSub" :key="indexCodSub" class="codSubHolder">
                                                            <span class="codSub" v-html="getDescription(codSub)" @click="clickCodSub(codSub)"></span>
                                                        </span>
                                                        <i class="material-icons recursive-accordion__icon" v-if="peca.ocorrencia.length != 0">
                                                            {{ peca.isOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}
                                                        </i>
                                                        <div class="applicability" :class="'applicability-' + peca.applicability" v-if="farol">
                                                        </div>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="recursive-accordion__children" v-if="(peca.isOpen && lastDepth != 'pecas') " style="marginLeft: 16px">
                                            <span v-for="(ocorrencia, index2) in peca.ocorrencia" :key="index2" class="secondNivel">
                                                <div class="recursive-accordion">
                                                    <div class="recursive-accordion__item" @click="clickHandler(ocorrencia)
                              ">
                                                        <span>
                                                            <span class="recursive-accordion__title">
                                                                <span class="descricaoItem" v-html="getDescription(ocorrencia)"></span>
                                                                <i class="material-icons recursive-accordion__icon">
                                                                    {{ ocorrencia.isOpen ? 'arrow_drop_up' : 'arrow_drop_down' }}
                                                                </i>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div class="recursive-accordion__children" v-if="ocorrencia.isOpen" style="marginLeft: 16px">
                                                        <span v-for="(fctao, index3) in ocorrencia.fcta" :key="index3" class="secondNivel">
                                                            <div class="recursive-accordion" v-if="validFctao(peca, fctao)">
                                                                <div class="recursive-accordion__item" @click="clickHandler(fctao)">
                                                                    <span>
                                                                        <span class="recursive-accordion__title">
                                                                            <button class="mdl-button add-peca" @click="setValue(peca, ocorrencia, fctao)" v-if="!fctao.isClicked">
                                                                                {{fctao.fctaoDescription}}<i class="material-icons">add</i>
                                                                            </button>
                                                                            <div class="garantia-description">
                                                                                <small v-if="fctao.partWarranty"><b>Garantia :</b> {{fctao.partWarranty}} </small>
                                                                            </div>
                                                                            <button class="mdl-button green add-peca" v-if="fctao.isClicked">
                                                                                {{$t('Peça Adicionada')}}<i class="material-icons">check</i>
                                                                            </button>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="recursive-accordion" v-else>
                                                                <div class="recursive-accordion__item">
                                                                    <span>
                                                                        <span class="recursive-accordion__title">
                                                                            <button class="mdl-button  add-peca red " style="text-transform: underline">
                                                                                {{fctao.fctaoDescription}}
                                                                                <span />
                                                                            </button>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                        <div v-else>
                                            <span class="recursive-accordion__title" v-if="peca.isOpen">
                                                <button class="mdl-button add-peca" @click="setValue(peca, [], [])" v-if="!peca.isClicked">
                                                    {{$t('Adicionar Peça')}}<i class="material-icons">add</i>
                                                </button>
                                                <button class="mdl-button green add-peca" v-if="peca.isClicked">
                                                    {{$t('Peça Adicionada')}}<i class="material-icons">check</i>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mdl-dialog__content shadow" v-if="pecas && pecas.length == 0">
                                    <h5 class="mdl-dialog__title">Falha ao buscar catálogo</h5>
                                    <button id="tentar_novamente" class="mdl-button add-peca grey" @click="recarrega"> Tentar novamente </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import { like } from '@/utils/'
import TheSnackBar from '@/components/layout/TheSnackBar'
import InputBarcode from '../barcode/InputBarcode.vue'
import InputChip from '../InputChip.vue'
export default {
  name: 'PartsSelectionDialog',
  components: {TheSnackBar, InputBarcode, InputChip},
  data: () => ({
    searchTerm: '',
    farol: true,
    ativaFiltroDeSerie: false,
    serieDate: false,
    snackshow: false,
    pecaLivre: {
      peca: '',
      ocorrencia: '',
      fctao: ''
    },
    messagePecaLivre: '',
    listFctao: [
      {fctaoId: 'A', fctaoDescription: 'Aplicado'},
      {fctaoId: 'C', fctaoDescription: 'Consertado'},
      {fctaoId: 'F', fctaoDescription: 'Faltante'},
      {fctaoId: 'O', fctaoDescription: 'Orientação de uso'},
      {fctaoId: 'T', fctaoDescription: 'Trocado'}
    ],
    listFctaoItens: [
      {id: 'A', titulo: 'Aplicado'},
      {id: 'C', titulo: 'Consertado'},
      {id: 'F', titulo: 'Faltante'},
      {id: 'O', titulo: 'Orientação de uso'},
      {id: 'T', titulo: 'Trocado'}
    ]
  }),
  props: {
    id: {
      required: true
    },
    texto: {
      required: true
    },
    pecas: {
      required: true
    },
    jsonPath: {
      default: function () {
        return [
          'modelos',
          'material',
          'pecas',
          'ocorrencia',
          'fcta'
        ]
      }
    },
    currentValue: {
      required: true
    },
    preResp: {
      required: true
    },
    mascara: {
      default: ''
    },
    livre: {
      type: Boolean,
      default: false
    }
  },
  beforeMount () {
    this.clear()
  },
  mounted () {
    if (this.livre) {
      this.clear()
    }
  },
  beforeUpdate () {
    if (this.preResp) {
      this.serieDate = this.getDateFromSerie(this.preResp.serie)
      if (this.serieDate) {
        this.ativaFiltroDeSerie = true
      }
    }
  },

  computed: {
    lastDepth () {
      return this.jsonPath ? this.jsonPath[this.jsonPath.length - 1] : ''
    }
  },
  methods: {
    recarrega () {
      this.$bus.$emit('tasks-sync', true)
      this.$el.querySelector('#tentar_novamente').innerHTML = 'Aguarde'
      this.$el.querySelector('#tentar_novamente').disabled = true
    },
    clear () {
      this.searchTerm = ''
      this.pecaLivre = {
        peca: '',
        ocorrencia: '',
        fctao: ''
      }
    },
    codBarReturn (e, value) {
      this.searchTerm = e.target.value
      if (e.target.value != '') {
        Object.values(this.pecas).forEach(item => {
          if (item.partId && this.searchTerm && item.partId == this.searchTerm) {
            item.isOpen = true
            for (let idx in item.ocorrencia) {
              if (item.ocorrencia.hasOwnProperty(idx)) {
                item.ocorrencia[idx].isOpen = false
              }
            }
          } else {
            item.isOpen = false
          }
        })
      }
    },
    isVisible (item) {
      let value = ''
      const _self = this
      const preRespVersion = this.getEngVersion(this.preResp.versao)
      for (let key in item) {
        if (typeof item[key] == 'string') {
          value += (item[key]).replace(/\s\s+/g, ' ') + ' '
        }
      }
      let flagEng = true
      let flagSerie = true
      if (this.farol && this.preResp.sku && this.preResp.versao && this.preResp.serie) {
        if (preRespVersion && Object.values(item.versao).length > 0) {
          flagEng = Object.values(item.versao).filter(version => {
            return parseInt(version.versionId) == parseInt(preRespVersion)
          }).length > 0
        }

        // if (!_self.ativaFiltroDeSerie) {
        //   flagSerie = true
        // }

        if (_self.serieDate && Object.values(item.serie).length > 0) {
          flagSerie = Object.values(item.serie).filter(serie => {
            const dateFrom = _self.getDateFromSerie(serie.serialNumberFrom)
            const dateTo = _self.getDateFromSerie(serie.serialNumberTo)
            return (_self.serieDate >= dateFrom && _self.serieDate <= dateTo)
          }).length > 0

          if (flagSerie) {
            _self.filtroSerieNumber = flagSerie
          }
        } else if (_self.ativaFiltroDeSerie) {
          flagSerie = true
        }
      }

      return flagEng && flagSerie && (!this.searchTerm || this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', value.toUpperCase()))
    },
    getEngVersion (version) {
      if (!version || version.length != 3 || !version.match(/^\w{3}$/gmi)) {
        return false
      }
      return version
    },
    getDateFromSerie (serie) {
      const currDate = new Date()
      if (serie == '>>>') {
        return currDate
      }
      if (!serie || serie.length < 3 || !serie.substr(0, 3).match(/[A-Z]{2}\d/gmi)) {
        return false
      }
      let month = (serie.substr(1, 1).toUpperCase().charCodeAt(0) - 65)
      if (month > 12) {
        return false
      }
      let year = parseInt((currDate.getFullYear() + '').substr(0, 3) + serie.substr(2, 1))
      if (year > currDate.getFullYear() || (year == currDate.getFullYear() && month > currDate.getMonth())) {
        year -= 10
      }
      return new Date(year, month, 1, 0, 0, 0)
    },
    setValueLivre (peca, ocorrencia, fctao) {
      if (!peca) {
        this.messagePecaLivre = this.$t('Nome da peça é obrigatório!')
      } else {
        this.messagePecaLivre = ''
        const value = {
          peca: {
            codigo: peca,
            nome: peca
          },
          ocorrencia: {
            codigo: ocorrencia,
            nome: ocorrencia
          },
          fctao: {
            codigo: fctao.fctaoId,
            nome: fctao.fctaoDescription
          },
          quantidade: 1
        }
        this.pecaLivre.isClicked = true
        this.setValueGeneric(value)
        setTimeout(() => {
          this.$forceUpdate()
          this.pecaLivre.isClicked = false
        }, 500)
      }
    },
    setValue (peca, ocorrencia, fctao) {
      var value = {
        peca: {
          codigo: peca.partId,
          nome: peca.partDescription
        },
        ocorrencia: {
          codigo: ocorrencia.claimedDefectId,
          nome: ocorrencia.claimedDefectDescription
        },
        fctao: {
          codigo: fctao.fctaoId,
          nome: fctao.fctaoDescription
        },
        quantidade: 1
      }
      peca.isClicked = true
      fctao.isClicked = true
      this.snackshow = true
      this.setValueGeneric(value)
      setTimeout(() => {
        this.$forceUpdate()
        peca.isClicked = false
        fctao.isClicked = false
      }, 500)
    },
    setValueGeneric (value) {
      this.snackshow = true
      this.$root.dialogOpen = false
      this.$root.cardContent = false
      this.$emit('input', value)
      if (this.livre) {
        this.clear()
      }
      this.$forceUpdate()
      setTimeout(() => {
        this.$forceUpdate()
        this.snackshow = false
      }, 1500)
    },
    showMessageNoOcorrencies () {
      this.$bus.$emit('showSnackBar', {
        message: this.$t('Nenhuma Ocorrencia para essa Peça!'),
        duration: 1500
      })
    },
    clickHandler (item) {
      item.isOpen = !item.isOpen
      this.$forceUpdate()
      setTimeout(() => {
        window.checkDirty()
      }, 100)
    },
    clickCodSub (item) {
      if (item['codSub']) {
        this.searchTerm = item['codSub']
      }
    },
    getDescription (item) {
      let description = ''
      for (let key in item) {
        if (typeof item[key] == 'string' && this.$t(item[key])) {
          if (description) {
            if (key == 'applicability') {
              description += '<small><b>' + this.$t(key) + ': </b> ' + this.$t('applicability-' + item[key]) + '</small><br>'
            } else {
              description += '<small><b>' + this.$t(key) + ': </b> ' + this.$t(item[key]) + '</small><br>'
            }
          } else if (key == 'codSub') {
            description += '<button class="mdl-button  searchSubPart">' + this.$t('Cod Sub') + ':  ' + this.$t(item[key]) + '<i class="material-icons">search</i></button><br>'
          } else if (key == 'statusDesc') {
            description += ''
          } else {
            description += '<b>' + this.$t(key) + ':  ' + this.$t(item[key]) + '</b><br>'
          }
        }
      }
      return description
    },
    validFctao (peca, fctao) {
      if (peca.applicability == 3) {
        if (fctao.fctaoId != 'O' && fctao.fctaoId != 'C') {
          return false
        }
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
  .recursive-accordion__item.title {
    margin-bottom: 8px
  }
  .livre {
    .recursive-accordion__item {
      margin: -8px -17px 5px;
      padding: 0 16px;
      &.active {
        background: rgba(0, 0, 0, 0.08);
      }
    }
  }
  .recursive-accordion__icon {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
  }

  .recursive-accordion__title {
    position: relative;
    display: block;
    border-bottom: 1px solid #E3E3E3;
    padding: 10px 0;
    &.pad {
      border-bottom: 0;
      padding: 0;
    }
    .mdl-textfield {
      margin-bottom: 0;
      margin-top: 0;
    }
  }

  .recursive-accordion--depth-0 {
    > .recursive-accordion__item {
      padding-left: 16px !important;
      padding-bottom: 10px;

      .recursive-accordion__title {
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: wrap;
        border-bottom: 0;
        padding: 0;
      }

      .item-name {
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.017em;
      }
      .recursive-accordion__icon {
        display: none;
      }
      .descricaoItem {
        font-size: 14px;
        margin-bottom: 4px;
        line-height: 17px;
        letter-spacing: 0.017em;
      }
    }
  }
  .item-name {
    font-weight: bold !important;
    color: black;
  }

  .recursive-accordion {

    .descricaoItem {
      font-size: 14px;
      line-height: 17px;
      letter-spacing: 0.017em;
      color: rgb(49, 49, 49);
      padding-right: 24px;
      display: block;
    }
    .codSub {
      margin-top: 15px;
      text-align: center;
      display: flex;
      width: 100%;
    }
    .radioFctaGroup {
      margin-bottom: 0;
    }

  }

  .recursive-accordion--depth-6 {
    .recursive-accordion__title {
      padding-top: 4px;
      padding-bottom: 4px;
      .item-name {
        display: none;
      }
    }
    .recursive-accordion__item {
      padding-left: 4px;
      &.active {
        //background: rgba(0, 0, 0, 0.08);
      }
    }
  }
  .barcode {
    position: fixed;
    top: 56px;
    z-index: 99;
    width: 100%;
    background: #fff;
  }
  .accordion__pecas {
    padding-top: 58px;
  }
  p.full {
    width: 100%;
  }
  .dialogPartSelection {
    overflow: hidden;
  }
  .searchSubPart {
    margin-top: 15px;
  }
  .shadow {
    box-shadow: black 0px 1px 3px;
  }
  .garantia-description {
    text-align: right
  }
  .pecaLivre-fctao {
    text-align: left;
    margin: 10px 0;
  }
  .mdl-button {
    border-radius: 4px;
  }

</style>
