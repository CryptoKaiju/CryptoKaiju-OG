<template>
  <div id="app">

    <header>
      <nav class="navbar navbar-expand-md navbar-light bg-white text-primary fixed-top floating-nav">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <h3 class="text-muted">Crypto Kaijus
            <small>eating the world one vinyl figure at at time</small>
          </h3>
        </router-link>

        <ul class="navbar-nav mr-auto">
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item d-none d-md-block">
            <router-link :to="{ name: 'create' }" class="nav-link">Create Kajius</router-link>
          </li>
          <li class="nav-item nav-link">
              Account (TODO)
          </li>
        </ul>
      </nav>
    </header>

    <main role="main" class="container-fluid">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-sm text-center">
            <small>
              <router-link :to="{ name: 'home' }">Home</router-link> &bull;
              <router-link :to="{ name: 'create' }">Create Kajius</router-link> &bull;
            </small>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3'
  import {mapGetters, mapState} from 'vuex'
  import * as actions from './store/actions'
  import * as mutations from './store/mutation-types'
  import CurrentNetwork from './components/widgets/CurrentNetwork'

  export default {
    name: 'app',
    components: {CurrentNetwork},
    computed: {
      ...mapGetters([]),
    },
    mounted() {

      let bootStrappedWeb3;

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        bootStrappedWeb3 = new Web3(web3.currentProvider);
      } else {
        console.log('No web3! You should consider trying MetaMask or an Ethereum browser');
        console.log('Falling back to using HTTP Provider');

        bootStrappedWeb3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/nbCbdzC6IG9CF6hmvAVQ'));
      }

      window.web3 = bootStrappedWeb3;

      // Bootstrap the full app
      this.$store.dispatch(actions.INIT_APP, bootStrappedWeb3);
    },
  }
</script>

<style lang="scss">

  body {
    margin-bottom: 60px;
    padding-top: 50px;
    padding-bottom: 20px;
  }
</style>
