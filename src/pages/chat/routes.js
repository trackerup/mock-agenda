const Messages = () => import('./Messages').then(m => m.default || m)

export default [
  {
    path: '/messages',
    name: 'chat.messages',
    component: Messages
  }
]
