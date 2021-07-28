<template>
  <div class="orientacao">
    {{ description }}
  </div>
</template>
<script>
export default {
  name: 'OrientationField',
  data: () => ({}),
  props: {
    description: {
      type: String,
      required: true
    }
  }
}
</script>
