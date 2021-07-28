<template>
  <div class="mdl-card taskitem">
    <div class="row row-titulo">
      <div class="status-title">
        <!-- 'interrompida','pendente', 'travelStarted', 'travelDone', 'iniciada' -->
        <div class="status">{{ $t(currentTask.status) | capitalize }}</div>
        <div class="title">{{ $t('Nº da OS') }} {{ numOS }}</div>
      </div>
    </div>
    <div class="row">
      <div class="location-icon">
        <i class="material-icons">location_on</i>
      </div>
      <div class="address">
        {{ currentTask.endereco }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardExpand from '@/components/layout/CardExpand'

import moment from 'moment'

export default {
  name: 'TaskTitle',
  components: {
    CardExpand
  },
  props: {
    task: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: 0,
          title: '',
          status: '',
          address: ''
        }
      }
    }
  },
  mounted () {
    let divs = document.getElementsByClassName('expandNow')
    for (let i = 0; i < divs.length; i++) {
      const element = divs[i]
      element.childNodes[0].childNodes[0].childNodes[2].click()
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask'
    }),
    numOS () {
      let numOs = this.task.id
      if (this.task.metaDados) {
        for (let idx in this.task.metaDados) {
          if (this.task.metaDados[idx].meta_key == '__OS') {
            return this.task.metaDados[idx].meta_value
          }
        }
      }
      return numOs
    }
  },
  methods: {
    isDetalheMeta (meta) {
      if (meta.meta_key.indexOf('__') != 0) {
        if (typeof meta.meta_value == 'string') {
          if (meta.meta_value != '' && meta.meta_value != '[]') {
            return true
          }
        } else if (typeof meta.meta_value == 'object') {
          return Object.keys(meta.meta_value).length > 0
        } else {
          return true
        }
      }
      return false
    }
  },
  filters: {
    formatDataMeta: function (value) {
      if (value) {
        return value.slice(6, 8) + '/' + value.slice(4, 6) + '/' + value.slice(0, 4)
      } else {
        return value
      }
    },
    formatDataComment: function (value) {
      if (value) {
        try {
          return moment(value).format('DD/MM/YYYY HH:mm:ss')
        } catch (error) {
          return value
        }
      } else {
        return value
      }
    }
  }
}

</script>
