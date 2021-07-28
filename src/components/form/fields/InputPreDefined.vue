<template>
  <div>
    <div v-show="readOnly">
      <inicio
        ref="input"
        @input="setValue"
        :texto="texto"
        v-if="this.default == 'inicio'"
      />

      <inicio-hora
        ref="input"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'inicio_hora'"
      />

      <termino
        ref="input"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'termino'"
      />

      <termino-hora
        ref="input"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'termino_hora'"
      />

      <inicio-tarefa
        ref="input"
        :value="componentValue"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'inicio_tarefa'"
      />

      <fim-tarefa
        ref="input"
        :value="componentValue"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'fim_tarefa'"
      />

      <agent
        ref="input"
        :texto="texto"
        @input="setValue"
        :readOnly="readOnly"
        v-if="this.default == 'usuario'"
      />

      <ponto-geo
        ref="input"
        :value="componentValue"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'pontoGeo'"
      />

      <local
        ref="input"
        :value="componentValue"
        @input="setValue"
        :texto="texto"
        :readOnly="readOnly"
        v-if="this.default == 'local'"
      />

    </div>
  </div>
</template>
<script>
import {
  Agent,
  FimTarefa,
  Inicio,
  InicioHora,
  InicioTarefa,
  PontoGeo,
  Termino,
  Local,
  TerminoHora
} from '@/components/form/fields/preDefined'
import TRInputBase from './InputBase.vue'
import { mapGetters } from 'vuex'

export default {
  extends: TRInputBase,
  name: 'InputPreDefined',
  components: {FimTarefa, InicioTarefa, Inicio, InicioHora, Termino, TerminoHora, Agent, Local, PontoGeo},
  props: { },
  data () {
    return {
      componentValue: {}
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      tasks: 'task/tasks',
      user: 'user/user'
    })
  },
  async beforeMount () {
    this.componentValue = this.value
    if (this.default == 'pontoGeo') {
      this.componentValue = {
        lat: Number(this.tarefa.latitude),
        lng: Number(this.tarefa.longitude),
        endereco: this.tarefa.endereco
      }
    }
  },
  created () {
    this.data = new Date()
    // Forçando override do metodo
    this.getValue = function getValue () {
      if (this.$refs.input) {
        this.$refs.input.getValue()
      }
    }
  },
  methods: {
    setValue (value) {
      this.componentValue = value
      this.$emit('input', value, this.id)
      this.$emit('change', this.id)
    }
  }
}
</script>
