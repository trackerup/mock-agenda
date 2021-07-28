<template>
    <div class="col" v-if="wizardState && wizardState.currentState" >
      <span v-for="(item,index) in wizardState.states" :key="index">
        <WizardStep
          :idForm="item.idForm"
          :backDisabled="backDisabled"
          v-if="renderForm(item)"
          :title="item.title"
          :value="item.value"
          :readOnly="wizardState.currentState && wizardState.currentState.type == 'wizardconfirm'"
          :typeForm="item.type"
          :readonlyState="wizardState.readonlyState"
          v-on:save="saveForm"
          v-on:input="updateForm"
          v-on:cancel="cancelForm"
          v-on:updatePreResp="updatePreResp"/>
      </span>
      <div class="form-actions wizardconfirm" v-if="wizardState.currentState && wizardState.currentState.type=='wizardsave'">
        {{$t('Salvando dados..')}}
      </div>
      <div class="form-actions wizardconfirm" v-if="wizardState.currentState && wizardState.currentState.type=='wizardconfirm'">
        <button class="mdl-button  button-edit" @click="editForm"><i class="material-icons">close</i>{{$t('Alterar')}}
        </button>
        <button class="mdl-button  button-confirm " @click="aproveForm">{{$t('Aprovar')}}<i
          class="material-icons">check_circle_outline</i></button>
      </div>
    </div>
</template>
<script>
import WizardStep from '@/components/form/wizard/WizardStep.vue'
import wizardResponse from '../../plugins/persistence/entities/wizardResponse'
import formWizard from '../../plugins/persistence/entities/formWizard'
import { regeneratePreResp } from '@/services/tasks'
import { mapGetters } from 'vuex'

export default {
  name: 'FormWizard',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    firstState: 0,
    wizardId: 1,
    wizardState: {
      currentState: null,
      currentTransition: null,
      checkPointTransition: null,
      readonlyState: true,
      transitionLog: [],
      preResp: {},
      states: {}
    },
    transitions: []
  }),
  async beforeMount () {
    let _self = this
    /**
    * task/PR-1624 - Tipo de Ordem Serviço
    * O WizardId 1 é o padrão utilizado para a WHP, caso ele não consiga encontrar um outro valor ele seta esse valor padrão
    */
    this.wizardId = 0
    try {
      this.wizardId = parseInt(Object.values(_self.task.metaDados).find(metaDado => metaDado.meta_key == '__WIZARD_CODE').meta_value)
      console.log('WIZARD ID TRUE', this.wizardId)
    } catch (error) {
      this.wizardId = 0
      console.log('WIZARD ID ERROR', this.wizardId)
    }
    let wizard = await formWizard.getOneFormWizardById(this.wizardId)
    let statesDb = await wizardResponse.getOneWizardResponseByIdTarefa(this.task.id)
    // TO DO: Substituir valor do Wizard para o da tarefa
    if (wizard && statesDb) {
      if (Object.entries(_self.wizardState.states).length === 0 && _self.wizardState.states.constructor === Object) {
        _self.wizardState.states = wizard.states
      }
      _self.wizardState.transitions = wizard.transitions
      _self.transitions = wizard.transitions
      _self.firstState = wizard.firstState
      if ((statesDb.wizardState.currentState != null) && (typeof statesDb.wizardState.currentState != 'undefined')) {
        _self.wizardState.currentState = statesDb.wizardState.currentState
      } else {
        _self.wizardState.currentState = Object.values(wizard.states).find(state => state.id == wizard.firstState)
      }
    }
    this.loadValues()
  },
  methods: {
    async loadValues () {
      let _self = this
      let statesDb = await wizardResponse.getOneWizardResponseByIdTarefa(_self.task.id)
      const currentOS = this.task.metaDados.find(metaDado => metaDado.meta_key == '__OS')
      if (statesDb && (currentOS && currentOS.meta_value &&
        (statesDb.wizardState.preResp['OS'] == currentOS.meta_value ||
        statesDb.wizardState.preResp['nOS'] == currentOS.meta_value)
      )) {
        _self.wizardState = statesDb.wizardState
        _self.$store.dispatch('task/setDefaultPreResp', {preResp: _self.wizardState.preResp})
        let wizard = await formWizard.getOneFormWizardById(_self.wizardId)
        if (wizard) {
          if (Object.entries(_self.wizardState.states).length === 0 && _self.wizardState.states.constructor === Object) {
            _self.wizardState.states = wizard.states
          }
          _self.firstState = wizard.firstState
          if ((statesDb.wizardState.currentState != null) && (typeof statesDb.wizardState.currentState != 'undefined')) {
            _self.wizardState.currentState = statesDb.wizardState.currentState
          } else {
            _self.wizardState.currentState = Object.values(wizard.states).find(state => state.id == wizard.firstState)
          }
          _self.transitions = wizard.transitions
        }
        if (_self.wizardState.currentState.type == 'wizardsave') {
          _self.saveWizardResponses(_self.wizardState.states)
        }
      } else {
        if (currentOS && statesDb &&
              currentOS.meta_value &&
              statesDb.wizardState.preResp &&
              (
                (statesDb.wizardState.preResp['OS'] != currentOS.meta_value) ||
                (statesDb.wizardState.preResp['nOS'] != currentOS.meta_value)
              )
        ) {
          // apagar a wizard response
          wizardResponse.deleteOne(_self.task.id)
        }
        // regarrega o pre resp
        try {
          const _preResp = JSON.parse(Object.values(_self.task.metaDados).find(metaDado => metaDado.meta_key == '__pre_resp').meta_value)
          _self.wizardState.preResp = _preResp
          if (!_self.wizardState.preResp ||
            (_self.wizardState.preResp['OS'] && _self.wizardState.preResp['OS'] != currentOS.meta_value) ||
            (_self.wizardState.preResp['nOS'] && _self.wizardState.preResp['OS'] != currentOS.meta_value)
          ) {
            throw new Error('oops')
          }
          _self.$store.dispatch('task/setDefaultPreResp', {preResp: _preResp})
        } catch (e) {
          _self.$bus.$emit('showSnackBar', {
            message: _self.$t('OS ainda em sincronização!'),
            duration: 3000
          })
          regeneratePreResp(_self.task.id).then((result) => {
            _self.$bus.$emit('tasks-sync', true)
            _self.wizardState.preResp = result.data
            _self.$store.dispatch('task/setDefaultPreResp', {preResp: result.data})
          })
        }
        await wizardResponse.setOne({
          idTarefa: _self.task.id, wizardState: _self.wizardState
        })

        /**
         * task/PR-2067 - Esse Trecho só é executado caso um erro seja encontrado, logo ele necessita recarregar a tela;
         */
        _self.loadValues()
      }
    },
    setState (transition) {
      let _self = this
      this.wizardState.currentTransition = transition
      this.wizardState.transitionLog.push(transition)
      if (Object.values(_self.wizardState.states).find(state => state.id == _self.wizardState.currentState.id).value == null) {
        Object.assign(Object.values(_self.wizardState.states).find(state => state.id == _self.wizardState.currentState.id), this.wizardState.currentState)
      }

      this.wizardState.currentState = Object.values(_self.wizardState.states).find(state => state.id == transition.destiny)
      this.$bus.$emit('changeParams', {
        pageTitle: this.$t('Em atendimento'),
        mapMenu: false,
        backMenu: this.wizardState.firstState == this.wizardState.currentState.id
      })
      wizardResponse.setOne({
        idTarefa: this.task.id, wizardState: this.wizardState
      })
      if (this.wizardState.currentState.type == 'wizardsave') {
        this.saveWizardResponses(this.wizardState.states)
      }
      /**
       * task/PR-2067 - Ordenando States pela ordem de execução no fluxo caso
       */
      if (this.wizardState.currentState.type == 'wizardconfirm') {
        this.orderStatesByTransition()
      }
    },
    updateForm (values) {
      let _self = this
      this.wizardState.currentState.value = values
      if (typeof this.wizardState.transitionLog.slice(-1)[0] != 'undefined') {
        var destiny = this.wizardState.transitionLog.slice(-1)[0].destiny
        Object.values(_self.wizardState.states).find(state => state.id == destiny).value = values
      }
      wizardResponse.setOne({
        idTarefa: this.task.id, wizardState: this.wizardState
      })
    },
    updatePreResp (values) {
      if (this.defaultPreResp) {
        this.$store.dispatch('task/updateDefaultPreResp', values)
        this.wizardState.preResp = this.defaultPreResp
        wizardResponse.setOne({
          idTarefa: this.task.id, wizardState: this.wizardState
        })
      }
    },
    saveForm (values) {
      let _self = this
      _self.wizardState.currentState.value = values
      Object.values(_self.wizardState.states).find(state => state.id == _self.wizardState.currentState.id).value = values
      for (let idx in _self.destinys) {
        var transition = _self.destinys[idx]
        if (transition.value == null || transition.value == '') {
          this.setState(transition)
          return
        } else {
          if (transition.field != null && typeof transition.field == 'object') {
            let responses = Object.values(_self.wizardState.states).find(state => state.id == transition.field.state).value.responses
            // let responses = this.wizardState.states[transition.field.state].value.responses
            if (responses[transition.field.id].valor == transition.value) {
              this.setState(transition)
              return
            }
          } else if (values.responses[transition.field].valor == transition.value) {
            this.setState(transition)
            return
          }
        }
      }
      regeneratePreResp(this.task.id).then((result) => {
        _self.$bus.$emit('tasks-sync', true)
        // _self.wizardState.preResp = result.data
        _self.$store.dispatch('task/setDefaultPreResp', {preResp: result.data})
      })
      _self.$bus.$emit('showSnackBar', {
        message: _self.$t('Formulário não possui valores válidos!'),
        duration: 3000
      })
    },
    aproveForm () {
      for (let idx in this.destinys) {
        this.wizardState.checkPointTransition = this.destinys[idx]
        this.setState(this.wizardState.checkPointTransition)
        break
      }
    },
    cancelForm (values) {
      let _self = this
      this.updateForm(values)
      if (this.wizardState.currentTransition != null && (this.wizardState.checkPointTransition == null || this.wizardState.currentTransition.id != this.wizardState.checkPointTransition.id)) {
        this.wizardState.currentTransition = this.wizardState.transitionLog.pop()
        if (this.wizardState.currentTransition != null) {
          this.wizardState.currentState = Object.values(_self.wizardState.states).find(state => state.id == _self.wizardState.currentTransition.origin)
        }
      }
    },
    editForm () {
      let _self = this
      _self.wizardState.currentTransition = _self.wizardState.transitionLog.pop()
      while (_self.wizardState.currentTransition != null && _self.wizardState.transitionLog.length > 0 &&
        (_self.wizardState.checkPointTransition == null || (_self.wizardState.currentTransition.id != _self.wizardState.checkPointTransition.id))) {
        _self.wizardState.currentTransition = _self.wizardState.transitionLog.pop()
      }
      if (_self.wizardState.currentTransition != null) {
        if (_self.wizardState.transitionLog.length == 0) {
          _self.wizardState.currentTransition = null
          _self.wizardState.currentState = Object.values(_self.wizardState.states).find(state => state.id == _self.firstState)
          _self.$bus.$emit('changeParams', {
            pageTitle: _self.$t('Em atendimento'),
            mapMenu: false,
            backMenu: _self.firstState == _self.wizardState.currentState.id
          })
        } else {
          _self.setState(_self.wizardState.currentTransition)
        }
      }
    },
    renderForm (item) {
      if (item.type == 'wizardsave' && this.wizardState.currentState.id == item.id) {
        return false
      }
      return (item.id != null && item.id == this.wizardState.currentState.id) ||
          (this.wizardState.currentState.type == 'wizardconfirm' && item.value != null && item.value != '')
    },
    saveWizardResponses (statesOfWizard) {
      this.$emit('wizardSaved', statesOfWizard)
    },
    orderStatesByTransition () {
      const _self = this
      if (_self.wizardState.transitionLog) {
        if (_self.wizardState.transitionLog.length > 0) {
          console.log('PRE ORDENACAO', _self.wizardState.states)
          let newWizardStates = []
          let wizardStatesNaoOrdenados = []
          _self.wizardState.transitionLog.forEach(elementLog => {
            let arrayOfStates = typeof _self.wizardState.states != 'object' ? _self.wizardState.states : Object.values(_self.wizardState.states)
            arrayOfStates.forEach(elementState => {
              if (elementLog.origin == elementState.id) {
                newWizardStates.push(elementState)
              } else {
                if (wizardStatesNaoOrdenados.indexOf(elementState) === -1) {
                  wizardStatesNaoOrdenados.push(elementState)
                }
              }
            })
          })
          wizardStatesNaoOrdenados.forEach(element => {
            if (newWizardStates.indexOf(element) === -1) {
              newWizardStates.push(element)
            }
          })
          _self.wizardState.states = newWizardStates
          console.log('POS ORDENACAO', _self.wizardState.states)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      currentTask: 'task/currentTask',
      defaultPreResp: 'task/defaultPreResp'
    }),
    destinys () {
      let destinys = []
      for (let idx in this.transitions) {
        let transition = this.transitions[idx]
        if (transition.origin == this.wizardState.currentState.id) {
          destinys.push(transition)
        }
      }
      return destinys
    },
    backDisabled () {
      return this.firstState == this.wizardState.currentState.id ||
          (this.wizardState.transitionLog != null && this.wizardState.checkPointTransition != null && this.wizardState.transitionLog[this.wizardState.transitionLog.length - 1].id == this.wizardState.checkPointTransition.id)
    }
  },
  components: {
    WizardStep
  }
}
</script>
