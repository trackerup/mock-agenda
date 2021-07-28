<template>
  <div>
    <div name="n" class="mdl-card taskitem" >
      <div class="row-conteudo">
      <div class="conteudo-card" @click="$router.push('/task/' + task.id)">
        <div class="row row-titulo">
                <div class="status-title">
                  <div class="status">{{ $t(task.status) | capitalize }}</div>
                  <div class="title">{{ numOS }}</div>
                </div>
                <div class="icon">
                  <i v-if="task.status == 'bloqueada' && (!task.responses || (task.responses && task.responses.length == 0))" class="material-icons grey">lock</i>
                  <i v-if="task.status == 'bloqueada' && task.responses && task.responses.length != 0" class="material-icons green">build</i>
                  <i v-if="task.status == 'travelStarted'" class="material-icons orange">near_me</i>
                  <i v-if="task.status == 'travelDone'" class="material-icons orange">location_on</i>
                  <i v-if="task.status == 'iniciada'" class="material-icons orange">play_circle_filled</i>
                  <i v-if="task.status == 'concluida'" class="material-icons green">check</i>
                  <i v-if="task.status == 'malsucedida'" class="material-icons red">close</i>
                </div>
              </div>
              <div class="row nowrap">
                <div class="location-icon">
                  <i class="material-icons">location_on</i>
                </div>
                <div class="address">
                  {{ task.endereco }}
                </div>
                 <div class="icon" v-if="task.historico && task.historico.length">
                  <i class="material-icons">comment</i>
                </div>
            </div>
      </div>
      <div class="reordenacao" :class="[this.$parent.orderName != '' && this.$parent.orderName == this.period ? 'ativo' : '']">
        <button @click="$emit('order', { id: task.id, direction: 'up'})">
          <i class="material-icons">
            arrow_upward
            </i>
        </button>
        <button @click="$emit('order', { id: task.id, direction: 'down' })">
          <i class="material-icons">
          arrow_downward
          </i>
        </button>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getOneTaskById } from '../../plugins/persistence/entities/tarefa'
export default {
  name: 'TaskItem',
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
  computed: {
    numOS () {
      let _numOs = this.task.nome ? this.task.nome : this.task.id
      if (!this.task.nome && this.task.metaDados) {
        for (let idx in this.task.metaDados) {
          if (this.task.metaDados[idx].meta_key == '__OS') {
            return this.task.metaDados[idx].meta_value
          }
        }
      }
      return _numOs
    },
    period () {
      let planedStartParsed = JSON.parse(this.task.planedStart)
      let planedStartHour = planedStartParsed.hora
      if ((planedStartHour >= 1) && (planedStartHour <= 6)) {
        return 'dawn'
      } else if ((planedStartHour >= 7) && (planedStartHour <= 12)) {
        return 'morning'
      } else if ((planedStartHour >= 13) && (planedStartHour <= 18)) {
        return 'evening'
      } else if ((planedStartHour >= 19) && (planedStartHour <= 23)) {
        return 'night'
      }
    }
  },
  methods: {
    async setCurrentTask () {
      let task = await getOneTaskById(this.task.id)
      await this.$store.dispatch('task/setCurrentTask', {task: task})
    }
  }
}
</script>
