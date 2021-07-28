const Login = () => import('./Login').then(m => m.default || m)
const RecoverPassword = () => import('./RecoverPassword').then(m => m.default || m)
const RecoverData = () => import('./RecoverData').then(m => m.default || m)
const UserDetails = () => import('./UserDetails').then(m => m.default || m)

export default [
  {
    path: '/login',
    name: 'auth.login',
    component: Login
  },
  {
    path: '/recover',
    name: 'auth.recover.password',
    component: RecoverPassword
  },
  {
    path: '/recoverData',
    name: 'auth.recover.data',
    component: RecoverData
  },
  {
    path: '/details',
    name: 'auth.user.details',
    component: UserDetails
  }
]
