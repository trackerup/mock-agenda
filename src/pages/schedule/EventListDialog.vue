<template>
  <div>
    <div class="mdl-dialog full full-fixed dialogPartSelection" id="partsSelectionDialog" v-if="!placesEditDialog">
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
            <div class="flex-end">
              <button class="mdl-button mld-button-icon-text button-back" v-if="!filtering" @click="filtering = !filtering" >
                {{$t('Filtrar')}}
                <span class="material-icons">filter_list</span>
              </button>
              <button class="mdl-button mld-button-icon-text button-back" v-else @click="filtering = !filtering" >
                {{$t('Buscar')}}
                <span class="material-icons">search</span>
              </button>
            </div>
          </div>
        </header>
        <main class="mdl-layout__content">
          <div class="page-content">
            <EventListSearch v-on:input="value => searchTerm = value" v-if="!filtering" />
            <EventListFilter :filter="filter" :filtering="filtering" v-on:doFilter="doFilter" />
            <EventList :events="events" :searching="searching" :searchTerm="searchTerm" :filter="filter" v-on:on-event-click="clickEvent"
              v-on:openPlacesEditDialog="openPlacesEditDialog"></EventList>
          </div>
        </main>
      </div>
    </div>
    <PlacesEditDialog v-else v-on:cancel="closePlacesEditDialog" v-on:savePlace="savePlace" :local="selectedLocal" />
  </div>
</template>

<script>
import { like } from '@/utils/'
import EventList from './EventList'
import EventListFilter from './EventListFilter'
import EventListSearch from './EventListSearch'
import PlacesEditDialog from '@/components/shared/PlacesEditDialog'

export default {
  name: 'EventListDialog',
  components: { EventList, PlacesEditDialog, EventListSearch, EventListFilter },
  props: {
    events: {
      required: true
    },
    searching: {
      required: true
    }
  },
  data: () => ({
    searchTerm: '',
    filtering: false,
    filter: {
      frequencia: false,
      near_me: false,
      fisica: false,
      virtual: false,
      hcs: false,
      pdv: false,
      appointment: false
    },
    placesEditDialog: false,
    selectedLocal: null
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
    },
    openPlacesEditDialog (selectedLocal) {
      this.selectedLocal = selectedLocal
      this.placesEditDialog = true
    },
    closePlacesEditDialog () {
      this.placesEditDialog = false
    },
    savePlace () {
      this.placesEditDialog = false
      this.$bus.$emit('showSnackBar', {
        message: this.$t('Alterações salvas com sucesso!'),
        duration: 2000
      })
    },
    doFilter (filter) {
      this.filter[filter] = !this.filter[filter]
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
.mdl-data-table th {
  color: white;
}
.mdl-layout__header-row .flex-end {
  padding-right: 15px;
}
</style>
