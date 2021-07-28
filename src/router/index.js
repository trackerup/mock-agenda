import Vue from 'vue'
import Router from 'vue-router'
import { scrollBehavior } from '@/utils'
// Application routes
import AuthRoutes from '@/pages/auth/routes'
import TasksRoutes from '@/pages/tasks/routes'
import ChatRoutes from '@/pages/chat/routes'
import MapRoutes from '@/pages/map/routes'
import SettingsRoutes from '@/pages/settings/routes'
import PlanningRoutes from '@/pages/planning/routes'
import Authenticated from '@/middleware/auth'
import Locale from '@/middleware/locale'
import store from '../store'

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'abstract',
  scrollBehavior,
  routes: [
    ...AuthRoutes,
    ...TasksRoutes,
    ...ChatRoutes,
    ...SettingsRoutes,
    ...PlanningRoutes,
    ...MapRoutes
  ]
})

Authenticated(router, store)
Locale(router, store)

const waitForStorageToBeReady = async (to, from, next) => {
  next()
}
router.beforeEach(waitForStorageToBeReady)

export default router
