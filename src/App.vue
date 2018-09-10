<template>
  <div id="app">
    <div class="container">

      <div class="header clearfix">
        <h3 class="text-muted">Crypto Kaijus
          <b-badge>
            <current-network></current-network>
          </b-badge>
        </h3>
      </div>

      <router-view></router-view>

      <div class="footer">
        <hr/>
        <b-badge>
          <current-network></current-network>
        </b-badge>
      </div>

    </div>

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

  #app {

  }

  .header {
    margin: 20px;
  }
</style>
