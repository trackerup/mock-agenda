import { empty } from '../utils'

export default function Authenticated (router, store) {
  /**
   * If the user is already authenticated he shouldn't be able to visit
   * pages like login, register, etc...
   */
  router.beforeEach((to, from, next) => {
    const token = store.getters['user/token'] || window.localStorage.getItem('token')

    const routesCanSeeWithoutLogin = [ 'auth.login', 'auth.recover.password', 'auth.recover.data' ]
    if (!empty(token)) {
      store.dispatch('user/saveToken', {
        token: token
      })
      if (routesCanSeeWithoutLogin.includes(to.name)) {
        return next({path: '/details'})
      }

      if (empty(to.name)) {
        return next({path: '/login'})
      }
    } else if (empty(token) && to.name != 'auth.login') {
      if (!routesCanSeeWithoutLogin.includes(to.name)) {
        store.dispatch('user/logout')
        return next({path: '/login'})
      }
    }

    return next()
  })
}
