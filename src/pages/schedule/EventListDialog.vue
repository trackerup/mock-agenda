<template>
  <div>
    <div class="mdl-dialog full full-fixed dialogPartSelection" id="partsSelectionDialog">
      <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
          <div class="mdl-layout__header-row">
            <div class="flex-start">
              <button @click="$emit('cancel')" class="mdl-button mld-button-icon-text button-back">
                <i class="material-icons">keyboard_arrow_left</i>
                {{ $t('Voltar') }}
              </button>
            </div>
            <h5 class="pageTitle">{{ $t('Agenda') }}</h5>
            <div class="flex-end"></div>
          </div>
        </header>
        <main class="mdl-layout__content">
          <div class="page-content">
            <div class="textfield-with-icon">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl>
                <input ref="input-pesquisa" class="mdl-textfield__input" type="text" id="passwordInput" v-model="searchTerm">
                <label class="mdl-textfield__label" for="passwordInput">{{ $t('Pesquisa') }} </label>
              </div>
              <i class="material-icons">search</i>
            </div>
            <EventList :events="events" :searching="searching" :searchTerm="searchTerm" v-on:on-event-click="clickEvent"></EventList>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { like } from '@/utils/'
import EventList from './EventList'

export default {
  name: 'EventListDialog',
  components: { EventList },
  props: {
    events: {
      required: true
    },
    searching: {
      required: true
    }
  },
  data: () => ({
    searchTerm: ''
  }),
  mounted () {
    // setTimeout(() => {
    //   this.$refs['input-pesquisa'].focus()
    //   this.$refs['input-pesquisa'].parentNode.classList.add('is-dirty')
    // }, 100)
  },
  computed: {
    groupByLocalEvents () {
      return this.groupBy(this.events, (event) => event.idLocal)
    }
  },
  methods: {
    clickEvent (event) {
      this.$emit('on-event-click', event)
    },
    isVisible (index) {
      return this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', index.toUpperCase())
    },
    groupBy (list, keyGetter) {
      const map = {}
      list.forEach((item) => {
        const key = keyGetter(item)
        const collection = map[key]
        if (!collection) {
          map[key] = [item]
        } else {
          collection.push(item)
        }
      })
      return map
    }
  }
}
</script>

<style lang="scss">
.mdl-data-table th {
  color: white;
}
</style>
