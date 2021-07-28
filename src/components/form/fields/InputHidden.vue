<template>
  <input type="hidden" :value="value" />
</template>

<script>
import TRInputBase from './InputBase.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'InputHidden',
  extends: TRInputBase,
  props: {
    metaDados: {
      default: []
    }
  },
  computed: {
    ...mapGetters({
      defaultPreResp: 'task/defaultPreResp'
    })
  },
  data: () => ({}),
  mounted () {
    const _defaultPreResp = this.$store.getters['task/defaultPreResp']
    let ancora = Object.values(this.metaDados).find(metaDado => metaDado.meta_key == 'ancora')
    if (ancora && _defaultPreResp && typeof _defaultPreResp[ancora.meta_value] != 'undefined') {
      this.$emit('input', _defaultPreResp[ancora.meta_value], this.id)
    }
  },
  methods: {
    getValue () {
      let ancora = Object.values(this.metaDados).find(metaDado => metaDado.meta_key == 'ancora')
      this.$emit('input', this.defaultPreResp[ancora.meta_value], this.id)
    }
  }
}
</script>
