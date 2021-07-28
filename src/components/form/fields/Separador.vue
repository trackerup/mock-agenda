<template>
  <div class="separador">
    {{ texto }}
  </div>
</template>

<script>
import TRInputBase from './InputBase.vue'

export default {
  name: 'Separador',
  extends: TRInputBase,
  data: () => ({})
}
</script>
