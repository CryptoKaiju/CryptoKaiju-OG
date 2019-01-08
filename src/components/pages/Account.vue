<template>
  <div class="container">

    <h2>My Kaijus <span class="badge badge-primary">{{accountKaijus.length}}</span></h2>
    <p>
      <clickable-address :eth-address="account"></clickable-address>
    </p>

    <div class="row mt-5" v-if="!accountKaijus || accountKaijus.length === 0">
      <div class="col text-center">
        <code>You don't own any kaijus yet...</code>
        <br/>
        <a href="https://cryptokaiju.io/shop/" target="_blank" class="btn btn-primary btn-lg mt-5">Buy now</a>
      </div>
    </div>

    <div class="row text-center mt-5" v-else>
      <div class="card-deck">
        <div class="mb-5" v-for="card in accountKaijus" :key="card.tokenId">
          <card :cdata="card" class="m-2"></card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';
  import ClickableTransaction from '../widgets/ClickableTransaction';
  import ClickableAddress from '../widgets/ClickableAddress';
  import Card from '../widgets/Card';

  export default {
    name: 'account',
    components: {Card, ClickableTransaction, ClickableAddress},
    computed: {
      ...mapState(['account', 'accountKaijus', 'transfers']),
      ...mapGetters(['findTx'])
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

<style lang="scss" scoped>
  .card-body {
    padding-top: 0 !important;
  }

  .card-img-top {
    width: 170px;
    height: 250px;
  }
</style>
