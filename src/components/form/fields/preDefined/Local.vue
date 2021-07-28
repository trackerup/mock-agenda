<template>
  <div class="inputPredefinedLocal">
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Local',
  props: {
    value: {
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      locals: 'locals/locais',
      coords: 'user/coords'
    })
  },
  async beforeMount () {
    await this.$store.dispatch('locals/getLocals', {})
  },
  mounted () {
    const _currentUserCoord = this.$store.getters['user/coords']
    if (_currentUserCoord) {
      let locais = this.$store.getters['locals/locais']
      let localItem = this.buscaLocalProximo(_currentUserCoord, locais)
      if (localItem) {
        this.$emit('input', localItem.id)
      }
    }
  },
  methods: {
    getValue () {
      this.$emit('input', this.value)
      return this.value
    },
    onInput (value) {
      this.$emit('input', value, this.id)
    },
    buscaLocalProximo: function (coords, locais) {
      let distanciaAtual = null
      let localProximo = null

      for (let index = 0; index < locais.length; index++) {
        const local = locais[index]

        let distancia = this.medir(coords.latitude, coords.longitude, local.lat, local.lng)

        if (index == 0 || distancia < distanciaAtual) {
          distanciaAtual = distancia

          localProximo = local
        }
      }
      return localProximo
    },
    medir: function (lat1, lng1, lat2, lng2) {
      lat1 = parseFloat(lat1)
      lng1 = parseFloat(lng1)
      lat2 = parseFloat(lat2)
      lng2 = parseFloat(lng2)

      var R = 6378.137 // Radius of earth in KM
      var dLat = (lat2 - lat1) * Math.PI / 180
      var dLon = (lng2 - lng1) * Math.PI / 180
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      var d = R * c

      return Math.round(d * 1000) // meters
    }
  }
}
</script>

<style scoped>
  .LocalValue {
    text-align: center;
  }
</style>
