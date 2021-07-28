const Routemap = () => import('./Routemap').then(m => m.default || m)
const RoutemapEvent = () => import('./RoutemapEvent').then(m => m.default || m)

export default [
  {
    path: '/routeMap',
    name: 'map.routemap',
    component: Routemap
  },
  {
    path: '/routeMapEvent',
    name: 'map.routemap.event',
    component: RoutemapEvent
  }
]
