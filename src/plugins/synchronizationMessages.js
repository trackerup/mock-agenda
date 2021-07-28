import { mapGetters } from 'vuex'
import { getters } from '../plugins/persistence/services'
import { get as getAllMessages, post as sendMessage } from '../services/messages'
import { saveOneMessage, saveMessages, getMessagesForSync } from './persistence/entities/message'

export default {
  data: () => ({
    currentIntervalMessages: null,
    syncTimeout: 6 * 1000,
    msgID: false
  }),
  computed: {
    ...mapGetters({
      token: 'user/token',
      user: 'user/user',
      messages: 'message/messages',
      currentMessage: 'message/currentMessage'
    }),
    messages: {
      get () {
        return this.$store.getters['message/messages'] || this.messages || []
      },
      set (messages) {}
    },
    currentMessage: {
      get () {
        return this.$store.getters['message/currentMessage'] || this.currentMessage || []
      },
      set (currentMessage) {}
    }
  },

  async mounted () {
    this.synclistenMessages()

    // if (this.token != null && this.token != '') {
    //   await this.makeMessagesSync().catch(response => {
    //     console.log(response.msg)
    //   })
    //   // this.initIntervalSyncMessages()
    // }
  },
  methods: {
    synclistenMessages () {
      this.$bus.$off('messages-sync')
      this.$bus.$on('messages-sync', async status => {
        console.log('Starting Messages Sync')
        if (this.currentIntervalMessages != null) {
          clearInterval(this.currentIntervalMessages)
          this.currentIntervalMessages = null
        }
        if (status == true) {
          await this.initIntervalSyncMessages()
        }
      })

      this.$bus.$off('messages-sync-off')
      this.$bus.$on('messages-sync-off', async status => {
        console.log('STOPPING Messages Sync')
        if (this.currentIntervalMessages != null) {
          clearInterval(this.currentIntervalMessages)
          this.currentIntervalMessages = null
        }
      })

      this.$bus.$off('force-messages-sync')
      this.$bus.$on('force-messages-sync', async status => {
        await this.makeMessagesSync().catch(response => {
          console.log('force-messages-sync', 'Forcing message sync')
        })
      })

      this.$bus.$off('send-chat-message')
      this.$bus.$on('send-chat-message', async (status, message = false) => {
        console.log('sendChatMessage >>>>> ')

        if (status == true && message) {
          console.log(message)
          this.sendChatMessages()
        }
      })
      this.$bus.$off('send-read-message')
      this.$bus.$on('send-read-message', async (status, msgID = false) => {
        // console.log('send-read-message')

        if (status == true && msgID) {
          this.msgID = msgID
          this.mensagemLida()
        }
      })
      this.$bus.$off('mark-message-entregue')
      this.$bus.$on('mark-message-entregue', async (status, msgID = false) => {
        // console.log('mark-message-entregue')

        if (status == true && msgID) {
          this.msgID = msgID
          this.mensagemEntregue().then((msg) => {
            console.log('Retorno mensagem Entregue', msg)
          }).catch((msg) => {
            console.log('Retorno mensagem Entregue', msg)
          })
        }
      })

      this.$bus.$off('mark-message-enviada')
      this.$bus.$on('mark-message-enviada', async (status, msgID = false) => {
        // console.log('mark-message-enviada')

        if (status == true && msgID) {
          this.msgID = msgID
          this.mensagemEnviada()
        }
      })
    },
    /**
     * Init messages synchronization.
     *
     */
    initIntervalSyncMessages: function () {
      const _self = this
      this.currentIntervalMessages = setInterval(function () {
        if (_self.$route.path == '/messages') {
          _self.sendChatMessages().catch(response => {
            // console.log(response)
          })
          _self.makeMessagesSync().catch(response => {
            console.log(response)
          })
        } else {
          console.log('ERRO PAGE ACTUAL PAGE', _self.$route)
        }
      }, _self.syncTimeout)
    },
    /**
     * Make messages synchronization.
     *
     * @returns {Promise} Returns a promise according to the 'success' flag.
     */
    makeMessagesSync: function (parent) {
      let _self = parent || this

      if (parent) {
        const snackbar = {
          message: _self.$t('Sincronizando mensagens'),
          duration: 4000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      }
      return new Promise(async (resolve, reject) => {
        if (!_self.token) {
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else {
          getters.getAll('mensagens').then(async (result) => {
            if (typeof result != 'undefined') {
              _self.messages = result
            } else {
              _self.messages = {}
            }
            // configuration to get messages
            let ultimaMensagem = 0
            _self.$store.dispatch('message/getMessages').then(async function (a) {
              if (Array.isArray(_self.messages.all)) {
                if (_self.messages.all.length > 0) {
                  for (const key in _self.messages.all) {
                    if (_self.messages.all.hasOwnProperty(key)) {
                      const element = _self.messages.all[key]
                      if (element.enviada == null) {
                        ultimaMensagem = element
                        break
                      }
                    }
                  }

                  if (ultimaMensagem == 0) {
                    ultimaMensagem = _self.messages.all[_self.messages.all.length - 1]
                  }
                }
              }
              const config = {
                pullTracker: {
                  act: 'loadchatSince',
                  last: ultimaMensagem.criada || 0,
                  older: _self.older || null,
                  user: _self.user.id || null
                },
                bateria: _self.$store.getters['batteryStatus/level'] || '100'
              }
              await getAllMessages(config).then(({ data }) => {
                if (data) {
                  saveMessages(data).then(function () {
                    _self.$store.dispatch('message/getMessages')
                    _self.$store.dispatch('synchronizationMessages/saveLastSync', {
                      lastSync: Date(Date.now()).toString()
                    })
                  })

                  if (data.length > 1) {
                    _self.$bus.$emit('new-messages', true)
                  }
                  resolve(data)
                } else {
                  reject(data)
                }
              }).catch(({ data }) => {
                reject(data)
              })
            })
          })
        }
      })
    },
    /**
     * Send a message to sync.
     *
     * @returns {Promise} Returns a promise according to the 'success' flag.
     */
    sendChatMessage: function (parent) {
      let _self = this || parent

      return new Promise(async (resolve, reject) => {
        if (typeof _self.currentMessage == 'undefined' || _self.currentMessage == '') {
          const snackbar = {
            message: _self.$t('Messagem invalida!'),
            duration: 2000
          }
          _self.$bus.$emit('showSnackBar', snackbar)
          _self.$bus.$emit('showSnackBar', snackbar)
          const ret = {msg: _self.$t('Messagem invalida!')}
          console.log('Messagem invalida!')
          reject(ret)
        } else if (!_self.token) {
          const snackbar = {
            message: _self.$t('Token não preenchido!'),
            duration: 2000
          }
          _self.$bus.$emit('showSnackBar', snackbar)
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else {
          const snackbar = {
            message: _self.$t('Enviando mensagen'),
            duration: 2000
          }
          _self.$bus.$emit('showSnackBar', snackbar)
          // configuration to send message
          const config = {
            pullTracker: {
              act: 'responderChat',
              usoPeloPainel: false
            },
            mensagem: _self.currentMessage,
            chatUser: _self.user.id || null,
            chatAdmin: _self.user.id || null
          }
          await sendMessage(config).then(({ data }) => {
            console.log('Enviando Messagem')
            if (data) {
              saveOneMessage(data)
              _self.$store.dispatch('message/saveMessage', {
                message: data
              })
              _self.$store.dispatch('message/setCurrentMessage', {
                message: ''
              })
              resolve(data)
            } else {
              reject(data)
            }
          }).then(() => {
            this.scrollDiv()
          }).catch(({ data }) => {
            console.log(config)
            // const mensagem = this.$t('Falha no envio da Mensagem')
            // this.$bus.$emit('showErrorEmitted', { msg: mensagem })
          })
        }
      })
    },
    /**
     * Send a message to sync.
     *
     * @returns {Promise} Returns a promise according to the 'success' flag.
     */
    sendChatMessages: function (parent) {
      let _self = this || parent
      return new Promise(async (resolve, reject) => {
        if (!_self.token) {
          const snackbar = {
            message: _self.$t('Token não preenchido!'),
            duration: 2000
          }
          _self.$bus.$emit('showSnackBar', snackbar)
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else {
          getMessagesForSync('mensagens').then(async (result) => {
            // configuration to get messages
            if (result.length > 0) {
              const config = {
                pullTracker: {
                  act: 'responderChatAPP',
                  usoPeloPainel: false
                },
                mensagens: result,
                chatUser: _self.user.id || null,
                chatAdmin: _self.user.id || null
              }
              await sendMessage(config).then(function (data) {
                if (data) {
                  for (let index = 0; index < result.length; index++) {
                    const element = result[index]
                    if (element.entregue == null) {
                      _self.$bus.$emit('mark-message-entregue', true, element.id)
                    }
                  }
                  _self.$bus.$emit('new-messages')
                  resolve(data)
                } else {
                  console.log('ERRO ENVIO MSGS', data)
                  reject(data)
                }
              })
            }
          })
        }
      })
    },
    mensagemLida: function (parent) {
      let _self = this || parent
      let entregue = new Date()

      let aaaa = entregue.getFullYear()

      let mmm = (entregue.getMonth()) + 1
      if (mmm < 10) {
        mmm = '0' + mmm.toString()
      }

      let dia = (entregue.getDate())
      if (dia < 10) {
        dia = '0' + dia.toString()
      }

      let minu = entregue.getMinutes()
      if (minu < 10) {
        minu = '0' + minu.toString()
      }

      let hs = entregue.getHours()
      if (hs < 10) {
        hs = '0' + hs.toString()
      }

      let hora = aaaa + '-' + mmm + '-' + dia + ' ' + hs + ':' + minu + ':00'

      if (parent) {
        const snackbar = {
          message: _self.$t('Sincronizando mensagens'),
          duration: 2000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      }
      return new Promise(async (resolve, reject) => {
        if (typeof this.msgID == 'undefined' || this.msgID == false || this.msgID == '') {
          const ret = {msg: _self.$t('Messagem invalida!')}
          console.log('Messagem invalida!')
          reject(ret)
        } else if (!_self.token) {
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else {
          // configuration to send message
          const config = {
            pullTracker: {
              act: 'mensagemLida'
            },
            id: this.msgID,
            lida: hora,
            user: _self.user.id || null,
            bateria: _self.$store.getters['batteryStatus/level'] || '100'
          }
          await sendMessage(config).then(() => {
            console.log('mensagemLida')
            resolve('Ok')
          })
        }
      })
    },
    mensagemEntregue: function (parent) {
      let _self = this || parent
      let entregue = new Date()

      let aaaa = entregue.getFullYear()

      let mmm = (entregue.getMonth()) + 1
      if (mmm < 10) {
        mmm = '0' + mmm.toString()
      }

      let dia = (entregue.getDate())
      if (dia < 10) {
        dia = '0' + dia.toString()
      }

      let minu = entregue.getMinutes()
      if (minu < 10) {
        minu = '0' + minu.toString()
      }

      let hs = entregue.getHours()
      if (hs < 10) {
        hs = '0' + hs.toString()
      }

      let hora = aaaa + '-' + mmm + '-' + dia + ' ' + hs + ':' + minu + ':00'

      if (parent) {
        const snackbar = {
          message: _self.$t('Sincronizando mensagens'),
          duration: 2000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      }
      return new Promise(async (resolve, reject) => {
        if (typeof this.msgID == 'undefined' || this.msgID == false || this.msgID == '') {
          const ret = {msg: _self.$t('Messagem invalida!')}
          console.log('Messagem invalida!')
          reject(ret)
        } else if (!_self.token) {
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else {
          // configuration to send message
          const config = {
            pullTracker: {
              act: 'mensagemEntregue'
            },
            id: this.msgID,
            entregue: hora,
            user: _self.user.id || null,
            bateria: _self.$store.getters['batteryStatus/level'] || '100'
          }
          await sendMessage(config).then((json) => {
            console.log('mensagemLida')
            resolve('Ok')
          }).catch((json) => {
            const ret = {msg: _self.$t('Messagem invalida!')}
            reject(ret)
          })
        }
      })
    },
    // @TODO: Requer rota na API para marcar a mensagem enviada pelo APP
    mensagemEnviada: function (parent) {
      let _self = this || parent
      let entregue = new Date()

      let aaaa = entregue.getFullYear()

      let mmm = (entregue.getMonth()) + 1
      if (mmm < 10) {
        mmm = '0' + mmm.toString()
      }

      let dia = (entregue.getDate())
      if (dia < 10) {
        dia = '0' + dia.toString()
      }

      let minu = entregue.getMinutes()
      if (minu < 10) {
        minu = '0' + minu.toString()
      }

      let hs = entregue.getHours()
      if (hs < 10) {
        hs = '0' + hs.toString()
      }

      let hora = aaaa + '-' + mmm + '-' + dia + ' ' + hs + ':' + minu + ':00'

      if (parent) {
        const snackbar = {
          message: _self.$t('Sincronizando mensagens'),
          duration: 2000
        }
        _self.$bus.$emit('showSnackBar', snackbar)
      }
      return new Promise(async (resolve, reject) => {
        if (typeof this.msgID == 'undefined' || this.msgID == false || this.msgID == '') {
          const ret = {msg: _self.$t('Messagem invalida!')}
          console.log('Messagem invalida!')
          reject(ret)
        } else if (!_self.token) {
          const ret = {msg: _self.$t('Token não preenchido!')}
          console.log('Token não preenchido!')
          reject(ret)
        } else {
          // configuration to send message
          const config = {
            pullTracker: {
              act: 'mensagemEntregue'
            },
            id: this.msgID,
            entregue: hora,
            user: _self.user.id || null,
            bateria: _self.$store.getters['batteryStatus/level'] || '100'
          }
          await sendMessage(config).then(() => {
            console.log('mensagemLida')
            resolve('Ok')
          })
        }
      })
    }
  }
}
