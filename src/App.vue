<template>
  <div id="app">

    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-top floating-nav">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <img src="../static/logo.png" alt="Crypto-Kaijus" class="logo"/>
        </router-link>

        <ul class="navbar-nav mr-auto">
        </ul>
        <!--<ul class="navbar-nav">-->
          <!--<li class="nav-item d-none d-md-block">-->
            <!--<router-link :to="{ name: 'create' }" class="nav-link">Create Kajiu</router-link>-->
          <!--</li>-->
        <!--</ul>-->
        <ul class="navbar-nav">
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'account' }" class="nav-link">My Kaijus ({{accountKaijus.length}})</router-link>
          </li>
        </ul>
      </nav>
    </header>

    <main role="main" class="container-fluid mt-5">
      <router-view></router-view>
    </main>

    <footer class="footer mt-5">
      <div class="container">
        <div class="row">
          <div class="col-sm text-center">
            <small>
              <router-link :to="{ name: 'home' }">Home</router-link> |
              <!--<router-link :to="{ name: 'create' }">Create Kajius</router-link> |-->
              <router-link :to="{ name: 'account' }">My Kajuis</router-link>
            </small>
            <strong>
              <current-network></current-network>
            </strong>
            <clickable-address :eth-address="contractAddress"></clickable-address>
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
  import ClickableAddress from "./components/widgets/ClickableAddress";

  export default {
    name: 'app',
    components: {ClickableAddress, CurrentNetwork},
    computed: {
      ...mapState(['contractAddress', 'accountKaijus']),
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

  $body-bg: #21285b;
  $body-color: #000;
  $primary: #bd1722;

  $font-family-base: 'Montserrat', Helvetica, Arial, sans-serif;

  @import '../node_modules/bootstrap/scss/bootstrap.scss';

  body {
    margin-bottom: 60px;
    padding-top: 50px;
    padding-bottom: 20px;
  }

  footer {
    color: $body-color;
  }

  .navbar-dark {
    background-color: $body-bg;
  }

  .logo {
    width: 200px;
  }

  main {
    min-height: 400px;
  }

</style>
