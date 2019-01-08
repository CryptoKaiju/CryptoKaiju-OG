import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/components/pages/HomePage';
import KaijusCreator from '@/components/pages/KaijusCreator';
import Account from '@/components/pages/Account';
import Token from '@/components/pages/Token';
import Traits from '@/components/pages/Traits';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/create',
      name: 'create',
      component: KaijusCreator
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/traits',
      name: 'traits',
      component: Traits
    },
    {
      path: '/token/:tokenId',
      name: 'token',
      component: Token,
      props: true
    }
  ]
});
