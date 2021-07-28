<template>

  <div class="mdl-card expand">
    <h6 @click="triggerExpand" :class="{'active': expand}">{{ $t(title) }}
      <span class="arrow-button">
        <i class="material-icons">arrow_drop_down</i>
      </span>
    </h6>
    <div class="mdl-grid mdl-grid--no-spacing dados" :class="{'active': expand}">
      <div class="col">
         <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardExpand',
  data: () => ({
    expand: false
  }),
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    triggerExpand () {
      this.expand = !this.expand
    }
  }
}
</script>
