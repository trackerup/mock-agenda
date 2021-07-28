<template>
  <div class="task-description">
    <div class="mdl-card" v-if="false">
      <h6>{{ $t('Horário') }}</h6>
      <div class="mdl-grid mdl-grid--no-spacing dados">
      <div class="col">{{ $t('Início:') }} {{ task.planedStart | formatJsonTime }}</div>
      <div class="col text-right">{{ $t('Término:') }} {{ task.planedEnd | formatJsonTime }}</div>
      </div>
    </div>

    <div class="mdl-card">
      <h6>{{ $t('Período') }}</h6>
      <div class="mdl-grid mdl-grid--no-spacing dados">
        <div class="col">{{ periodo }}</div>
      </div>
    </div>

    <card-expand :title="$t('Observações')" v-if="currentTask.comentario != null && currentTask.comentario != ''">
      <div v-html="limpaComent(currentTask.comentario)"></div>
    </card-expand>

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
            <span class="icon-comment" v-if="comment.tipo == 'tecnico'">
                <i class="material-icons">
                feedback
                </i>
            </span>
          </li>
        </template>
      </ul>
    </card-expand>

    <template v-for="(meta, index) in metaData" >
      <card-expand :title="meta.meta_key" :key="index" v-if="isDetalheMeta(meta)">
        <ul class="mdl-list lista-dados" v-if="typeof meta.meta_value == 'object'">
            <li class="mdl-list__item mdl-list__item--two-line" v-for="(value, key) in meta.meta_value" :key="key">
            <span class="mdl-list__item-primary-content">
                <h6>{{ $t(key)}}</h6>
                <span class="" v-if="key == 'DATA DO CHAMADO'">
                    {{value | formatDataMeta}}
                </span>
                <span v-else>
                {{value}}
                </span>
            </span>
            </li>
        </ul>
        <span v-else>
            {{meta.meta_value }}
        </span>
      </card-expand>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardExpand from '@/components/layout/CardExpand'

import moment from 'moment'

export default {
  name: 'TaskDescription',
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
    periodo () {
      return this.currentTask.planedStart == '{"hora":7,"minuto":0}' ? this.$t('Manhã') : this.$t('Tarde')
    },
    metaData () {
      let metaData = []
      if (this.currentTask.metaDados) {
        for (let idx in this.task.metaDados) {
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
    }
  },
  methods: {
    limpaComent (coment) {
      var re = new RegExp(String.fromCharCode(160), 'g')
      return coment.replace(re, ' ')
    },
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
