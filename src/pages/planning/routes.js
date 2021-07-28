const Planning = () => import('./Planning').then(m => m.default || m)

export default [
  {
    path: '/planning',
    name: 'planning.index',
    component: Planning
  }
]
