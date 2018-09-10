import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/pages/HomePage'

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    }
  ]
})
