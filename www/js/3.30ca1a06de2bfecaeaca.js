webpackJsonp([3],{"2BJz":function(e,t){},"7JWy":function(e,t){},H0lX:function(e,t){},RlCP:function(e,t,n){"use strict";var s={name:"RegistrationField",props:{model:{type:Object,required:!0}},data:function(){return{}},methods:{limpacampo:function(){this.model.login="",document.getElementById("RegistrationInput").closest(".mdl-textfield").classList.remove("is-dirty")}}},a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"textfield-with-icon"},[n("div",{directives:[{name:"mdl",rawName:"v-mdl"}],staticClass:"mdl-textfield mdl-js-textfield mdl-textfield--floating-label"},[n("input",{directives:[{name:"mdl",rawName:"v-mdl"},{name:"model",rawName:"v-model",value:e.model.login,expression:"model.login"}],ref:"registrationinput",staticClass:"mdl-textfield__input",attrs:{type:"text",id:"RegistrationInput"},domProps:{value:e.model.login},on:{input:function(t){t.target.composing||e.$set(e.model,"login",t.target.value)}}}),e._v(" "),n("label",{staticClass:"mdl-textfield__label",attrs:{for:"RegistrationInput"}},[e._v(e._s(e.$t("Login")))])]),e._v(" "),n("transition",{attrs:{name:"fade"}},[n("i",{directives:[{name:"show",rawName:"v-show",value:""!=e.model.login,expression:"model.login != ''"}],staticClass:"material-icons",on:{click:e.limpacampo}},[e._v("close")])])],1)},staticRenderFns:[]};var r=n("VU/8")(s,a,!1,function(e){n("H0lX")},"data-v-2d48e16c",null);t.a=r.exports},gF58:function(e,t,n){"use strict";t.b=function(e){var t=this;return new c.a((n=o()(a.a.mark(function n(s,r){var o,i,c;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u.b.post("/?loginCompleto",e);case 3:o=t.sent,i=o.data,"ok"==o.data.status?s(i):r(i),t.next=12;break;case 8:t.prev=8,t.t0=t.catch(0),c={data:{success:!1,error:t.t0.message}},r(c);case 12:case"end":return t.stop()}},n,t,[[0,8]])})),function(e,t){return n.apply(this,arguments)}));var n},t.a=function(e){var t=this;return new c.a((n=o()(a.a.mark(function n(s,r){var o,i,c,l;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,o={data:e,pullTracker:{act:"sendJsonString"}},t.next=4,u.b.post("/?sendJsonString",o);case 4:i=t.sent,c=i.data,"ok"==i.data.status?s(c):r(c),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),l={data:{success:!1,error:t.t0.message}},r(l);case 13:case"end":return t.stop()}},n,t,[[0,9]])})),function(e,t){return n.apply(this,arguments)}));var n};var s=n("Xxa5"),a=n.n(s),r=n("exGp"),o=n.n(r),i=n("//Fk"),c=n.n(i),u=n("7K8a")},hV0F:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("Xxa5"),a=n.n(s),r=n("exGp"),o=n.n(r),i=n("Dd8w"),c=n.n(i),u=(n("sDar"),{name:"OrientationField",data:function(){return{}},props:{description:{type:String,required:!0}}}),l={render:function(){var e=this.$createElement;return(this._self._c||e)("div",{staticClass:"orientacao"},[this._v("\n  "+this._s(this.description)+"\n")])},staticRenderFns:[]},d=(n("VU/8")(u,l,!1,null,null,null).exports,{name:"PasswordField",props:{model:{type:Object,required:!0}},data:function(){return{}},methods:{showpassword:function(e){"visibility"==e.target.innerHTML?(document.getElementById("passwordInput").type="text",e.target.innerHTML="visibility_off"):(document.getElementById("passwordInput").type="password",e.target.innerHTML="visibility")}}}),g={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"textfield-with-icon"},[n("div",{directives:[{name:"mdl",rawName:"v-mdl"}],staticClass:"mdl-textfield mdl-js-textfield mdl-textfield--floating-label"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.model.senha,expression:"model.senha"}],ref:"passwordInput",staticClass:"mdl-textfield__input",attrs:{type:"password",id:"passwordInput"},domProps:{value:e.model.senha},on:{input:function(t){t.target.composing||e.$set(e.model,"senha",t.target.value)}}}),e._v(" "),n("label",{staticClass:"mdl-textfield__label",attrs:{for:"passwordInput"}},[e._v(e._s(e.$t("Senha"))+" ")])]),e._v(" "),n("i",{staticClass:"material-icons",on:{click:e.showpassword}},[e._v("visibility")])])},staticRenderFns:[]},m=n("VU/8")(d,g,!1,null,null,null).exports,h=n("RlCP"),f=n("4zFs"),p=n("7+uW"),v=n("NYxO"),k=n("//Fk"),$=n.n(k),w=n("gF58"),b=n("OZIn"),y=n("CgnP"),x=n("zqAa"),S=n("SBDe"),_=n("Um3+"),M=n("R4BC"),I=n("2hzV"),C={data:function(){return{currentInterval:null,timeout:6e4}},computed:c()({},Object(v.b)({token:"user/token"})),mounted:function(){var e=this;return o()(a.a.mark(function t(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.listen();case 1:case"end":return t.stop()}},t,e)}))()},beforeDestroy:function(){clearInterval(this.currentInterval),this.currentInterval=null},methods:{listen:function(){var e,t=this;this.$bus.$on("auth-user",(e=o()(a.a.mark(function e(n){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(null!=t.currentInterval&&(clearInterval(t.currentInterval),t.currentInterval=null),1!=n){e.next=5;break}return e.next=4,t.makeUserSync();case 4:t.initIntervalSync();case 5:case"end":return e.stop()}},e,t)})),function(t){return e.apply(this,arguments)}))},initIntervalSync:function(){var e=this;this.currentInterval=setInterval(function(){e.makeUserSync().catch(function(e){})},6e4)},makeUserSync:function(){var e=o()(a.a.mark(function e(t){var n,s,r,i,c=this;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t||this,t&&(s={message:n.$t("Sincronizando dados"),duration:4e3},n.$bus.$emit("showSnackBar",s)),r=n.$store.getters["task/viewDate"],i={pullTracker:{act:"loginCompleto"},OS:window.jscd.os,osVersion:window.jscd.osVersion,screenSize:window.jscd.screen,bateria:n.$store.getters["batteryStatus/level"]||window.localStorage.getItem("batteryStatus.level"),lastsinc:n.$store.getters["synchronization/lastSync"]||window.localStorage.getItem("lastSync"),notid:n.$store.getters["notification/notificationId"]||window.localStorage.getItem("notificationId"),data:n.$options.filters.formatDate(r),locaisNoApp:0},e.abrupt("return",new $.a(function(){var e=o()(a.a.mark(function e(t,s){var r;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n.token?Object(w.b)(i).then(function(e){b.a.synchronization(e,n),y.a.synchronization(e,n),x.a.synchronization(e,n),S.a.synchronization(e,n),_.a.synchronization(e,n),M.a.synchronization(e,n),Object(I.e)(e.folhaPonto),n.$store.dispatch("synchronization/saveLastSync",{lastSync:e.lastsinc}),t(e)}).catch(function(e){var t=e.data;if(!e.jwt_auth&&e.jwt_auth_error){n.$store.dispatch("user/logout"),n.$geolocation.stopBackground(),n.$router.push("/login"),n.bgGeo&&n.bgGeo.stop();var a=e.jwt_auth_error;s(a)}else{var r=t.mensagem||t.error;s(r)}}):(r={msg:n.$t("Token não preenchido!")},s(r));case 1:case"end":return e.stop()}},e,c)}));return function(t,n){return e.apply(this,arguments)}}()));case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()}},T=n("T75j"),D=n("7K8a"),E=n("mw3O"),z=n.n(E);function P(e){var t,n=this;return new $.a((t=o()(a.a.mark(function t(s,r){var o,i,c,u;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,o=z.a.stringify(e),t.next=4,D.b.get("/?"+o);case 4:i=t.sent,c={data:i.data.msgs},"OK"==i.data.status?s(c):r(c),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),u={data:{success:!1,error:t.t0.message}},r(u);case 13:case"end":return t.stop()}},t,n,[[0,9]])})),function(e,n){return t.apply(this,arguments)}))}function O(e){var t,n=this;return new $.a((t=o()(a.a.mark(function t(s,r){var o,i,c;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,D.b.post("/",e);case 3:o=t.sent,i={data:o.data.mensagensSincronizadas?o.data:o.data.mensagensSincronizadas},"OK"==o.data.status?s(i):r(i),t.next=12;break;case 8:t.prev=8,t.t0=t.catch(0),c={data:{success:!1,error:t.t0.message}},r(c);case 12:case"end":return t.stop()}},t,n,[[0,8]])})),function(e,n){return t.apply(this,arguments)}))}var j=n("eZEh"),B={data:function(){return{currentIntervalMessages:null,syncTimeout:6e3,msgID:!1}},computed:c()({},Object(v.b)({token:"user/token",user:"user/user",messages:"message/messages",currentMessage:"message/currentMessage"}),{messages:{get:function(){return this.$store.getters["message/messages"]||this.messages||[]},set:function(e){}},currentMessage:{get:function(){return this.$store.getters["message/currentMessage"]||this.currentMessage||[]},set:function(e){}}}),mounted:function(){var e=this;return o()(a.a.mark(function t(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.synclistenMessages();case 1:case"end":return t.stop()}},t,e)}))()},methods:{synclistenMessages:function(){var e,t,n,s,r,i,c,u=this;this.$bus.$off("messages-sync"),this.$bus.$on("messages-sync",(e=o()(a.a.mark(function e(t){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("Starting Messages Sync"),null!=u.currentIntervalMessages&&(clearInterval(u.currentIntervalMessages),u.currentIntervalMessages=null),1!=t){e.next=5;break}return e.next=5,u.initIntervalSyncMessages();case 5:case"end":return e.stop()}},e,u)})),function(t){return e.apply(this,arguments)})),this.$bus.$off("messages-sync-off"),this.$bus.$on("messages-sync-off",(t=o()(a.a.mark(function e(t){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("STOPPING Messages Sync"),null!=u.currentIntervalMessages&&(clearInterval(u.currentIntervalMessages),u.currentIntervalMessages=null);case 2:case"end":return e.stop()}},e,u)})),function(e){return t.apply(this,arguments)})),this.$bus.$off("force-messages-sync"),this.$bus.$on("force-messages-sync",(n=o()(a.a.mark(function e(t){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.makeMessagesSync().catch(function(e){console.log("force-messages-sync","Forcing message sync")});case 2:case"end":return e.stop()}},e,u)})),function(e){return n.apply(this,arguments)})),this.$bus.$off("send-chat-message"),this.$bus.$on("send-chat-message",(s=o()(a.a.mark(function e(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("sendChatMessage >>>>> "),1==t&&n&&(console.log(n),u.sendChatMessages());case 2:case"end":return e.stop()}},e,u)})),function(e){return s.apply(this,arguments)})),this.$bus.$off("send-read-message"),this.$bus.$on("send-read-message",(r=o()(a.a.mark(function e(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:1==t&&n&&(u.msgID=n,u.mensagemLida());case 1:case"end":return e.stop()}},e,u)})),function(e){return r.apply(this,arguments)})),this.$bus.$off("mark-message-entregue"),this.$bus.$on("mark-message-entregue",(i=o()(a.a.mark(function e(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:1==t&&n&&(u.msgID=n,u.mensagemEntregue().then(function(e){console.log("Retorno mensagem Entregue",e)}).catch(function(e){console.log("Retorno mensagem Entregue",e)}));case 1:case"end":return e.stop()}},e,u)})),function(e){return i.apply(this,arguments)})),this.$bus.$off("mark-message-enviada"),this.$bus.$on("mark-message-enviada",(c=o()(a.a.mark(function e(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:1==t&&n&&(u.msgID=n,u.mensagemEnviada());case 1:case"end":return e.stop()}},e,u)})),function(e){return c.apply(this,arguments)}))},initIntervalSyncMessages:function(){var e=this;this.currentIntervalMessages=setInterval(function(){"/messages"==e.$route.path?(e.sendChatMessages().catch(function(e){}),e.makeMessagesSync().catch(function(e){console.log(e)})):console.log("ERRO PAGE ACTUAL PAGE",e.$route)},e.syncTimeout)},makeMessagesSync:function(e){var t,n=this,s=e||this;if(e){var r={message:s.$t("Sincronizando mensagens"),duration:4e3};s.$bus.$emit("showSnackBar",r)}return new $.a((t=o()(a.a.mark(function e(t,r){var i;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s.token?T.a.getAll("mensagens").then(function(){var e=o()(a.a.mark(function e(i){var c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s.messages=void 0!==i?i:{},c=0,s.$store.dispatch("message/getMessages").then(function(){var e=o()(a.a.mark(function e(n){var o,i,u;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!Array.isArray(s.messages.all)){e.next=13;break}if(!(s.messages.all.length>0)){e.next=13;break}e.t0=a.a.keys(s.messages.all);case 3:if((e.t1=e.t0()).done){e.next=12;break}if(o=e.t1.value,!s.messages.all.hasOwnProperty(o)){e.next=10;break}if(null!=(i=s.messages.all[o]).enviada){e.next=10;break}return c=i,e.abrupt("break",12);case 10:e.next=3;break;case 12:0==c&&(c=s.messages.all[s.messages.all.length-1]);case 13:return u={pullTracker:{act:"loadchatSince",last:c.criada||0,older:s.older||null,user:s.user.id||null},bateria:s.$store.getters["batteryStatus/level"]||"100"},e.next=16,P(u).then(function(e){var n=e.data;n?(Object(j.c)(n).then(function(){s.$store.dispatch("message/getMessages"),s.$store.dispatch("synchronizationMessages/saveLastSync",{lastSync:Date(Date.now()).toString()})}),n.length>1&&s.$bus.$emit("new-messages",!0),t(n)):r(n)}).catch(function(e){var t=e.data;r(t)});case 16:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}());case 3:case"end":return e.stop()}},e,n)}));return function(t){return e.apply(this,arguments)}}()):(i={msg:s.$t("Token não preenchido!")},console.log("Token não preenchido!"),r(i));case 1:case"end":return e.stop()}},e,n)})),function(e,n){return t.apply(this,arguments)}))},sendChatMessage:function(e){var t,n=this,s=this||e;return new $.a((t=o()(a.a.mark(function e(t,r){var o,i,c,u,l,d;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==s.currentMessage&&""!=s.currentMessage){e.next=9;break}o={message:s.$t("Messagem invalida!"),duration:2e3},s.$bus.$emit("showSnackBar",o),s.$bus.$emit("showSnackBar",o),i={msg:s.$t("Messagem invalida!")},console.log("Messagem invalida!"),r(i),e.next=22;break;case 9:if(s.token){e.next=17;break}c={message:s.$t("Token não preenchido!"),duration:2e3},s.$bus.$emit("showSnackBar",c),u={msg:s.$t("Token não preenchido!")},console.log("Token não preenchido!"),r(u),e.next=22;break;case 17:return l={message:s.$t("Enviando mensagen"),duration:2e3},s.$bus.$emit("showSnackBar",l),d={pullTracker:{act:"responderChat",usoPeloPainel:!1},mensagem:s.currentMessage,chatUser:s.user.id||null,chatAdmin:s.user.id||null},e.next=22,O(d).then(function(e){var n=e.data;console.log("Enviando Messagem"),n?(Object(j.d)(n),s.$store.dispatch("message/saveMessage",{message:n}),s.$store.dispatch("message/setCurrentMessage",{message:""}),t(n)):r(n)}).then(function(){n.scrollDiv()}).catch(function(e){e.data;console.log(d)});case 22:case"end":return e.stop()}},e,n)})),function(e,n){return t.apply(this,arguments)}))},sendChatMessages:function(e){var t,n=this,s=this||e;return new $.a((t=o()(a.a.mark(function e(t,r){var i,c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s.token?Object(j.b)("mensagens").then(function(){var e=o()(a.a.mark(function e(o){var i;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(o.length>0)){e.next=4;break}return i={pullTracker:{act:"responderChatAPP",usoPeloPainel:!1},mensagens:o,chatUser:s.user.id||null,chatAdmin:s.user.id||null},e.next=4,O(i).then(function(e){if(e){for(var n=0;n<o.length;n++){var a=o[n];null==a.entregue&&s.$bus.$emit("mark-message-entregue",!0,a.id)}s.$bus.$emit("new-messages"),t(e)}else console.log("ERRO ENVIO MSGS",e),r(e)});case 4:case"end":return e.stop()}},e,n)}));return function(t){return e.apply(this,arguments)}}()):(i={message:s.$t("Token não preenchido!"),duration:2e3},s.$bus.$emit("showSnackBar",i),c={msg:s.$t("Token não preenchido!")},console.log("Token não preenchido!"),r(c));case 1:case"end":return e.stop()}},e,n)})),function(e,n){return t.apply(this,arguments)}))},mensagemLida:function(e){var t=this,n=this||e,s=new Date,r=s.getFullYear(),i=s.getMonth()+1;i<10&&(i="0"+i.toString());var c=s.getDate();c<10&&(c="0"+c.toString());var u=s.getMinutes();u<10&&(u="0"+u.toString());var l=s.getHours();l<10&&(l="0"+l.toString());var d,g=r+"-"+i+"-"+c+" "+l+":"+u+":00";if(e){var m={message:n.$t("Sincronizando mensagens"),duration:2e3};n.$bus.$emit("showSnackBar",m)}return new $.a((d=o()(a.a.mark(function e(s,r){var o,i,c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==t.msgID&&0!=t.msgID&&""!=t.msgID){e.next=6;break}o={msg:n.$t("Messagem invalida!")},console.log("Messagem invalida!"),r(o),e.next=15;break;case 6:if(n.token){e.next=12;break}i={msg:n.$t("Token não preenchido!")},console.log("Token não preenchido!"),r(i),e.next=15;break;case 12:return c={pullTracker:{act:"mensagemLida"},id:t.msgID,lida:g,user:n.user.id||null,bateria:n.$store.getters["batteryStatus/level"]||"100"},e.next=15,O(c).then(function(){console.log("mensagemLida"),s("Ok")});case 15:case"end":return e.stop()}},e,t)})),function(e,t){return d.apply(this,arguments)}))},mensagemEntregue:function(e){var t=this,n=this||e,s=new Date,r=s.getFullYear(),i=s.getMonth()+1;i<10&&(i="0"+i.toString());var c=s.getDate();c<10&&(c="0"+c.toString());var u=s.getMinutes();u<10&&(u="0"+u.toString());var l=s.getHours();l<10&&(l="0"+l.toString());var d,g=r+"-"+i+"-"+c+" "+l+":"+u+":00";if(e){var m={message:n.$t("Sincronizando mensagens"),duration:2e3};n.$bus.$emit("showSnackBar",m)}return new $.a((d=o()(a.a.mark(function e(s,r){var o,i,c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==t.msgID&&0!=t.msgID&&""!=t.msgID){e.next=6;break}o={msg:n.$t("Messagem invalida!")},console.log("Messagem invalida!"),r(o),e.next=15;break;case 6:if(n.token){e.next=12;break}i={msg:n.$t("Token não preenchido!")},console.log("Token não preenchido!"),r(i),e.next=15;break;case 12:return c={pullTracker:{act:"mensagemEntregue"},id:t.msgID,entregue:g,user:n.user.id||null,bateria:n.$store.getters["batteryStatus/level"]||"100"},e.next=15,O(c).then(function(e){console.log("mensagemLida"),s("Ok")}).catch(function(e){var t={msg:n.$t("Messagem invalida!")};r(t)});case 15:case"end":return e.stop()}},e,t)})),function(e,t){return d.apply(this,arguments)}))},mensagemEnviada:function(e){var t=this,n=this||e,s=new Date,r=s.getFullYear(),i=s.getMonth()+1;i<10&&(i="0"+i.toString());var c=s.getDate();c<10&&(c="0"+c.toString());var u=s.getMinutes();u<10&&(u="0"+u.toString());var l=s.getHours();l<10&&(l="0"+l.toString());var d,g=r+"-"+i+"-"+c+" "+l+":"+u+":00";if(e){var m={message:n.$t("Sincronizando mensagens"),duration:2e3};n.$bus.$emit("showSnackBar",m)}return new $.a((d=o()(a.a.mark(function e(s,r){var o,i,c;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!==t.msgID&&0!=t.msgID&&""!=t.msgID){e.next=6;break}o={msg:n.$t("Messagem invalida!")},console.log("Messagem invalida!"),r(o),e.next=15;break;case 6:if(n.token){e.next=12;break}i={msg:n.$t("Token não preenchido!")},console.log("Token não preenchido!"),r(i),e.next=15;break;case 12:return c={pullTracker:{act:"mensagemEntregue"},id:t.msgID,entregue:g,user:n.user.id||null,bateria:n.$store.getters["batteryStatus/level"]||"100"},e.next=15,O(c).then(function(){console.log("mensagemLida"),s("Ok")});case 15:case"end":return e.stop()}},e,t)})),function(e,t){return d.apply(this,arguments)}))}}},R=n("PqRL"),L={name:"Login",components:{PasswordField:m,RegistrationField:h.a},data:function(){return{error:"",user:{id:"",login:"",senha:"",loginApp:!0},synchronization:null,synchronizationTasks:null,synchronizationMessages:null,version:"1.21.1",nodeEnv:"production",logando:!1}},computed:c()({},Object(v.b)({token:"user/token"})),methods:{goRecoverPasswordPage:function(){this.$router.push("/recover")},goRecoverDataPage:function(){this.$router.push("/recoverData")},login:function(){var e=this;console.log("clicou login"),this.error="",this.logando=!0,Object(f.a)(this.user).then(function(t){var n=t.data;console.log("depois makeuserLogin"),e.saveLogin(n)}).catch(function(t){var n=t.data;console.log(""),e.logando=!1,e.error=e.$t(n.error);var s={message:e.$t(e.error)};e.$bus.$emit("showSnackBar",s)})},saveLogin:function(e){var t=this;return o()(a.a.mark(function n(){var s,r;return a.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(s=t,!e.error){n.next=6;break}t.error=t.$t(e.error),t.logando=!1,n.next=12;break;case 6:return n.next=8,t.$store.dispatch("user/saveToken",{token:e.token});case 8:r={message:t.$t("Login realizado com sucesso!")},t.$root.initNotification(),t.$bus.$emit("showSnackBar",r),t.synchronization.makeUserSync(t).then(function(){var e=o()(a.a.mark(function e(n){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s.$bus.$emit("auth-user",!0),e.next=3,s.$store.dispatch("user/updateUser",{user:n.user}).catch(function(){s.$bus.$emit("auth-user",!1)});case 3:return e.next=5,s.synchronizationTasks.makeTasksSync(t,!0).then(function(e){s.$bus.$emit("tasks-sync",!0),s.$router.push("/details")}).catch(function(){s.$bus.$emit("tasks-sync",!1)});case 5:return e.next=7,s.synchronizationMessages.makeMessagesSync(s).then(function(e){s.$bus.$emit("messages-sync",!0)}).catch(function(e){s.$bus.$emit("messages-sync",!1)});case 7:case"end":return e.stop()}},e,t)}));return function(t){return e.apply(this,arguments)}}());case 12:case"end":return n.stop()}},n,t)}))()},adjustHeight:function(){var e=document.getElementsByTagName("input");if(e.length>0)for(var t=0;t<e.length;t++)e[t].blur();var n=document.documentElement.clientHeight,s=document.getElementById("app");null!=s&&(s.style.height=n+"px"),null!=(s=document.getElementsByClassName("mdl-app")[0])&&(s.style.height=n+"px"),null!=(s=document.getElementsByClassName("mdl-app-content")[0])&&(s.style.height=n+"px")},unSetHeight:function(){document.getElementsByClassName("mdl-app-content")[0].style.height="unset"}},beforeMount:function(){this.logando=!1;var e=p.default.extend(C);this.synchronization=new e;var t=p.default.extend(R.a);this.synchronizationTasks=new t;var n=p.default.extend(B);this.synchronizationMessages=new n},mounted:function(){this.adjustHeight()},destroyed:function(){this.unSetHeight()}},F={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"page-container login",attrs:{id:"app"}},[n("div",{staticClass:"mdl-app"},[n("div",{staticClass:"mdl-app-content"},[e._m(0),e._v(" "),n("div",{staticClass:"centered-container"},[n("div",{staticClass:"mdl-content "},[n("registration-field",{attrs:{model:e.user}}),e._v(" "),n("password-field",{attrs:{model:e.user}}),e._v(" "),n("span",{staticClass:"mdl-error"},[e._v(e._s(e.error))]),e._v(" "),n("span",{staticClass:"mdl-toolbar-section-end"},[0==e.logando?n("button",{staticClass:"mdl-button   orange",on:{click:e.login}},[e._v("\n              "+e._s(e.$t("Entrar"))+"\n            ")]):e._e(),e._v(" "),1==e.logando?n("div",{staticClass:"loading"},[n("label",[e._v("Por favor Aguarde")]),e._v(" "),n("div",{staticClass:"load"})]):e._e()]),e._v(" "),n("p",{staticClass:"mdl-toolbar-section-end"},[e._v(e._s(e.version))]),e._v(" "),n("span",{staticClass:"mdl-toolbar-section-end recoverPaswordText",on:{click:e.goRecoverPasswordPage}},[e._v("\n            "+e._s(e.$t("Recuperar"))),n("br"),e._v(" "+e._s(e.$t("a senha"))+"\n          ")]),e._v(" "),n("br"),e._v(" "),"development"==e.nodeEnv?n("button",{staticClass:"mdl-button mdl-js-button mdl-js-ripple-effect mdl-toolbar-section-end",on:{click:e.goRecoverDataPage}},[e._v("\n            "+e._s(e.$t("Recuperar Dados"))),n("br")]):e._e()],1)])])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"logo"},[t("img",{attrs:{src:n("jkwb")}})])}]};var N=n("VU/8")(L,F,!1,function(e){n("2BJz"),n("7JWy")},"data-v-7ac84802",null);t.default=N.exports}});
//# sourceMappingURL=3.30ca1a06de2bfecaeaca.js.map