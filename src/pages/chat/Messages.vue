<template>
<div class="content-page">
  <div class="content-messages">
      <div class="mdl-card item" v-for="(item, index) in messages.all" :key="index" :class="item.class + ' ' + (item.autor != user.id ? 'received': 'sended' )" v-bind:id="'msg_' + item.id">
        <p>
          <span class="textOrange chat-name user-id" v-bind:id="'user-id-' + item.id" v-if="item.autor != '0' && item.autor != user.id">{{ (typeof(item.usuarioAutor) == 'undefined') ? 'AT' : item.usuarioAutor }}</span>
          <span class="textOrange chat-name user-you" v-if="item.autor != '0'&& item.autor == user.id">{{ $t('Você') }}</span>
          <span class="textOrange right chat-hour">&nbsp;{{ item.created_at | moment(item.criada) }}</span>
        </p>
        <span class="chat-message">{{item.mensagem}}</span>
        <i class="material-icons check notSent" v-if=" item.autor != '0' && item.autor == user.id && item.enviada == null">av_timer</i>
        <i class="material-icons check" :class="( (item.bosslida != 'false' && item.bosslida != null) ? 'green' : '')" v-if="item.autor != '0' && item.autor == user.id && item.enviada != null">check</i>
        <i class="material-icons check check2" :class="( (item.bosslida != 'false' && item.bosslida != null) ? 'green' : '')" v-if="item.autor != '0' && item.autor == user.id && item.bosslida != 'false' && item.bosslida != null">check</i>
      </div>
  </div>
  <div class="item message">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" v-mdl :class="{'is-invalid': hasError}">
        <input ref="message" class="mdl-textfield__input" type="inputMensagem" id="inputMensagem">
        <label class="mdl-textfield__label" for="inputMensagem">{{ $t('Mensagem') }}</label>
        <span class="mdl-error" v-if="hasError" v-html="messageError"></span>
      </div>
      <span class="">
        <button class="mdl-button  mdl-button--fab "  @click="saveMessage()">
          <i class="material-icons arrow-right">keyboard_arrow_right</i>
        </button>
      </span>
  </div>
</div>
</template>

<script>
import { saveOneMessage } from '@/plugins/persistence/entities/message'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'Messages',
  data: () => ({
    hasError: false,
    messageError: '',
    obrigatorio: false
  }),
  mounted () {
    this.$emit('changeParams', {
      pageTitle: this.$t('Mensagens'),
      mapMenu: false,
      backMenu: true
    })
    this.$bus.$emit('messages-sync', true)
    if (typeof this.messages.all != 'undefined') {
      for (var index = 0; index < this.messages.all.length; index++) {
        if (this.messages.all[index].lida == null && this.messages.all[index].id && this.messages.all[index].autor != this.user.id) {
          this.$bus.$emit('send-read-message', true, this.messages.all[index].id)
        }
        if (this.messages.all[index].entregue == null && this.messages.all[index].id && this.messages.all[index].autor != this.user.id) {
          this.$bus.$emit('mark-message-entregue', true, this.messages.all[index].id)
        }
      }
    }
    this.scrollDiv()
    this.listenMessages()
  },
  destroyed () {
    this.$bus.$emit('messages-sync-off')
  },
  computed: {
    ...mapGetters({
      token: 'user/token',
      user: 'user/user',
      messages: 'message/messages',
      currentMessage: 'message/currentMessage'
    })
  },
  filters: {
    moment: function (date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss')
    }
  },
  methods: {
    listenMessages () {
      let _self = this
      this.$bus.$off('new-messages')
      this.$bus.$on('new-messages', function () {
        _self.scrollDiv()
        setTimeout(function () {
          _self.scrollDiv()
        }, 100)
      })
    },
    saveMessage (data) {
      let _self = this
      if (this.$refs.message.value != undefined && this.$refs.message.value != '') {
        console.log('Teste MSG', {
          msg: this.$refs.message.value,
          user: this.user.id
        })
        const msgToSave = {mensagem: this.$refs.message.value, user: this.user.id}
        saveOneMessage(msgToSave).then(function (data) {
          _self.$store.dispatch('message/getMessages').then(async function (a) {
            _self.scrollDiv()
            setTimeout(() => {
              _self.scrollDiv()
            }, 100)
            _self.$bus.$emit('send-chat-message', true, data)

            _self.$refs.message.value = ''
          })
        })
      } else {
        this.messageError = this.$t('Este campo é obrigatório')
        this.hasError = true
      }
    },
    checkSendMessage () {
      if (this.$refs.message.value != undefined && this.$refs.message.value != '') {
        if (this.hasError) {
          this.hasError = !this.hasError
        }
        this.send(this, {msg: this.$refs.message.value, user: this.user.id})
        this.$refs.message.value = ''
      } else {
        this.hasError = true
        this.messageError = this.$t('Este campo é obrigatório')
      }
      this.scrollDiv()
    },
    scrollDiv () {
      if (document.getElementsByClassName('content-messages')) {
        const objDiv = document.getElementsByClassName('content-messages')[0]
        if (typeof objDiv.scrollHeight != 'undefined') {
          objDiv.scrollTop = objDiv.scrollHeight
        }
      }
    },
    moment: function () {
      return moment()
    },
    async send (_self, data) {
      if (typeof data != 'undefined' && data) {
        saveOneMessage(data).then(async function (data) {
        })
      }
      await this.scrollDiv()
    }
  }
}
</script>

<style lang="scss" scoped>

.content-page {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: 100%;
  .content-messages {
    position: relative;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items:flex-end;
    overflow-y: scroll;
    flex-basis: 0;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
    margin-bottom: 80px;
    padding-bottom: 8px;
  }
}

.content-page:before{
  content: '';
  position: fixed;
  bottom: 0px;
  right: 0px;
  // width: 260px;
  // height: 140px;
  height: 80px;
  width: 100%;
  // background: url('../../assets/shared/bottom-left.svg');
  background-size: 260px 140px;
  background-repeat: no-repeat;
  background-position: bottom right;
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
  opacity: 0.5;
  filter: alpha(opacity=30); /* For IE8 and earlier */
  background: #1a3444;
}

.item {
  position: relative;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  padding-left: 11px;
  padding-right: 11px;
  padding-top: 5px;
  padding-bottom: 26px;
  margin-top: 11px;
  align-self: flex-end;
  margin-right: 10px;
  margin-left: 10px;
  overflow: visible;
  display: block;
  margin-bottom: 0;
  .check {
    position: absolute;
    right: 11px;
    bottom: 8px;
    font-size: 18px;
    &.green {
      color: #1a3444;
    }
    &.check2 {
      right: 15px;
    }
    &.notSent {
      color: rgba(0,0,0,0.3);
    }
  }

  &.received{
    width: 83%;
    border: solid 1px #707070;
    align-self: flex-start;
  }
  &.sended{
    width: 83%;
    margin-left: 19%;
    background: #EDFFCC!important;
    border-color: #EDFFCC!important;
  }
  &.message{
    position: fixed;
    z-index: 9999;
    width: 100%;
    display: flex;
    margin: 0;
    padding: 0 10px 10px 10px;
    bottom: 0;
    background: unset;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 90px;
    flex: 0 0 90px;
    max-height: 90px;
    box-sizing: border-box;

    .mdl-textfield {
      margin-bottom: 0px;
      padding-top: 5px;
      background: none;
      .mdl-textfield__label {
        padding: 2px 10px;
        top: 26px;
      }
      &.mdl-textfield--floating-label.is-focused .mdl-textfield__label,
      &.mdl-textfield--floating-label.is-dirty .mdl-textfield__label,
      &.mdl-textfield--floating-label.has-placeholder .mdl-textfield__label {
          top: 5px;
          left: -10px;
          color: #f6482e;
          padding: 0 4px;
          height: 19px;
          width: 75px;
          background: #fff;

          top: 4px;
          background: none;

          &:after {
            content: none;
          }
      }

      .mdl-textfield__input {
        border: solid #1a3444 1px;
        border-radius: 4px;
        background: #FFF;
        height: 56px;
        line-height: 56px;
        color: rgba(0,0,0,0.87);
        box-sizing: border-box;
      }
    }
    button{
      margin-top: 5px;
      margin-right: 0px;
      margin-left: 18px;
    }
  }
  p{
    justify-content: space-between;
    display: flex;
    margin: 0 0 7px;
  }
  .chat-name,
  .chat-hour {
   font-size: 12px;
   letter-spacing: 0.034em;
   line-height: 14px;
  }
  .chat-message {
    color: rgba(0,0,0,0.87);
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.018em;
    word-break: break-all;
  }
}
.mdl-error {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
