<template>
  <div class="orientacao" v-if="!readOnly" v-html="texto">
  </div>
</template>

<script>
import TRInputBase from './InputBase.vue'

export default {
  name: 'Orientacao',
  extends: TRInputBase,
  data: () => ({})
}
</script>
