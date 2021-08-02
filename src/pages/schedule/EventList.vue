<template>
  <div class="mdl-data-table-container">
    <template v-for="(locais, index) in groupByLocalEvents">
      <table class="mdl-data-table mdl-shadow--2dp" :key="index" v-if="isVisible(locais, index)">
        <thead class="background-secondary-color">
          <tr @click="$emit('openPlacesEditDialog', index)">
            <th class="orange mdl-data-table__cell--non-numeric" >
              {{ index }}
            </th>
            <th class="">
              {{ getDistance(index) | distanceMask}}
              <span id="nav-icon"><i class="material-icons message">edit</i></span>
            </th>
          </tr>
        </thead>
        <tbody v-if="isVisible(locais, index)">
          <template v-for="event in locais">
            <tr :key="event.id" @click="clickEvent(event)" v-if="isEventVisible(event, index)">
              <td class="mdl-data-table__cell--non-numeric" v-html="event.content"></td>
              <td class="mdl-data-table__cell--non-numeric" :class="{'event-done': event.status == 1}">
                <span>{{ event.start | formatDateTime }}</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
import { like } from '@/utils/'
import { mapGetters } from 'vuex'

export default {
  name: 'EventList',
  components: { },
  props: {
    events: {
      required: true
    },
    searching: {
      required: true
    },
    searchTerm: {
      required: true
    },
    filter: {
      required: false
    }
  },
  data: () => ({
    groupByLocalEvents: []
  }),
  mounted () {
    this.groupByLocalEvents = this.groupBy(this.events, (event) => event.idLocal)
  },
  computed: {
    ...mapGetters({
      coords: 'user/coords'
    })
  },
  methods: {
    clickEvent (event) {
      this.$emit('on-event-click', event)
    },
    isVisible (locais, index) {
      const _find = this.searchTerm == '' || like('%' + this.searchTerm.toUpperCase() + '%', index.toUpperCase())
      if (_find) {
        let _filter = true
        if (this.filter.frequencia) {
          if (locais.length <= 1) {
            _filter = false
          }
        }
        if (this.filter.near_me) {
          if (this.getDistance(index) > 600) {
            _filter = false
          }
        }
        if (this.filter.fisica) {
          if (!locais.find(event => { return event.latitude && event.longitude && event.tipo != 3 })) {
            _filter = false
          }
        }
        if (this.filter.virtual) {
          if (!locais.find(event => { return event.tipo == 3 })) {
            _filter = false
          }
        }
        if (this.filter.appointment) {
          if (!locais.find(event => { return event.tipo == 2 })) {
            _filter = false
          }
        }
        if (this.filter.pdv) {
          if (!locais.find(event => { return event.category == 'PDV' })) {
            _filter = false
          }
        }
        if (this.filter.hcs) {
          if (!locais.find(event => { return event.category == 'HCS' })) {
            _filter = false
          }
        }
        return _filter
      }
      return false
    },
    isEventVisible (event, index) {
      let _filter = true
      if (this.filter.fisica) {
        if (!event.latitude || !event.longitude || event.tipo == 3) {
          _filter = false
        }
      }
      if (this.filter.virtual) {
        if (event.tipo != 3) {
          _filter = false
        }
      }
      if (this.filter.appointment) {
        if (event.tipo != 2) {
          _filter = false
        }
      }
      return _filter
    },
    getDistance (index) {
      const _event = this.groupByLocalEvents[index][0]
      if (_event) {
        return this.$routeService.medir(this.coords.latitude, this.coords.longitude, _event.latitude, _event.longitude)
      }
      return 0
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
  },
  filters: {
    distanceMask: function (distance) {
      if (distance > 1000) {
        return `${(distance / 1000).toFixed(2)} km`
      } else {
        return `${distance} m`
      }
    }
  }
}
</script>

<style lang="scss">
.mdl-data-table {
  margin-bottom: 5px;
  width: 95%;
  margin-left: 2.5%;
}
.mdl-data-table-container {
  padding-bottom: 50px;
}
.event-done span {
  text-decoration: line-through;
}
.event-done:after {
    font-family: "Material Icons";
    content: "\e876";
    color: green;
    font-size: 20px;
    text-decoration: none;
}
</style>
