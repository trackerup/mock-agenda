webpackJsonp([13],{DjnV:function(t,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var e=i("Xxa5"),a=i.n(e),n=i("exGp"),s=i.n(n),r=i("Dd8w"),l=i.n(r),c=i("NYxO"),d=i("mNdX"),p={name:"Routemap",data:function(){return{mapName:"task-map",tasksMorning:[],tasksEvening:[],tasksNight:[],tasksDawn:[],synchronizationRoute:null,map:null,mapOptions:null,tasks:d.a,today:(new Date).toJSON().slice(0,10)}},computed:l()({},Object(c.b)({user:"user/user",coords:"user/coords",viewDate:"task/viewDate"})),created:function(){var t=this;return s()(a.a.mark(function o(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}},o,t)}))()},beforeMount:function(){},mounted:function(){this.$emit("changeParams",{pageTitle:this.$t("Rota no mapa"),mapMenu:!1,backMenu:!0}),null==this.map&&this.initializeMapRota()},methods:{initializeMapRota:function(){var t=this,o=this.tasks&&this.tasks.length?this.tasks[0]:{latitude:-23.5422851,longitude:-46.6402859};this.mapOptions={center:new window.google.maps.LatLng(o.latitude,o.longitude),zoom:17,mapTypeControl:!1,mapTypeControlOptions:{style:window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,position:window.google.maps.ControlPosition.TOP_LEFT},streetViewControl:!0,streetViewControlOptions:{position:window.google.maps.ControlPosition.RIGHT_BOTTOM},zoomControl:!0,zoomControlOptions:{position:window.google.maps.ControlPosition.RIGHT_BOTTOM},fullscreenControl:!1,mapTypeId:window.google.maps.MapTypeId.ROADMAP};var i=this.$refs[this.mapName];this.map=new window.google.maps.Map(i,this.mapOptions),window.directionsDisplay&&(window.directionsDisplay.setMap(null),window.directionsDisplay=null);var e=this.tasks.filter(function(o){return new Date(o.start.replace(" ","T")).toJSON().slice(0,10)==t.today&&1==o.tipo});e=e.sort(function(t,o){return new Date(o.start.replace(" ","T"))-new Date(t.start.replace(" ","T"))});var a,n,s=[];for(a=0;a<e.length;a++)n=[e[a].latitude,e[a].longitude],s.push(n);t.calculateAndDisplayRoute(s,"#d32f2f")},calculateAndDisplayRoute:function(t,o){var i=new window.google.maps.DirectionsService;window.directionsDisplay=new window.google.maps.DirectionsRenderer({polylineOptions:{strokeColor:o},optimizeWaypoints:!1}),window.directionsDisplay.setMap(this.map);var e=[],a=this.$store.getters["user/coords"];if(a){for(var n=0;n<t.length-1;n++)e.push({location:new window.google.maps.LatLng(t[n][0],t[n][1]),stopover:!0});i.route({origin:new window.google.maps.LatLng(a.latitude,a.longitude),destination:new window.google.maps.LatLng(t[t.length-1][0],t[t.length-1][1]),travelMode:"DRIVING",waypoints:e,optimizeWaypoints:!1,provideRouteAlternatives:!0},function(t,o){"OK"==o&&window.directionsDisplay.setDirections(t)})}else{for(var s=1;s<t.length-1;s++)e.push({location:new window.google.maps.LatLng(t[s][0],t[s][1]),stopover:!0});i.route({origin:new window.google.maps.LatLng(t[0][0],t[0][1]),destination:new window.google.maps.LatLng(t[t.length-1][0],t[t.length-1][1]),travelMode:"DRIVING",waypoints:e,optimizeWaypoints:!1,provideRouteAlternatives:!0},function(t,o){"OK"==o&&window.directionsDisplay.setDirections(t)})}}}},u={render:function(){var t=this,o=t.$createElement,i=t._self._c||o;return i("div",[i("div",{staticClass:"content-page"},[i("div",{ref:t.mapName,staticClass:"google-map"})]),t._v(" "),i("div",{staticClass:"actions-bottom-left"},[i("button",{staticClass:"mdl-button  mdl-button--fab  orange",on:{click:function(o){return t.$router.push("/messages")}}},[i("i",{staticClass:"material-icons message"},[t._v("message")])])])])},staticRenderFns:[]};var g=i("VU/8")(p,u,!1,function(t){i("YG2V")},"data-v-7e3d0a8d",null);o.default=g.exports},YG2V:function(t,o){},mNdX:function(t,o,i){"use strict";var e=new Date,a=new Date(e);a.setDate(a.getDate()+1),e=e.toJSON().slice(0,10),a=a.toJSON().slice(0,10),o.a=[{id:1,idLocal:"Médico 01",start:e+" 08:30",end:e+" 09:00",title:"Médico 01",content:'<i class="material-icons">person</i>',class:"background-secondary-color",latitude:-23.58548212133505,longitude:-46.63585803319513,status:1,category:"HCS",tipo:1},{id:2,idLocal:"Médico 02",start:e+" 09:30",end:e+" 10:00",title:"Médico 02",content:'<i class="material-icons">person</i>',class:"background-primary-color",latitude:-23.591016348606203,longitude:-46.62981923323096,category:"HCS",status:0,tipo:1},{id:3,idLocal:"DROGARIA NOSSA SENHORA DE FATIMA",start:e+" 10:30",end:e+" 11:00",title:"DROGARIA NOSSA SENHORA DE FATIMA",content:'<i class="material-icons">person</i>',class:"background-secondary-color",latitude:-23.59388070622159,longitude:-46.62560117697458,category:"HCS",status:0,tipo:1},{id:4,idLocal:"PDV 01",start:e+" 13:00",end:e+" 14:00",title:"PDV 01",content:'<i class="material-icons">home</i>',class:"background-secondary-color",latitude:-23.597134318127754,longitude:-46.63015303624406,category:"PDV",status:0,tipo:1},{id:5,idLocal:"treinamento",start:e+" 14:00",end:e+" 18:00",title:"treinamento",content:'<i class="material-icons">bookmark</i>',class:"background-primary-color",latitude:-23.59691185150803,longitude:-46.63500835279816,category:"",status:0,tipo:2},{id:6,idLocal:"Reunião Cliente",start:a+" 11:30",end:a+" 12:00",title:"Reunião Cliente",content:'<i class="material-icons">bookmark</i>',class:"background-primary-color",latitude:-23.595966364164745,longitude:-46.640683004020765,category:"",status:0,tipo:2},{id:7,idLocal:"Médico 02",start:a+" 11:30",end:a+" 12:00",title:"Visita Virtal",content:'<i class="material-icons">wifi</i>',class:"background-primary-color",latitude:-23.595966364164745,longitude:-46.640683004020765,category:"HCS",status:0,tipo:3},{id:8,idLocal:"Médico 02",start:a+" 09:00",end:a+" 11:00",title:"Médico 02",content:'<i class="material-icons">person</i>',class:"background-primary-color",latitude:-23.594019751116143,longitude:-46.642352019086246,category:"HCS",status:0,tipo:1},{id:9,idLocal:"DROGARIA NOSSA SENHORA DE FATIMA",start:e+" 11:00",end:e+" 12:00",title:"Visita Virtal",content:'<i class="material-icons">wifi</i>',class:"background-primary-color",category:"HCS",status:0,tipo:3}]}});
//# sourceMappingURL=13.c9eda76f3e63f20b031e.js.map