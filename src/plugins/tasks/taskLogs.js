
export default {
  template: ' ',
  async created () {
    this.taskLoglisteners()
  },
  methods: {
    taskLoglisteners () {
      this.$bus.$off('task_log')
      this.$bus.$off('task_log_status_change')
      this.$bus.$on('task_log_status_change', async (data) => {
        this.logCurrentLog(data)
      })
    },
    logCurrentLog (data) {
      var task = data.task
      var log = {
        idTarefa: task.id,
        tipo: task.status,
        valor: task.status,
        time: data.timeNow,
        hash: '',
        sinc: 0
      }
      this.$store.dispatch('task/addLogCurrentTask', {log: log})
    }
  }
}
