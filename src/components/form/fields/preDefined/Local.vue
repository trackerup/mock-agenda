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

        let distancia = this.$routeService.medir(coords.latitude, coords.longitude, local.lat, local.lng)

        if (index == 0 || distancia < distanciaAtual) {
          distanciaAtual = distancia

          localProximo = local
        }
      }
      return localProximo
    }
  }
}
</script>

<style scoped>
  .LocalValue {
    text-align: center;
  }
</style>
