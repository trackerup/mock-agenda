<template>
  <div class="mdl-grid hour-item">
    <div class="mdl-toolbar-section-start body-1">
      {{ model.period }}
    </div>
    <div class="reordernar" v-if="this.$parent.allowOrder && this.showreorder">
      <button v-show="this.$parent.orderName == '' || this.$parent.orderName == model.name" class="mdl-button mdl-button--raised mld-button-small mdl-button--colored orange" :class="[this.$parent.orderName == model.name ? 'green' : '']" @click="$emit('reorder', model.name)">
          <span v-show="this.$parent.orderName == ''">
            {{ $t('Reordenar') }}
          </span>
          <span v-show="this.$parent.orderName == model.name">
              {{ $t('Salvar') }}
          </span>
      </button>
    </div>
    <div class="mdl-toolbar-section-end mdl-caption">
    </div>
  </div>
</template>
<script>
export default {
  name: 'HourSeparator',
  data: () => ({}),
  props: {
    showreorder: false,
    model: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: '',
          time: '',
          period: '',
          reorder: ''
        }
      }
    }
  }
}
</script>
