import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import Admin from '@/components/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
