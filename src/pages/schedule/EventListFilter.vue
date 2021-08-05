<template>
  <div>
    <div :class="{'mdl-card mdl-shadown-2dp': (hasFilter || filtering)}">
      <h5 v-if="filtering">{{$t('Filtros')}}</h5>
      <div class="mdl-gri center">
        <template v-for="item in filters">
          <span v-if="filtering || filter[item.key]"  :key="item.key" :class="{'mdl-chip-selected': filter[item.key], 'mdl-chip mdl-chip--contact': filtering}" @click="$emit('doFilter', item.key)">
              <a href="#" class="mdl-chip__action"><i class="material-icons">{{item.icon}}</i></a>
              <span class="mdl-chip__text" v-if="filtering" >{{$t(item.title)}}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventListFilter',
  components: { },
  props: {
    filter: {},
    filtering: {}
  },
  data: () => ({
    filters: [
      {
        key: 'frequencia',
        title: 'Alta frequência',
        icon: 'report'
      },
      {
        key: 'near_me',
        title: 'Perto de mim',
        icon: 'near_me'
      },
      {
        key: 'fisica',
        title: 'Físicas',
        icon: 'home'
      },
      {
        key: 'virtual',
        title: 'Virtuais',
        icon: 'wifi'
      },
      {
        key: 'hcs',
        title: 'HCS',
        icon: 'person'
      },
      {
        key: 'pdv',
        title: 'PDV',
        icon: 'local_pharmacy'
      },
      {
        key: 'appointment',
        title: 'Apontamentos',
        icon: 'bookmark'
      }
    ]
  }),
  computed: {
    hasFilter () {
      if (this.filter && Object.values(this.filter).indexOf(true) >= 0) {
        return true
      }
      return false
    }
  },
  mounted () {
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="scss">
.center {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
.app-content .mdl-chip.mdl-chip-selected {
  background: var(--primaryColor);
  color: #fff
}
.app-content .mdl-chip-selected .mdl-chip__action {
    color: var(--primaryColor)
}
.app-content .mdl-chip.mdl-chip-selected .mdl-chip__action{
    color: #fff
}
</style>
