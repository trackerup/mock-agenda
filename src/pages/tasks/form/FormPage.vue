<template>
  <div class="content-page">
    <div class="task-form">
     <div class="mdl-card card-conteudo col">
        <div class="card-content">
          <Form :idForm="idForm" />
        </div>
      </div>
      <div class="actions">
        <button @click="$router.push('/messages')"
                class="mdl-button  mdl-button--fab  orange">
          <i class="material-icons message">message</i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Form from '@/components/form/Form.vue'
import FormWizard from '@/components/form/FormWizard'
import InputSku from '@/components/form/fields/InputSku'
export default {
  name: 'FormPage',
  data: () => ({
    idTask: null,
    idForm: null,
    values: [],
    task: {
      id: 1
    }
  }),
  methods: {
    save (values) {
      this.values = values
    }
  },
  beforeMount () {
    this.idForm = this.$route.params.idForm
    this.idTask = this.$route.params.idTask
  },
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Formulário'),
      mapMenu: true,
      backMenu: false
    })
  },
  components: {
    Form,
    FormWizard,
    InputSku
  }
}
</script>
<style lang="scss" scoped>

  .content-page {
    height: 100%;
  }
  .card-conteudo {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0;
    max-height: calc(100% - 11px);
    overflow-y: auto;
  }
</style>
