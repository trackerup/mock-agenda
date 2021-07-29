const Schedule = () => import('./Schedule').then(m => m.default || m)

export default [
  {
    path: '/schedule',
    name: 'schedule.index',
    component: Schedule
  }
]
