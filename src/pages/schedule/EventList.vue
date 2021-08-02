<template>
  <div class="mdl-data-table-container">
    <template v-for="(locais, index) in groupByLocalEvents">
      <table class="mdl-data-table mdl-shadow--2dp" :key="index" v-if="isVisible(index)">
        <thead class="background-secondary-color">
          <tr @click="$emit('openPlacesEditDialog', index)">
            <th class="orange mdl-data-table__cell--non-numeric" >
              {{ index }}
            </th>
            <th class=""  >
              <span id="nav-icon"><i class="material-icons message">edit</i></span>
            </th>
          </tr>
        </thead>
        <tbody v-if="isVisible(index)">
          <template v-for="event in locais">
            <tr :key="event.id" @click="clickEvent(event)">
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
    }
  },
  data: () => ({
  }),
  mounted () {
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
