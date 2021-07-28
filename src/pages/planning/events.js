let today = new Date()
let tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

today = today.toJSON().slice(0, 10)
tomorrow = tomorrow.toJSON().slice(0, 10)

export default [
  {
    id: 1,
    idLocal: 'Médico 01',
    start: today + ' 08:30',
    end: today + ' 09:00',
    title: 'Médico 01',
    content: '<i class="v-icon material-icons">account</i>',
    class: 'background-secondary-color-light',
    latitude: -23.58548212133505,
    longitude: -46.63585803319513,
    tipo: 1
  },
  {
    id: 4,
    idLocal: 'Médico 02',
    start: today + ' 09:30',
    end: today + ' 10:00',
    title: 'Médico 02',
    content: '<i class="v-icon material-icons">account</i>',
    class: 'background-primary-color',
    latitude: -23.591016348606203,
    longitude: -46.62981923323096,
    tipo: 1
  },
  {
    id: 5,
    idLocal: 'Médico 03',
    start: today + ' 10:30',
    end: today + ' 11:00',
    title: 'Médico 03',
    content: '<i class="v-icon material-icons">account</i>',
    class: 'background-secondary-color-light',
    latitude: -23.59388070622159,
    longitude: -46.62560117697458,
    tipo: 1
  },
  {
    id: 6,
    idLocal: 'PDV 01',
    start: today + ' 11:30',
    end: today + ' 12:00',
    title: 'PDV 01',
    content: '<i class="v-icon material-icons">bank</i>',
    class: 'background-secondary-color-light',
    latitude: -23.597134318127754,
    longitude: -46.63015303624406,
    tipo: 1
  },
  {
    id: 7,
    idLocal: 'treinamento',
    start: today + ' 13:00',
    end: today + ' 18:00',
    title: 'treinamento',
    content: '<i class="v-icon material-icons">alert</i>',
    class: 'background-primary-color',
    latitude: -23.59691185150803,
    longitude: -46.63500835279816
  },
  {
    id: 2,
    idLocal: 'Reunião Cliente',
    start: tomorrow + ' 11:30',
    end: tomorrow + ' 12:00',
    title: 'Reunião Cliente',
    content: '<i class="v-icon material-icons">alert</i>',
    class: 'background-primary-color',
    latitude: -23.595966364164745,
    longitude: -46.640683004020765
  },
  {
    id: 3,
    idLocal: 'Médico 02',
    start: tomorrow + ' 09:00',
    end: tomorrow + ' 11:00',
    title: 'Médico 02',
    content: '<i class="v-icon material-icons">account</i>',
    class: 'background-primary-color',
    latitude: -23.594019751116143,
    longitude: -46.642352019086246,
    tipo: 1
  }
]
