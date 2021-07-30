<template>
  <div class="client-address">
    <div class="mdc-elevation--z5 mdl-cell--12-col box-address box-adress">
      <div class="mdl-grid" style="position: relative;">
        <div class="mdl-cell mdl-cell--8-col mdl-grid">
          <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled fullwidth input-cep" ref="cep" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <input class="mdc-text-field__input cep" type="text" v-model="item.cep" @blur="buscaEndereco(item)" />
              <span class="mdc-floating-label">CEP *</span>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
          <div class="mdl-cell mdl-cell--9-col mdl-cell--6-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon fullwidth input-endereco" ref="endereco" data-mdc-auto-init="MDCTextField">
              <input class="mdc-text-field__input" type="text" v-on:keyup.enter="findLocal(item)" v-model="item.endereco" @blur="atualizaGeocode(item)">
              <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button" @click="findLocal(item)">search</i>
              <span class="mdc-floating-label">Logradouro *</span>
              <div class="mdc-line-ripple"></div>
            </label>

            <div class="autocomplete-menu" v-show="item.isOpen">
              <div class="mdc-menu mdc-menu-surface menu" :class="{ 'is-active': item.isOpen }" data-mdc-auto-init="MDCMenu">
                <ul id="autocomplete-results" role="menu" aria-orientation="vertical" class="autocomplete-results mdc-list">
                  <li class="loading-fabricantes" v-if="isLoading">
                    Carregando
                  </li>
                  <li v-else v-for="(result, i) in results" :key="i" @click="setResult(item, result)" class="autocomplete-result mdc-list-item">
                    <span class="mdc-list-item__text">{{ result.formatted_address }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled fullwidth input-numero" ref="numero" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <input class="mdc-text-field__input" type="text" v-model="item.numero" @blur="atualizaGeocode(item)"/>
              <span class="mdc-floating-label">Numero *</span>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
          <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled fullwidth input-complemento" ref="complemento" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <input class="mdc-text-field__input" type="text" v-model="item.complemento" />
              <span class="mdc-floating-label">Complemento</span>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
          <div class="mdl-cell mdl-cell--5-col mdl-cell--4-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled fullwidth input-bairro" ref="bairro" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <input class="mdc-text-field__input" type="text" v-model="item.bairro"/>
              <span class="mdc-floating-label">Bairro *</span>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
          <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled fullwidth input-cidade" ref="cidade" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <input class="mdc-text-field__input" type="text" v-model="item.cidade" @blur="atualizaGeocode(item)"/>
              <span class="mdc-floating-label">Cidade *</span>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
          <div class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">
            <label class="mdc-text-field mdc-text-field--filled fullwidth input-uf" ref="uf" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <input class="mdc-text-field__input uf" type="text" v-model="item.UF"/>
              <span class="mdc-floating-label">UF *</span>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
          <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet">
            <span class="mdc-label">Informações Adicionais</span>
            <label class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea fullwidth input-informacoes" ref="informacoes" data-mdc-auto-init="MDCTextField">
              <div class="mdc-text-field__ripple"></div>
              <textarea class="mdc-text-field__input" type="text" v-model="item.informacoes" rows="1"></textarea>
              <div class="mdc-line-ripple"></div>
            </label>
          </div>
        </div>
        <div class="delete-buttons box-buttons delete-button" v-if="showButtonAdd">
          <button class="mdc-fab mdc-fab--mini mdc-fab--touch red" @click="removeAdress(item)">
            <div class="mdc-fab__ripple"></div>
            <span class="material-icons mdc-fab__icon">delete</span>
            <div class="mdc-fab__touch"></div>
          </button>
        </div>
        <div class="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet">
          <Map :miniMap='false' :draggablePointToShowInMap="{lat: item.latitude, lng: item.longitude, index}" ref="Map" v-on:confirmPos="confirmPosMap"/>
        </div>
      </div>
    </div>
    <div class="mdc-dialog address-map" id="dialog-map" ref="dialogmap">
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface">
          <h2 class="mdc-dialog__title" id="my-dialog-title">Endereço no Mapa</h2>
          <div class="mdc-dialog__content" id="dialog-map-content">
            <div class="contaniner-map">
              <Map :search="currentItem != null" v-if="mapOpen" :draggablePointToShowInMap="pointToShowinMap" ref="Map" v-on:confirmPos="confirmPosMap"/>
            </div>
          </div>
          <footer class="mdc-dialog__actions">
            <button type="button" class="mdc-button mdc-dialog__button" @click="closeMap">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">Fechar</span>
            </button>
          </footer>
        </div>
      </div>
      <div class="mdc-dialog__scrim"></div>
    </div>
  </div>
</template>

<script>
import Map from '@/components/map/map'

export default {
  name: 'Address',
  props: {
    listaEnderecos: {},
    cliente: {},
    showButtonAdd: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Map
  },
  data () {
    return {
      isEdditing: false,
      pointToShowinMap: null,
      mapDialog: null,
      results: [],
      isLoading: false,
      menu: null,
      currentItem: null,
      mapOpen: false,
      endereco: '',
      validacep: /^[0-9]{8}$/
    }
  },
  mounted () {
    this.upgradeDOM()
    this.mapDialog = new window.mdc.dialog.MDCDialog((this.$el.querySelector('#dialog-map')))
  },
  methods: {
    upgradeDOM: function () {
      this.$forceUpdate()
      setTimeout(() => {
        window.componentHandler.upgradeDom()
        window.mdc.autoInit()
        window.jQuery('.cep').mask('00000-000')
        window.jQuery('.uf').mask('AA', {'translation': {
          A: {pattern: /[A-Za-z]/}
        }
        })
      }, 100)
    },
    newAdress: function () {
      let _self = this
      let newAddress = {
        'clienteId': _self.cliente.id,
        'id': null,
        'endereco': '',
        'bairro': '',
        'cep': '',
        'cidade': '',
        'UF': '',
        'informacoes': '',
        'pais': 'BR',
        'principal': '',
        'latitude': 0,
        'longitude': 0,
        'complemento': '',
        'numero': ''
      }

      _self.listaEnderecos.push(newAddress)
      _self.upgradeDOM()
      this.$emit('scrollToEnd')
    },
    removeAdress: function (value) {
      let _self = this
      _self.listaEnderecos.forEach(item => {
        if (item == value) {
          item.deleted = true
        }
      })
      _self.listaEnderecos.sort()
      this.upgradeDOM()
    },
    findLocal: function (item) {
      let _self = this
      let geocoder = new window.google.maps.Geocoder()
      _self.isLoading = true
      geocoder.geocode({ 'address': item.endereco }, function (results, status) {
        _self.results = []
        item.isOpen = true

        if (results.length > 0) {
          _self.results = results
        } else {
          _self.results = [{
            isNotValid: true,
            formatted_address: 'Endereço não Encontrado'
          }]
        }
        _self.$forceUpdate()
        setTimeout(() => {
          _self.menu = new window.mdc.menu.MDCMenu(document.querySelector('.mdc-menu.is-active'))
          _self.menu.open = true
          _self.isLoading = false
        }, 200)
      })
    },
    getAddressComponentsByType: function (address, typeSearch) {
      const _result = address.address_components.filter(ele => {
        return ele.types.filter(type => {
          return type === typeSearch
        }).length
      })
      return _result && _result.length ? _result[0].short_name : ''
    },
    setResult: function (item, address) {
      if (!address.isNotValid) {
        item.endereco = this.getAddressComponentsByType(address, 'route')
        item.cep = this.getAddressComponentsByType(address, 'postal_code')
        item.cidade = this.getAddressComponentsByType(address, 'administrative_area_level_2')
        item.UF = this.getAddressComponentsByType(address, 'administrative_area_level_1')
        item.informacoes = address.informacoes
        item.bairro = this.getAddressComponentsByType(address, 'sublocality_level_1')
        item.latitude = address.geometry.location.lat()
        item.longitude = address.geometry.location.lng()
        item.isOpen = false
        item.hide = true
        this.upgradeDOM()
        setTimeout(() => {
          item.hide = false
          this.upgradeDOM()
        }, 10)
      }
    },
    findMap: function (item) {
      this.currentItem = item
      this.currentItem.isOpen = false
      this.endereco = item.endereco
      this.mapOpen = true
      this.pointToShowinMap = false
      this.mapDialog.open()
    },
    closeMap: function () {
      this.mapOpen = false
      this.pointToShowinMap = false
      this.currentItem = null
      this.mapDialog.close()
    },
    confirmPosMap: function (returnData) {
      let geo
      if (returnData.geocode) {
        geo = {
          lat: returnData.result.geometry.location.lat(),
          lng: returnData.result.geometry.location.lng()
        }
      } else {
        geo = {
          lat: returnData.result.geometry.location.lat,
          lng: returnData.result.geometry.location.lng
        }
      }
      if (typeof (returnData.index) != 'undefined') {
        this.currentItem = this.filteredList[returnData.index]
      }
      this.currentItem.latitude = geo.lat
      this.currentItem.longitude = geo.lng
      // this.setResult(this.currentItem, returnData.result)
      // this.setResult(this.currentItem,returnData.result)
      this.currentItem = null
      this.closeMap()
    },
    showInMap: function (item) {
      let _self = this
      _self.mapOpen = true
      this.currentItem = item
      _self.pointToShowinMap = {lat: item.latitude, lng: item.longitude}
      _self.mapDialog.open()
      this.upgradeDOM()
    },
    buscaEndereco (item) {
      let cepNumber = item.cep.replace(/\D/g, '')
      if (this.validacep.test(cepNumber)) {
        window.cep(cepNumber).then((dados) => {
          item.hide = true
          // Atualiza os campos com os valores da consulta.
          item.endereco = dados.street
          item.bairro = dados.neighborhood
          item.cidade = dados.city
          item.UF = dados.state
          item.informacoes = dados.informacoes
          this.upgradeDOM()
          setTimeout(() => {
            item.hide = false
            this.upgradeDOM()
          }, 10)
          this.geocodeFromBusca(item).then((results) => {
            item.latitude = results[0].geometry.location.lat()
            item.longitude = results[0].geometry.location.lng()
            this.upgradeDOM()
          })
            .catch(() => {

            })
        }).catch(() => window.toast(window.__('CEP não encontrado.')))

        // Implementação somente viacep
        //  window.jQuery.ajax({
        //   type: "GET",
        //   url:"https://viacep.com.br/ws/"+ cep +"/json/?callback=?",
        //   dataType : "json",
        // }).done(( dados ) => {
        //     if (!("erro" in dados)) {
        //         item.hide = true
        //          //Atualiza os campos com os valores da consulta.
        //         item.endereco = dados.logradouro
        //         item.bairro = dados.bairro
        //         item.cidade = dados.localidade
        //         item.UF = dados.uf
        //         this.upgradeDOM()
        //         setTimeout(() => {
        //           item.hide = false
        //           this.upgradeDOM()
        //         }, 10);
        //         this.geocodeFromBusca(item).then((results) => {
        //             item.latitude = results[0].geometry.location.lat()
        //             item.longitude = results[0].geometry.location.lng()
        //             this.upgradeDOM()
        //         })
        //         .catch(() => {

        //         })
        //     }
        //     else {
        //       window.toast(window.__('CEP não encontrado.'));
        //     }
        // })
        //
      }
    },

    atualizaGeocode (item) {
      this.geocodeFromBusca(item).then((results) => {
        item.latitude = results[0].geometry.location.lat()
        item.longitude = results[0].geometry.location.lng()
        this.upgradeDOM()
      }).catch((err) => {
        console.log('Não foi possível encontrar o endereço', err)
      })
    },

    geocodeFromBusca (item) {
      let geocoder = new window.google.maps.Geocoder()
      return new Promise((resolve, reject) => {
        let search = {
          'address': `${item.endereco} ${item.numero}, ${item.cidade}, ${item.UF}, ${item.informacoes}, ${item.pais}`
        }
        geocoder.geocode(search, function (results, status) {
          if (results.length > 0) {
            resolve(results)
          } else {
            reject(status)
          }
        })
      })
    }

  },
  computed: {
    filteredList: function () {
      return this.listaEnderecos.filter(item => !item.deleted)
    }
  }
}
</script>

<style lang="sass">
  @import '../../scss/components/client/address.scss';
</style>
