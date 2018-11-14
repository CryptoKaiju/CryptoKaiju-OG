<template>
  <div id="app">

    <header>
      <nav class="navbar navbar-expand-md navbar-dark fixed-top floating-nav">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <img src="../static/logo.png" alt="Crypto-Kaijus" class="logo"/>
          <code class="small ml-2 text-secondary d-none d-md-inline-block">Alpha</code>
        </router-link>

        <ul class="navbar-nav mr-auto">
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'account' }" class="nav-link">
              My Kaijus
              <span class="ml-2 badge badge-primary">{{accountKaijus.length}}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <div class="container-fluid mt-5" v-if="!web3Detected">
      <div class="row no-metamask text-center">
        <div class="col mt-2 mb-2">
          <img src="../static/metamask.png" style="max-height: 35px" class="mr-3"/> Please install the <code><a href="https://metamask.io/" target="_blank">METAMASK</a></code> extension to interact with the Ethereum blockchain
        </div>
      </div>
    </div>

    <main role="main" class="container-fluid mt-5">
      <router-view></router-view>
    </main>

    <footer class="footer container-fluid mt-5">
      <div class="row">
        <div class="col text-left d-none d-md-inline-block">
          <small>
            <img src="../static/KO.png" style="max-height: 50px" title="Powered by KnownOrigin.io"/>
          </small>
        </div>
        <div class="col text-center small">
          <router-link :to="{ name: 'home' }">Home</router-link>
          <span class="text-primary">&bull;</span>
          <router-link :to="{ name: 'account' }">My Kajuis</router-link>
        </div>
        <div class="col text-right small text-muted">
          <current-network></current-network>
          <br/>
          <clickable-address :eth-address="contractAddress"></clickable-address>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
  /* global web3:true */

  import Web3 from 'web3';
  import { mapGetters, mapState } from 'vuex';
  import * as actions from './store/actions';
  import * as mutations from './store/mutation-types';
  import CurrentNetwork from './components/widgets/CurrentNetwork';
  import ClickableAddress from './components/widgets/ClickableAddress';

  export default {
    name: 'app',
    components: {ClickableAddress, CurrentNetwork},
    data () {
      return {
        web3Detected: true
      };
    },
    computed: {
      ...mapState(['contractAddress', 'accountKaijus', 'account']),
    },
    mounted () {

      let bootStrappedWeb3;

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        bootStrappedWeb3 = new Web3(web3.currentProvider);

        this.web3Detected = true;
      } else {
        console.log('No web3! You should consider trying MetaMask or an Ethereum browser');
        console.log('Falling back to using HTTP Provider');

        this.web3Detected = false;

        bootStrappedWeb3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/nbCbdzC6IG9CF6hmvAVQ'));
      }

      window.web3 = bootStrappedWeb3;

      // Bootstrap the full app
      this.$store.dispatch(actions.INIT_APP, bootStrappedWeb3);
    },
    created () {
      const loadData = function () {
        this.$store.dispatch(actions.LOAD_ACCOUNT_KAIJUS, {account: this.account});
      }.bind(this);

      this.$store.watch(
        () => this.$store.state.account,
        () => loadData()
      );

      if (this.$store.state.account) {
        loadData();
      }
    }
  };
</script>

<style lang="scss">

  $body-bg: #21285b;
  $body-color: #FFF;
  $primary: #bd1722;

  @import url('https://fonts.googleapis.com/css?family=Montserrat');

  $font-family-base: 'Montserrat', Helvetica, Arial, sans-serif;

  @import '../node_modules/bootstrap/scss/bootstrap.scss';

  body {
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
    margin-bottom: 100px;
  }

  .card {
    color: #040505;
    background-color: #F5F5F5;
  }

  .list-group-item {
    color: #383838;
    background-color: #F5F5F5;
  }

  .no-metamask {
    background-color: #e83e8c;

    a {
      color: white;
    }
  }

</style>
