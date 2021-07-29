export default function Authenticated (router, store) {
  /**
   * If the user is already authenticated he shouldn't be able to visit
   * pages like login, register, etc...
   */
  router.beforeEach((to, from, next) => {
    return next()
  })
}
