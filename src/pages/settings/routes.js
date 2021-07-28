const Settings = () => import('./Settings').then(m => m.default || m)

export default [
  {
    path: '/settings',
    name: 'settings.index',
    component: Settings
  }
]
