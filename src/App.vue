<template>
  <div id="app">

    <header>
      <nav class="navbar navbar-expand-md">
        <router-link :to="{ name: 'home' }" class="navbar-brand">
          <img src="../static/logo.png" alt="Crypto-Kaijus" class="logo"/>
          <code class="small ml-2 text-muted d-none d-md-inline-block">Alpha</code>
        </router-link>

        <ul class="navbar-nav mr-auto">
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'home' }" class="nav-link d-none d-md-block">
              Home
            </router-link>
          </li>
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'traits' }" class="nav-link d-none d-md-block">
              Traits
            </router-link>
          </li>
          <li class="nav-item nav-link">
            <router-link :to="{ name: 'account' }" class="nav-link">
              My Kaiju
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

    <main role="main" class="container-fluid">
      <router-view></router-view>
    </main>

    <footer class="footer container-fluid mt-5">
      <div class="row">
        <div class="col text-left d-none d-md-inline-block">
          <small>
            Built by
            <a href="http://blockrocket.tech" target="_blank">
              <img src="../static/BR_stack_black-01.png" style="max-height: 25px" title="Built by BlockRocket.tech" class="ml-2"/>
            </a>
            <a href="https://knownorigin.io/" target="_blank">
              <img src="../static/KO_icon_Round.1.svg" style="max-height: 25px" title="Powered by KnownOrigin.io" class="ml-2"/>
            </a>
          </small>
        </div>
        <div class="col text-center small">
          <router-link :to="{ name: 'home' }">Home</router-link>
          &bull;
          <router-link :to="{ name: 'account' }">My Kaiju</router-link>
        </div>
        <div class="col text-right small">
          <current-network></current-network>
          [<clickable-address :eth-address="contractAddress"></clickable-address>]
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
    async mounted () {

      let bootStrappedWeb3;

      // Modern dapp browsers...
      if (window.ethereum) {
        console.log(`Using post-Nov 2nd (approval) MetaMask`);
        bootStrappedWeb3 = new Web3(ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          console.log(`Enabled`);

          this.web3Detected = true;
        } catch (error) {
          // User denied account access...
          console.log(error);

          this.web3Detected = false;
        }
      } else if (window.web3) {
        console.log(`Using pre-Nov 2nd MetaMask`);
        bootStrappedWeb3 = new Web3(web3.currentProvider);

        this.web3Detected = true;
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

        this.web3Detected = false;
      }

      if (bootStrappedWeb3) {
        window.web3 = bootStrappedWeb3;
        // Bootstrap the full app
        this.$store.dispatch(actions.INIT_APP, bootStrappedWeb3);
      } else {
        this.$store.dispatch(actions.LOAD_ALL_KAIJUS);
      }
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

  $body-bg: #f5f5f5;
  $body-color: #1f2760;
  $primary: #ff005c;
  $secondary: #fff0f2;
  $gray: #707070;
  $black: #040505;
  $white: #f5f5f5;

  $border-radius-base: 50;

  @import url('https://fonts.googleapis.com/css?family=Open+Sans');

  $font-family-base: 'Open Sans', sans-serif;

  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  @import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

  .btn, .form-control { border-radius: 25px; }

  body {
      background-color: $body-bg;
  }

  #app {
    background-image: url(../static/Header_12.png);
    background-position: right 0px top 0px;
    background-repeat: no-repeat;
  }

  footer {
    color: $gray;

    a {
      color: $gray;
    }

    a:visited {
      color: $gray;
    }

    a:hover {
      color: $gray;
    }

    margin-bottom: 30px;
  }

  .nav-link {
    color: $white;

    a:visited {
      color: $white;
    }

    a:hover {
      color: $white;
    }
  }

  code {
    color: $primary;
  }


  .logo {
    width: 200px;
  }

  main {
    min-height: 400px;
    margin-bottom: 100px;
    margin-top: 100px;
  }

  .card {
    color: $body-color;
    background-color: $secondary;
  }

  .list-group-item {
    color: $gray;
    background-color: $body-color;
  }

  .no-metamask {
    background-color: $primary;

    a {
      color: $white;
    }
  }
  .hand-pointer {
    cursor: pointer !important;
  }
</style>
