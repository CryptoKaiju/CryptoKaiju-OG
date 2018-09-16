<template>
  <div class="container">

    <h2>My Kaijus ({{accountKaijus.length}})</h2>
    <p>
      <clickable-address :eth-address="account"></clickable-address>
    </p>

    <div class="card-group">
      <div class="card m-4" v-for="account in accountKaijus">
        <div class="card-body">
          <img :src="account.ipfsData.image" class="float-right" style="max-width: 100px"/>
          <h5 class="card-title">{{account.ipfsData.name}}</h5>
          <p class="card-text">{{account.ipfsData.description}}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Token ID: {{account.tokenId}}</li>
          <li class="list-group-item"> NFC ID: {{account.nfcId}}</li>
          <li class="list-group-item">DOB: {{account.dob}}</li>
        </ul>
        <div class="card-footer">
          <small>
            {{account}}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as _ from 'lodash';
  import * as moment from 'moment';
  import Web3 from 'web3';
  import * as actions from '../../store/actions';
  import ClickableAddress from '../widgets/ClickableAddress';

  export default {
    name: 'account',
    components: {ClickableAddress},
    computed: {
      ...mapState(['account', 'accountKaijus'])
    },
    mounted () {

    },
    methods: {},
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
    },
  };
</script>

<style lang="scss" scoped>


</style>
