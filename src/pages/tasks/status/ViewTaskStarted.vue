<template>
    <div class="task-started">
      <div class="mdl-card expand limited" v-if="!$root.dialogOpen">
        <h4>{{ $t('Nº da OS') }} {{ numOS }}</h4>
        <div class="detalhes-tarefa">
          <center><small>{{ tipoOS }}</small></center>
          <card-expand title="Comentários" key="historicoOS" v-if="currentTask.historico && currentTask.historico.length">
            <ul class="mdl-list lista-dados">
              <template v-for="(comment,index) in currentTask.historico" >
                <li class="mdl-list__item mdl-list__item--two-line" :key="index">
                  <span class="mdl-list__item-primary-content">
                    <h6>{{comment.mensagem}}</h6>
                    <span>
                      {{comment.data | formatDataComment}}
                    </span>
                  </span>
                </li>
              </template>
            </ul>
          </card-expand>
          <template v-for="(meta, index) in metaData" >
            <card-expand :title="$t(meta.meta_key)" :key="index" v-if="isDetalheMeta(meta) && meta.meta_key == 'Dados do Cliente'">
              <ul class="mdl-list lista-dados" v-if="typeof meta.meta_value == 'object'">
                <li class="mdl-list__item mdl-list__item--two-line" v-for="(value, key) in meta.meta_value" :key="key">
                  <span class="mdl-list__item-primary-content">
                    <h6>{{$t(key)}}</h6>
                    <span class="">
                      {{value}}
                    </span>
                  </span>
                </li>
              </ul>
            </card-expand>
          </template>

          <card-expand v-if="currentTask.comentario != null && currentTask.comentario != ''" :title="$t('Observações')">
            <div class="lista-dados" v-html="currentTask.comentario"></div>
          </card-expand>
        </div>
      </div>
      <task-form-wizard v-if="hasWizzard"></task-form-wizard>
      <task-form v-else></task-form>
    </div>
</template>

<script>
import TaskTitle from '@/components/shared/task/TaskTitle.vue'
import { mapGetters } from 'vuex'
import CardExpand from '@/components/layout/CardExpand'

import moment from 'moment'
import TaskForm from './started/TaskForm.vue'
import TaskFormWizard from './started/TaskFormWizard.vue'

export default {
  components: {
    TaskTitle,
    CardExpand,
    TaskForm,
    TaskFormWizard
  },
  data () {
    return {
    }
  },
  watch: {
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
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      tasks: 'task/tasks',
      user: 'user/user'
    }),
    numOS () {
      let numOs = this.currentTask.id
      if (this.currentTask.metaDados) {
        for (let idx in this.currentTask.metaDados) {
          if (this.currentTask.metaDados[idx].meta_key == '__OS') {
            return this.currentTask.metaDados[idx].meta_value
          }
        }
      }
      return numOs
    },
    tipoOS () {
      let numOs = ''
      if (this.currentTask.metaDados) {
        for (let idx in this.currentTask.metaDados) {
          if (this.currentTask.metaDados[idx].meta_key == 'OS') {
            if (typeof this.currentTask.metaDados[idx].meta_value == 'object') {
              return this.currentTask.metaDados[idx].meta_value['TIPO DE OS']
            } else {
              return JSON.parse(this.currentTask.metaDados[idx].meta_value)['TIPO DE OS']
            }
          }
        }
      }
      return numOs
    },
    metaData () {
      let metaData = []
      if (this.currentTask.metaDados) {
        for (let idx in this.currentTask.metaDados) {
          if (!this.currentTask.metaDados[idx].meta_key.startsWith('__')) {
            try {
              metaData.push({
                meta_key: this.currentTask.metaDados[idx].meta_key,
                meta_value: JSON.parse(this.currentTask.metaDados[idx].meta_value)
              })
            } catch (err) {
              metaData.push(this.currentTask.metaDados[idx])
            }
          }
        }
      }
      return metaData
    },
    hasWizzard () {
      if (!this.currentTask.metaDados) {
        return false
      }
      const wizardCode = this.currentTask.metaDados.filter(eleme => { return eleme.meta_key == '__WIZARD_CODE' })[0]
      const dadosOS = this.currentTask.metaDados.filter(eleme => { return eleme.meta_key == '__dados_os' })[0]
      let metaDadosDadosOs = false
      if (typeof dadosOS != 'undefined') {
        metaDadosDadosOs = JSON.parse(dadosOS.meta_value).orderId
      }
      return wizardCode && ((dadosOS && metaDadosDadosOs) || parseInt(wizardCode.meta_value) > 0)
    }
  },
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Em atendimento'),
      mapMenu: false,
      backMenu: true,
      routeMap: '/taskMap'
    })
  },
  filters: {
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
